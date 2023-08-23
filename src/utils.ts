/*global AsyncIterableIterator*/
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {createReadStream, promises as fs} from 'fs'
import {readFile} from 'fs/promises'
import {flattenDeep} from 'lodash'
import mm from 'micromatch'
import * as path from 'path'
import {createInterface} from 'readline'
import {parseDocument} from 'yaml'
import {ChangedFiles, ChangeTypeEnum} from './changedFiles'

import {Inputs} from './inputs'

const MINIMUM_GIT_VERSION = '2.18.0'

export const isWindows = (): boolean => {
  return process.platform === 'win32'
}

/**
 * Normalize file path separators to '/' on Linux/macOS and '\\' on Windows
 * @param p - file path
 * @returns file path with normalized separators
 */
export const normalizeSeparators = (p: string): string => {
  // Windows
  if (isWindows()) {
    // Convert slashes on Windows
    p = p.replace(/\//g, '\\')

    // Remove redundant slashes
    const isUnc = /^\\\\+[^\\]/.test(p) // e.g. \\hello
    return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\') // preserve leading \\ for UNC
  }

  // Remove redundant slashes
  return p.replace(/\/\/+/g, '/')
}

/**
 * Trims unnecessary trailing slash from file path
 * @param p - file path
 * @returns file path without unnecessary trailing slash
 */
const safeTrimTrailingSeparator = (p: string): string => {
  // Empty path
  if (!p) {
    return ''
  }

  // Normalize separators
  p = normalizeSeparators(p)

  // No trailing slash
  if (!p.endsWith(path.sep)) {
    return p
  }

  // Check '/' on Linux/macOS and '\' on Windows
  if (p === path.sep) {
    return p
  }

  // On Windows, avoid trimming the drive root, e.g. C:\ or \\hello
  if (isWindows() && /^[A-Z]:\\$/i.test(p)) {
    return p
  }

  // Trim trailing slash
  return p.substring(0, p.length - 1)
}

/**
 * Gets the dirname of a path, similar to the Node.js path.dirname() function except that this function
 * also works for Windows UNC root paths, e.g. \\hello\world
 * @param p - file path
 * @returns dirname of path
 */
export const getDirname = (p: string): string => {
  // Normalize slashes and trim unnecessary trailing slash
  p = safeTrimTrailingSeparator(p)

  // Windows UNC root, e.g. \\hello or \\hello\world
  if (isWindows() && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
    return p
  }

  // Get dirname
  let result = path.dirname(p)

  // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
  if (isWindows() && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
    result = safeTrimTrailingSeparator(result)
  }

  return result
}

/**
 * Converts the version string to a number
 * @param version - version string
 * @returns version number
 */
const versionToNumber = (version: string): number => {
  const [major, minor, patch] = version.split('.').map(Number)
  return major * 1000000 + minor * 1000 + patch
}

/**
 * Verifies the minimum required git version
 * @returns minimum required git version
 * @throws Minimum git version requirement is not met
 * @throws Git is not installed
 * @throws Git is not found in PATH
 * @throws An unexpected error occurred
 */
export const verifyMinimumGitVersion = async (): Promise<void> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['--version'],
    {silent: !core.isDebug()}
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'An unexpected error occurred')
  }

  const gitVersion = stdout.trim()

  if (versionToNumber(gitVersion) < versionToNumber(MINIMUM_GIT_VERSION)) {
    throw new Error(
      `Minimum required git version is ${MINIMUM_GIT_VERSION}, your version is ${gitVersion}`
    )
  }
}

/**
 * Checks if a path exists
 * @param filePath - path to check
 * @returns path exists
 */
const exists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Generates lines of a file as an async iterable iterator
 * @param filePath - path of file to read
 * @param excludedFiles - whether to exclude files
 */
