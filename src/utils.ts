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

const IS_WINDOWS = process.platform === 'win32'
const MINIMUM_GIT_VERSION = '2.18.0'

/**
 * Normalize file path separators to '/' on Windows and Linux/macOS
 * @param p file path
 * @returns file path with normalized separators
 */
const normalizeSeparators = (p: string): string => {
  // Windows
  if (IS_WINDOWS) {
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
 * @param p file path
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
  if (IS_WINDOWS && /^[A-Z]:\\$/i.test(p)) {
    return p
  }

  // Trim trailing slash
  return p.substring(0, p.length - 1)
}

const dirname = (p: string): string => {
  // Normalize slashes and trim unnecessary trailing slash
  p = safeTrimTrailingSeparator(p)

  // Windows UNC root, e.g. \\hello or \\hello\world
  if (IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
    return p
  }

  // Get dirname
  let result = path.dirname(p)

  // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
  if (IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
    result = safeTrimTrailingSeparator(result)
  }

  return result
}

const versionToNumber = (version: string): number => {
  const [major, minor, patch] = version.split('.').map(Number)
  return major * 1000000 + minor * 1000 + patch
}

export const verifyMinimumGitVersion = async (): Promise<void> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['--version'],
    {silent: process.env.RUNNER_DEBUG !== '1'}
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

const exists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

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
      silent: process.env.RUNNER_DEBUG !== '1'
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0 || stderr) {
    core.warning(stderr || `Couldn't update git global config ${name}`)
  }
}

export const isRepoShallow = async ({cwd}: {cwd: string}): Promise<boolean> => {
  const {stdout} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--is-shallow-repository'],
    {
      cwd,
      silent: process.env.RUNNER_DEBUG !== '1'
    }
  )

  return stdout.trim() === 'true'
}

export const submoduleExists = async ({
  cwd
}: {
  cwd: string
}): Promise<boolean> => {
  const {stdout, exitCode} = await exec.getExecOutput(
    'git',
    ['submodule', 'status'],
    {
      cwd,
      ignoreReturnCode: true,
      silent: process.env.RUNNER_DEBUG !== '1'
    }
  )

  if (exitCode !== 0) {
    return false
  }

  return stdout.trim() !== ''
}

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
    silent: process.env.RUNNER_DEBUG !== '1'
  })

  return exitCode
}

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
      silent: process.env.RUNNER_DEBUG !== '1'
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't fetch submodules")
  }
}

const normalizePath = (p: string): string => {
  return p.replace(/\\/g, '/')
}

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
      silent: process.env.RUNNER_DEBUG !== '1'
    }
  )

  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't get submodule names")
    return []
  }

  return stdout
    .trim()
    .split('\n')
    .map((line: string) => normalizePath(line.split(' ')[1]))
}

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
    ['diff', parentSha1, parentSha2, '--', submodulePath],
    {
      cwd,
      silent: process.env.RUNNER_DEBUG !== '1'
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
      silent: process.env.RUNNER_DEBUG !== '1'
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
        return `${normalizePath(
          path.join(parentDir, oldPath)
        )}${oldNewSeparator}${normalizePath(path.join(parentDir, newPath))}`
      }
      return `${normalizePath(oldPath)}${oldNewSeparator}${normalizePath(
        newPath
      )}`
    })
}

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
      silent: process.env.RUNNER_DEBUG !== '1'
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
      ? normalizePath(path.join(parentDir, filePath))
      : normalizePath(filePath)
    const normalizedNewPath = isSubmodule
      ? normalizePath(path.join(parentDir, newPath))
      : normalizePath(newPath)

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

  for (const changeType of Object.keys(allDiffFiles)) {
    const files = allDiffFiles[changeType as ChangeTypeEnum]
    if (hasFilePatterns) {
      changedFiles[changeType as ChangeTypeEnum] = mm(files, filePatterns, {
        dot: true,
        windows: IS_WINDOWS,
        noext: true
      })
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
    silent: process.env.RUNNER_DEBUG !== '1'
  })

  return stdout.trim()
}

export const getHeadSha = async ({cwd}: {cwd: string}): Promise<string> => {
  const {stdout} = await exec.getExecOutput('git', ['rev-parse', 'HEAD'], {
    cwd,
    silent: process.env.RUNNER_DEBUG !== '1'
  })

  return stdout.trim()
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
      silent: process.env.RUNNER_DEBUG !== '1'
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
      silent: process.env.RUNNER_DEBUG !== '1'
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
      silent: process.env.RUNNER_DEBUG !== '1'
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
    ['tag', '--sort=-version:refname'],
    {
      cwd,
      silent: process.env.RUNNER_DEBUG !== '1'
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
      silent: process.env.RUNNER_DEBUG !== '1'
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
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['diff', '--name-only', '--ignore-submodules=all', `${sha1}${diff}${sha2}`],
    {
      cwd,
      ignoreReturnCode: true,
      silent: process.env.RUNNER_DEBUG !== '1'
    }
  )

  if (exitCode !== 0) {
    core.warning(stderr || `Unable find merge base between ${sha1} and ${sha2}`)
    return false
  }

  return true
}

export const getDirnameMaxDepth = ({
  pathStr,
  dirNamesMaxDepth,
  excludeCurrentDir
}: {
  pathStr: string
  dirNamesMaxDepth?: number
  excludeCurrentDir?: boolean
}): string => {
  const pathArr = dirname(pathStr).split(path.sep)
  const maxDepth = Math.min(dirNamesMaxDepth || pathArr.length, pathArr.length)
  let output = pathArr[0]

  for (let i = 1; i < maxDepth; i++) {
    output = path.join(output, pathArr[i])
  }

  if (excludeCurrentDir && output === '.') {
    return ''
  }

  return normalizePath(output)
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

export const getFilePatterns = async ({
  inputs,
  workingDirectory
}: {
  inputs: Inputs
  workingDirectory: string
}): Promise<string[]> => {
  let filePatterns = inputs.files
    .split(inputs.filesSeparator)
    .filter(p => p !== '')
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

  if (IS_WINDOWS) {
    filePatterns = filePatterns.replace(/\r\n/g, '\n')
    filePatterns = filePatterns.replace(/\r/g, '\n')
  }

  core.debug(`file patterns: ${filePatterns}`)

  return filePatterns
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(pattern => {
      if (pattern.endsWith('/')) {
        return `${pattern}**`
      } else {
        const pathParts = pattern.split(path.sep)
        const lastPart = pathParts[pathParts.length - 1]
        if (!lastPart.includes('.')) {
          return `${pattern}${path.sep}**`
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
      core.warning(`YAML errors in ${filePath}: ${doc.errors}`)
    } else {
      core.warning(`YAML errors: ${doc.errors}`)
    }
  }

  if (doc.warnings.length > 0) {
    if (filePath) {
      core.warning(`YAML warnings in ${filePath}: ${doc.warnings}`)
    } else {
      core.warning(`YAML warnings: ${doc.warnings}`)
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
      silent: process.env.RUNNER_DEBUG !== '1',
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
  sha
}: {
  inputs: Inputs
  workingDirectory: string
  deletedFiles: string[]
  sha: string
}): Promise<void> => {
  if (inputs.recoverDeletedFiles) {
    for (const deletedFile of deletedFiles) {
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
}

export const hasLocalGitDirectory = async ({
  workingDirectory
}: {
  workingDirectory: string
}): Promise<boolean> => {
  const gitDirectory = path.join(workingDirectory, '.git')
  return await exists(gitDirectory)
}