async function* lineOfFileGenerator({
  filePath,
  excludedFiles
}: {
  filePath: string
  excludedFiles: boolean
}): AsyncIterableIterator<string> {
  const fileStream = createReadStream(filePath)
  /* istanbul ignore next */
  fileStream.on('error', error => {
    throw error
  })
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  for await (const line of rl) {
    if (!line.startsWith('#') && line !== '') {
      if (excludedFiles) {
        if (line.startsWith('!')) {
          yield line
        } else {
          yield `!${line}`
        }
      } else {
        yield line
      }
    }
  }
}

/**
 * Gets the file patterns from a source file
 * @param filePaths - paths of files to read
 * @param excludedFiles - whether to exclude the file patterns
 */
const getFilesFromSourceFile = async ({
  filePaths,
  excludedFiles = false
}: {
  filePaths: string[]
  excludedFiles?: boolean
}): Promise<string[]> => {
  const lines: string[] = []
  for (const filePath of filePaths) {
    for await (const line of lineOfFileGenerator({filePath, excludedFiles})) {
      lines.push(line)
    }
  }
  return lines
}

/**
 * Sets the global git configs
 * @param name - name of config
 * @param value - value of config
 * @throws Couldn't update git global config
 */
export const updateGitGlobalConfig = async ({
  name,
  value
}: {
  name: string
  value: string
}): Promise<void> => {
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['config', '--global', name, value],
    {
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0 || stderr) {
    core.warning(stderr || `Couldn't update git global config ${name}`)
  }
}

/**
 * Checks if a git repository is shallow
 * @param cwd - working directory
 * @returns repository is shallow
 */
export const isRepoShallow = async ({cwd}: {cwd: string}): Promise<boolean> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--is-shallow-repository'],
    {
      cwd,
      silent: !core.isDebug()
    }
  )

  return stdout.trim() === 'true'
}

/**
 * Checks if a submodule exists
 * @param cwd - working directory
 * @returns submodule exists
 */
export const submoduleExists = async ({
  cwd
}: {
  cwd: string
}): Promise<boolean> => {
  const {stdout, exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['submodule', 'status'],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't list submodules")
    return false
  }

  return stdout.trim() !== ''
}

/**
 * Fetches the git repository
 * @param args - arguments for fetch command
 * @param cwd - working directory
 */
export const gitFetch = async ({
  args,
  cwd
}: {
  args: string[]
  cwd: string
}): Promise<number> => {
  const {exitCode} = await exec.getExecOutput('git', ['fetch', '-q', ...args], {
    cwd,
    ignoreReturnCode: true,
    silent: !core.isDebug()
  })

  return exitCode
}

/**
 * Fetches the git repository submodules
 * @param args - arguments for fetch command
 * @param cwd - working directory
 */
export const gitFetchSubmodules = async ({
  args,
  cwd
}: {
  args: string[]
  cwd: string
}): Promise<void> => {
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['submodule', 'foreach', 'git', 'fetch', '-q', ...args],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't fetch submodules")
  }
}

/**
 * Retrieves all the submodule paths
 * @param cwd - working directory
 */
export const getSubmodulePath = async ({
  cwd
}: {
  cwd: string
}): Promise<string[]> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['submodule', 'status'],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't get submodule names")
    return []
  }

  return stdout
    .trim()
    .split('\n')
    .map((line: string) => normalizeSeparators(line.trim().split(' ')[1]))
}

/**
 * Retrieves commit sha of a submodule from a parent commit
 * @param cwd - working directory
 * @param parentSha1 - parent commit sha
 * @param parentSha2 - parent commit sha
 * @param submodulePath - path of submodule
 * @param diff - diff type between parent commits (`..` or `...`)
 */
export const gitSubmoduleDiffSHA = async ({
  cwd,
  parentSha1,
  parentSha2,
  submodulePath,
  diff
}: {
  cwd: string
  parentSha1: string
  parentSha2: string
  submodulePath: string
  diff: string
}): Promise<{previousSha?: string; currentSha?: string}> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['diff', `${parentSha1}${diff}${parentSha2}`, '--', submodulePath],
    {
      cwd,
      silent: !core.isDebug()
    }
  )

  const subprojectCommitPreRegex =
    /^(?<preCommit>-)Subproject commit (?<commitHash>.+)$/m
  const subprojectCommitCurRegex =
    /^(?<curCommit>\+)Subproject commit (?<commitHash>.+)$/m

  const previousSha =
    subprojectCommitPreRegex.exec(stdout)?.groups?.commitHash ||
    '4b825dc642cb6eb9a060e54bf8d69288fbee4904'
  const currentSha = subprojectCommitCurRegex.exec(stdout)?.groups?.commitHash

  if (currentSha) {
    return {previousSha, currentSha}
  }

  core.debug(
    `No submodule commit found for ${submodulePath} between ${parentSha1}${diff}${parentSha2}`
  )
  return {}
}

export const gitRenamedFiles = async ({
  cwd,
  sha1,
  sha2,
  diff,
  oldNewSeparator,
  isSubmodule = false,
  parentDir = ''
}: {
  cwd: string
  sha1: string
  sha2: string
  diff: string
  oldNewSeparator: string
  isSubmodule?: boolean
  parentDir?: string
}): Promise<string[]> => {
  const {exitCode, stderr, stdout} = await exec.getExecOutput(
    'git',
    [
      'diff',
      '--name-status',
      '--ignore-submodules=all',
      '--diff-filter=R',
      `${sha1}${diff}${sha2}`
    ],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    if (isSubmodule) {
      core.warning(
        stderr ||
          `Failed to get renamed files for submodule between: ${sha1}${diff}${sha2}`
      )
      core.warning(
        'Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage'
      )
    } else {
      core.error(
        stderr || `Failed to get renamed files between: ${sha1}${diff}${sha2}`
      )
      throw new Error('Unable to get renamed files')
    }

    return []
  }

  return stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line: string) => {
      core.debug(`Renamed file: ${line}`)
      const [, oldPath, newPath] = line.split('\t')
      if (isSubmodule) {
        return `${normalizeSeparators(
          path.join(parentDir, oldPath)
        )}${oldNewSeparator}${normalizeSeparators(
          path.join(parentDir, newPath)
        )}`
      }
      return `${normalizeSeparators(
        oldPath
      )}${oldNewSeparator}${normalizeSeparators(newPath)}`
    })
}

/**
 * Retrieves all the changed files between two commits
 * @param cwd - working directory
 * @param sha1 - commit sha
 * @param sha2 - commit sha
 * @param diff - diff type between parent commits (`..` or `...`)
 * @param isSubmodule - is the repo a submodule
 * @param parentDir - parent directory of the submodule
 * @param outputRenamedFilesAsDeletedAndAdded - output renamed files as deleted and added
 */
export const getAllChangedFiles = async ({
  cwd,
  sha1,
  sha2,
  diff,
  isSubmodule = false,
  parentDir = '',
  outputRenamedFilesAsDeletedAndAdded = false
}: {
  cwd: string
  sha1: string
  sha2: string
  diff: string
  isSubmodule?: boolean
  parentDir?: string
  outputRenamedFilesAsDeletedAndAdded?: boolean
}): Promise<ChangedFiles> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    [
      'diff',
      '--name-status',
      '--ignore-submodules=all',
      `--diff-filter=ACDMRTUX`,
      `${sha1}${diff}${sha2}`
    ],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )
  const changedFiles: ChangedFiles = {
    [ChangeTypeEnum.Added]: [],
    [ChangeTypeEnum.Copied]: [],
    [ChangeTypeEnum.Deleted]: [],
    [ChangeTypeEnum.Modified]: [],
    [ChangeTypeEnum.Renamed]: [],
    [ChangeTypeEnum.TypeChanged]: [],
    [ChangeTypeEnum.Unmerged]: [],
    [ChangeTypeEnum.Unknown]: []
  }

  if (exitCode !== 0) {
    if (isSubmodule) {
      core.warning(
        stderr ||
          `Failed to get changed files for submodule between: ${sha1}${diff}${sha2}`
      )
      core.warning(
        'Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage'
      )
    } else {
      core.warning(
        stderr || `Failed to get changed files between: ${sha1}${diff}${sha2}`
      )
    }

    return changedFiles
  }

  const lines = stdout.split('\n').filter(Boolean)

  for (const line of lines) {
    const [changeType, filePath, newPath = ''] = line.split('\t')
    const normalizedFilePath = isSubmodule
      ? normalizeSeparators(path.join(parentDir, filePath))
      : normalizeSeparators(filePath)
    const normalizedNewPath = isSubmodule
      ? normalizeSeparators(path.join(parentDir, newPath))
      : normalizeSeparators(newPath)

    if (changeType.startsWith('R')) {
      if (outputRenamedFilesAsDeletedAndAdded) {
        changedFiles[ChangeTypeEnum.Deleted].push(normalizedFilePath)
        changedFiles[ChangeTypeEnum.Added].push(normalizedNewPath)
      } else {
        changedFiles[ChangeTypeEnum.Renamed].push(normalizedNewPath)
      }
    } else {
      changedFiles[changeType as ChangeTypeEnum].push(normalizedFilePath)
    }
  }
  return changedFiles
}

/**
 * Filters the changed files by the file patterns
 * @param allDiffFiles - all the changed files
 * @param filePatterns - file patterns to filter by
 */
export const getFilteredChangedFiles = async ({
  allDiffFiles,
  filePatterns
}: {
  allDiffFiles: ChangedFiles
  filePatterns: string[]
}): Promise<ChangedFiles> => {
  const changedFiles: ChangedFiles = {
    [ChangeTypeEnum.Added]: [],
    [ChangeTypeEnum.Copied]: [],
    [ChangeTypeEnum.Deleted]: [],
    [ChangeTypeEnum.Modified]: [],
    [ChangeTypeEnum.Renamed]: [],
    [ChangeTypeEnum.TypeChanged]: [],
    [ChangeTypeEnum.Unmerged]: [],
    [ChangeTypeEnum.Unknown]: []
  }
  const hasFilePatterns = filePatterns.length > 0
  const isWin = isWindows()

  for (const changeType of Object.keys(allDiffFiles)) {
    const files = allDiffFiles[changeType as ChangeTypeEnum]
    if (hasFilePatterns) {
      changedFiles[changeType as ChangeTypeEnum] = mm(files, filePatterns, {
        dot: true,
        windows: isWin,
        noext: true
      }).map(normalizeSeparators)
    } else {
      changedFiles[changeType as ChangeTypeEnum] = files
    }
  }

  return changedFiles
}

export const gitLog = async ({
  args,
  cwd
}: {
  args: string[]
  cwd: string
}): Promise<string> => {
  const {stdout} = await exec.getExecOutput('git', ['log', ...args], {
    cwd,
    silent: !core.isDebug()
  })

  return stdout.trim()
}

export const getHeadSha = async ({cwd}: {cwd: string}): Promise<string> => {
  const {stdout} = await exec.getExecOutput('git', ['rev-parse', 'HEAD'], {
    cwd,
    silent: !core.isDebug()
  })

  return stdout.trim()
}

export const isInsideWorkTree = async ({
  cwd
}: {
  cwd: string
}): Promise<boolean> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--is-inside-work-tree'],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  return stdout.trim() === 'true'
}

export const getRemoteBranchHeadSha = async ({
  cwd,
  branch
}: {
  cwd: string
  branch: string
}): Promise<string> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['rev-parse', `origin/${branch}`],
    {
      cwd,
      silent: !core.isDebug()
    }
  )

  return stdout.trim()
}

export const getParentSha = async ({cwd}: {cwd: string}): Promise<string> => {
  const {stdout, exitCode} = await exec.getExecOutput(
    'git',
    ['rev-list', '-n', '1', 'HEAD^'],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    return ''
  }

  return stdout.trim()
}

export const verifyCommitSha = async ({
  sha,
  cwd,
  showAsErrorMessage = true
}: {
  sha: string
  cwd: string
  showAsErrorMessage?: boolean
}): Promise<number> => {
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--verify', `${sha}^{commit}`],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    if (showAsErrorMessage) {
      core.error(`Unable to locate the commit sha: ${sha}`)
      core.error(
        "Please verify that the commit sha is correct, and increase the 'fetch_depth' input if needed"
      )
      core.debug(stderr)
    } else {
      core.warning(`Unable to locate the commit sha: ${sha}`)
      core.debug(stderr)
    }
  }

  return exitCode
}

export const getPreviousGitTag = async ({
  cwd
}: {
  cwd: string
}): Promise<{tag: string; sha: string}> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['tag', '--sort=-creatordate'],
    {
      cwd,
      silent: !core.isDebug()
    }
  )

  const tags = stdout.trim().split('\n')

  if (tags.length < 2) {
    core.warning('No previous tag found')
    return {tag: '', sha: ''}
  }

  const previousTag = tags[1]

  const {stdout: stdout2} = await exec.getExecOutput(
    'git',
    ['rev-parse', previousTag],
    {
      cwd,
      silent: !core.isDebug()
    }
  )

  const sha = stdout2.trim()

  return {tag: previousTag, sha}
}

export const canDiffCommits = async ({
  cwd,
  sha1,
  sha2,
  diff
}: {
  cwd: string
  sha1: string
  sha2: string
  diff: string
}): Promise<boolean> => {
  if (diff === '...') {
    const mergeBase = await getMergeBase(cwd, sha1, sha2)

    if (!mergeBase) {
      core.warning(`Unable to find merge base between ${sha1} and ${sha2}`)
      return false
    }

    const {exitCode, stderr} = await exec.getExecOutput(
      'git',
      ['log', '--format=%H', `${mergeBase}..${sha2}`],
      {
        cwd,
        ignoreReturnCode: true,
        silent: !core.isDebug()
      }
    )

    if (exitCode !== 0) {
      core.warning(stderr || `Error checking commit history`)
      return false
    }

    return true
  } else {
    const {exitCode, stderr} = await exec.getExecOutput(
      'git',
      ['diff', '--quiet', sha1, sha2],
      {
        cwd,
        ignoreReturnCode: true,
        silent: !core.isDebug()
      }
    )

    if (exitCode !== 0) {
      core.warning(stderr || `Error checking commit history`)
      return false
    }

    return true
  }
}

const getMergeBase = async (
  cwd: string,
  sha1: string,
  sha2: string
): Promise<string | null> => {
  const {exitCode, stdout} = await exec.getExecOutput(
    'git',
    ['merge-base', sha1, sha2],
    {
      cwd,
      ignoreReturnCode: true,
      silent: !core.isDebug()
    }
  )

  if (exitCode !== 0) {
    return null
  }

  return stdout.trim()
}

export const getDirnameMaxDepth = ({
  relativePath,
  dirNamesMaxDepth,
  excludeCurrentDir
}: {
  relativePath: string
  dirNamesMaxDepth?: number
  excludeCurrentDir?: boolean
}): string => {
  const pathArr = getDirname(relativePath).split(path.sep)
  const maxDepth = Math.min(dirNamesMaxDepth || pathArr.length, pathArr.length)
  let output = pathArr[0]

  for (let i = 1; i < maxDepth; i++) {
    output = path.join(output, pathArr[i])
  }

  if (excludeCurrentDir && output === '.') {
    return ''
  }

  return normalizeSeparators(output)
}

export const jsonOutput = ({
  value,
  shouldEscape
}: {
  value: string | string[]
  shouldEscape: boolean
}): string => {
  const result = JSON.stringify(value)

  return shouldEscape ? result.replace(/"/g, '\\"') : result
}

export const getDirNamesIncludeFilesPattern = ({
  inputs
}: {
  inputs: Inputs
}): string[] => {
  return inputs.dirNamesIncludeFiles
    .split(inputs.dirNamesIncludeFilesSeparator)
    .filter(Boolean)
}

export const getFilePatterns = async ({
  inputs,
  workingDirectory
}: {
  inputs: Inputs
  workingDirectory: string
}): Promise<string[]> => {
  let filePatterns = inputs.files
    .split(inputs.filesSeparator)
    .filter(Boolean)
    .join('\n')

  if (inputs.filesFromSourceFile !== '') {
    const inputFilesFromSourceFile = inputs.filesFromSourceFile
      .split(inputs.filesFromSourceFileSeparator)
      .filter(p => p !== '')
      .map(p => path.join(workingDirectory, p))

    core.debug(`files from source file: ${inputFilesFromSourceFile}`)

    const filesFromSourceFiles = (
      await getFilesFromSourceFile({filePaths: inputFilesFromSourceFile})
    ).join('\n')

    core.debug(`files from source files patterns: ${filesFromSourceFiles}`)

    filePatterns = filePatterns.concat('\n', filesFromSourceFiles)
  }

  if (inputs.filesIgnore) {
    const filesIgnorePatterns = inputs.filesIgnore
      .split(inputs.filesIgnoreSeparator)
      .filter(p => p !== '')
      .map(p => {
        if (!p.startsWith('!')) {
          p = `!${p}`
        }
        return p
      })
      .join('\n')

    core.debug(`files ignore patterns: ${filesIgnorePatterns}`)

    filePatterns = filePatterns.concat('\n', filesIgnorePatterns)
  }

  if (inputs.filesIgnoreFromSourceFile) {
    const inputFilesIgnoreFromSourceFile = inputs.filesIgnoreFromSourceFile
      .split(inputs.filesIgnoreFromSourceFileSeparator)
      .filter(p => p !== '')
      .map(p => path.join(workingDirectory, p))

    core.debug(
      `files ignore from source file: ${inputFilesIgnoreFromSourceFile}`
    )

    const filesIgnoreFromSourceFiles = (
      await getFilesFromSourceFile({
        filePaths: inputFilesIgnoreFromSourceFile,
        excludedFiles: true
      })
    ).join('\n')

    core.debug(
      `files ignore from source files patterns: ${filesIgnoreFromSourceFiles}`
    )

    filePatterns = filePatterns.concat('\n', filesIgnoreFromSourceFiles)
  }

  if (isWindows()) {
    filePatterns = filePatterns.replace(/\r\n/g, '\n')
    filePatterns = filePatterns.replace(/\r/g, '\n')
  }

  core.debug(`Input file patterns: ${filePatterns}`)

  return filePatterns
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(pattern => {
      if (pattern.endsWith('/')) {
        return `${pattern}**`
      } else {
        const pathParts = pattern.split('/')
        const lastPart = pathParts[pathParts.length - 1]
        if (!lastPart.includes('.') && !lastPart.includes('*')) {
          return `${pattern}/**`
        } else {
          return pattern
        }
      }
    })
}

// Example YAML input:
//  filesYaml: |
//     frontend:
//       - frontend/**
//     backend:
//       - backend/**
//     test: test/**
//     shared: &shared
//       - common/**
//     lib:
//       - *shared
//       - lib/**
// Return an Object:
// {
//   frontend: ['frontend/**'],
//   backend: ['backend/**'],
//   test: ['test/**'],
//   shared: ['common/**'],
//   lib: ['common/**', 'lib/**']
// }

type YamlObject = {
  [key: string]: string | string[] | [string[], string]
}

const getYamlFilePatternsFromContents = async ({
  content = '',
  filePath = '',
  excludedFiles = false
}: {
  content?: string
  filePath?: string
  excludedFiles?: boolean
}): Promise<Record<string, string[]>> => {
  const filePatterns: Record<string, string[]> = {}
  let source = ''

  if (filePath) {
    if (!(await exists(filePath))) {
      core.error(`File does not exist: ${filePath}`)
      throw new Error(`File does not exist: ${filePath}`)
    }

    source = await readFile(filePath, 'utf8')
  } else {
    source = content
  }

  const doc = parseDocument(source, {merge: true, schema: 'failsafe'})

  if (doc.errors.length > 0) {
    if (filePath) {
      throw new Error(`YAML errors in ${filePath}: ${doc.errors}`)
    } else {
      throw new Error(`YAML errors: ${doc.errors}`)
    }
  }

  if (doc.warnings.length > 0) {
    if (filePath) {
      throw new Error(`YAML warnings in ${filePath}: ${doc.warnings}`)
    } else {
      throw new Error(`YAML warnings: ${doc.warnings}`)
    }
  }

  const yamlObject = doc.toJS() as YamlObject

  for (const key in yamlObject) {
    let value = yamlObject[key]

    if (typeof value === 'string' && value.includes('\n')) {
      value = value.split('\n')
    }

    if (typeof value === 'string') {
      value = value.trim()

      if (value) {
        filePatterns[key] = [
          excludedFiles && !value.startsWith('!') ? `!${value}` : value
        ]
      }
    } else if (Array.isArray(value)) {
      filePatterns[key] = flattenDeep(value)
        .filter(v => v.trim() !== '')
        .map(v => {
          if (excludedFiles && !v.startsWith('!')) {
            v = `!${v}`
          }
          return v
        })
    }
  }

  return filePatterns
}

export const getYamlFilePatterns = async ({
  inputs,
  workingDirectory
}: {
  inputs: Inputs
  workingDirectory: string
}): Promise<Record<string, string[]>> => {
  let filePatterns: Record<string, string[]> = {}
  if (inputs.filesYaml) {
    filePatterns = {
      ...(await getYamlFilePatternsFromContents({content: inputs.filesYaml}))
    }
  }

  if (inputs.filesYamlFromSourceFile) {
    const inputFilesYamlFromSourceFile = inputs.filesYamlFromSourceFile
      .split(inputs.filesYamlFromSourceFileSeparator)
      .filter(p => p !== '')
      .map(p => path.join(workingDirectory, p))

    core.debug(`files yaml from source file: ${inputFilesYamlFromSourceFile}`)

    for (const filePath of inputFilesYamlFromSourceFile) {
      const newFilePatterns = await getYamlFilePatternsFromContents({filePath})
      for (const key in newFilePatterns) {
        if (key in filePatterns) {
          core.warning(
            `files_yaml_from_source_file: Duplicated key ${key} detected in ${filePath}, the ${filePatterns[key]} will be overwritten by ${newFilePatterns[key]}.`
          )
        }
      }

      filePatterns = {
        ...filePatterns,
        ...newFilePatterns
      }
    }
  }

  if (inputs.filesIgnoreYaml) {
    const newIgnoreFilePatterns = await getYamlFilePatternsFromContents({
      content: inputs.filesIgnoreYaml,
      excludedFiles: true
    })

    for (const key in newIgnoreFilePatterns) {
      if (key in filePatterns) {
        core.warning(
          `files_ignore_yaml: Duplicated key ${key} detected, the ${filePatterns[key]} will be overwritten by ${newIgnoreFilePatterns[key]}.`
        )
      }
    }
  }

  if (inputs.filesIgnoreYamlFromSourceFile) {
    const inputFilesIgnoreYamlFromSourceFile =
      inputs.filesIgnoreYamlFromSourceFile
        .split(inputs.filesIgnoreYamlFromSourceFileSeparator)
        .filter(p => p !== '')
        .map(p => path.join(workingDirectory, p))

    core.debug(
      `files ignore yaml from source file: ${inputFilesIgnoreYamlFromSourceFile}`
    )

    for (const filePath of inputFilesIgnoreYamlFromSourceFile) {
      const newIgnoreFilePatterns = await getYamlFilePatternsFromContents({
        filePath,
        excludedFiles: true
      })

      for (const key in newIgnoreFilePatterns) {
        if (key in filePatterns) {
          core.warning(
            `files_ignore_yaml_from_source_file: Duplicated key ${key} detected in ${filePath}, the ${filePatterns[key]} will be overwritten by ${newIgnoreFilePatterns[key]}.`
          )
        }
      }

      filePatterns = {
        ...filePatterns,
        ...newIgnoreFilePatterns
      }
    }
  }

  return filePatterns
}

export const getRecoverFilePatterns = ({
  inputs
}: {
  inputs: Inputs
}): string[] => {
  let filePatterns: string[] = inputs.recoverFiles.split(
    inputs.recoverFilesSeparator
  )

  if (inputs.recoverFilesIgnore) {
    const ignoreFilePatterns = inputs.recoverFilesIgnore.split(
      inputs.recoverFilesSeparator
    )

    filePatterns = filePatterns.concat(
      ignoreFilePatterns.map(p => {
        if (p.startsWith('!')) {
          return p
        } else {
          return `!${p}`
        }
      })
    )
  }

  core.debug(`recover file patterns: ${filePatterns}`)

  return filePatterns.filter(Boolean)
}

export const setOutput = async ({
  key,
  value,
  inputs
}: {
  key: string
  value: string | boolean
  inputs: Inputs
}): Promise<void> => {
  const cleanedValue = value.toString().trim()
  core.setOutput(key, cleanedValue)

  if (inputs.writeOutputFiles) {
    const outputDir = inputs.outputDir
    const extension = inputs.json ? 'json' : 'txt'
    const outputFilePath = path.join(outputDir, `${key}.${extension}`)

    if (!(await exists(outputDir))) {
      await fs.mkdir(outputDir, {recursive: true})
    }
    await fs.writeFile(outputFilePath, cleanedValue.replace(/\\"/g, '"'))
  }
}

const getDeletedFileContents = async ({
  cwd,
  filePath,
  sha
}: {
  cwd: string
  filePath: string
  sha: string
}): Promise<string> => {
  const {stdout, exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['show', `${sha}:${filePath}`],
    {
      cwd,
      silent: !core.isDebug(),
      ignoreReturnCode: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(
      `Error getting file content from git history "${filePath}": ${stderr}`
    )
  }

  return stdout
}

export const recoverDeletedFiles = async ({
  inputs,
  workingDirectory,
  deletedFiles,
  recoverPatterns,
  sha
}: {
  inputs: Inputs
  workingDirectory: string
  deletedFiles: string[]
  recoverPatterns: string[]
  sha: string
}): Promise<void> => {
  let recoverableDeletedFiles = deletedFiles
  core.debug(`recoverable deleted files: ${recoverableDeletedFiles}`)

  if (recoverPatterns.length > 0) {
    recoverableDeletedFiles = mm(deletedFiles, recoverPatterns, {
      dot: true,
      windows: isWindows(),
      noext: true
    })
    core.debug(`filtered recoverable deleted files: ${recoverableDeletedFiles}`)
  }

  for (const deletedFile of recoverableDeletedFiles) {
    let target = path.join(workingDirectory, deletedFile)

    if (inputs.recoverDeletedFilesToDestination) {
      target = path.join(
        workingDirectory,
        inputs.recoverDeletedFilesToDestination,
        deletedFile
      )
    }

    const deletedFileContents = await getDeletedFileContents({
      cwd: workingDirectory,
      filePath: deletedFile,
      sha
    })

    if (!(await exists(path.dirname(target)))) {
      await fs.mkdir(path.dirname(target), {recursive: true})
    }
    await fs.writeFile(target, deletedFileContents)
  }
}

export const hasLocalGitDirectory = async ({
  workingDirectory
}: {
  workingDirectory: string
}): Promise<boolean> => {
  return await isInsideWorkTree({
    cwd: workingDirectory
  })
}
