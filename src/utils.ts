/*global AsyncIterableIterator*/
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {MatchKind} from '@actions/glob/lib/internal-match-kind'
import {dirname} from '@actions/glob/lib/internal-path-helper'

import {Pattern} from '@actions/glob/lib/internal-pattern'
import * as patternHelper from '@actions/glob/lib/internal-pattern-helper'
import * as path from 'path'
import {createReadStream, promises as fs} from 'fs'
import {createInterface} from 'readline'

import {Inputs} from './inputs'

const MINIMUM_GIT_VERSION = '2.18.0'

const versionToNumber = (version: string): number => {
  const [major, minor, patch] = version.split('.').map(Number)
  return major * 1000000 + minor * 1000 + patch
}

export const verifyMinimumGitVersion = async (): Promise<void> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['--version'],
    {silent: true}
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

export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function getPatterns(filePatterns: string): Promise<Pattern[]> {
  const IS_WINDOWS: boolean = process.platform === 'win32'
  const patterns = []

  if (IS_WINDOWS) {
    filePatterns = filePatterns.replace(/\r\n/g, '\n')
    filePatterns = filePatterns.replace(/\r/g, '\n')
  }

  const lines = filePatterns.split('\n').map(filePattern => filePattern.trim())

  for (let line of lines) {
    // Empty or comment
    if (!(!line || line.startsWith('#'))) {
      line = IS_WINDOWS ? line.replace(/\\/g, '/') : line
      const pattern = new Pattern(line)
      // @ts-ignore
      pattern.minimatch.options.nobrace = false
      // @ts-ignore
      pattern.minimatch.make()
      patterns.push(pattern)

      if (
        pattern.trailingSeparator ||
        pattern.segments[pattern.segments.length - 1] !== '**'
      ) {
        patterns.push(
          new Pattern(pattern.negate, true, pattern.segments.concat('**'))
        )
      }
    }
  }

  return patterns
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

export async function getFilesFromSourceFile({
  filePaths,
  excludedFiles = false
}: {
  filePaths: string[]
  excludedFiles?: boolean
}): Promise<string[]> {
  const lines = []
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
      silent: true
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0 || stderr) {
    core.warning(stderr || `Couldn't update git global config ${name}`)
  }
}

export const isRepoShallow = async ({cwd}: {cwd: string}): Promise<boolean> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['rev-parse', '--is-shallow-repository'],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'An unexpected error occurred')
  }

  return stdout.trim() === 'true'
}

export const submoduleExists = async ({
  cwd
}: {
  cwd: string
}): Promise<boolean> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['submodule', 'status'],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'An unexpected error occurred')
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
  const {exitCode, stderr} = await exec.getExecOutput(
    'git',
    ['fetch', ...args],
    {
      cwd,
      silent: true
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0 || stderr) {
    core.warning(stderr || "Couldn't fetch repository")
  }

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
    ['submodule', 'foreach', 'git', 'fetch', ...args],
    {
      cwd,
      silent: true
    }
  )

  /* istanbul ignore if */
  if (exitCode !== 0 || stderr) {
    core.warning(stderr || "Couldn't fetch submodules")
  }
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
      silent: true
    }
  )

  if (exitCode !== 0) {
    core.warning(stderr || "Couldn't get submodule names")
    return []
  }

  return stdout
    .split('\n')
    .filter(Boolean)
    .map(line => line.split(' ')[1])
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
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['diff', parentSha1, parentSha2, '--', submodulePath],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'An unexpected error occurred')
  }

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
  isSubmodule = false
}: {
  cwd: string
  sha1: string
  sha2: string
  diff: string
  oldNewSeparator: string
  isSubmodule?: boolean
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
      silent: true
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
    .map(line => {
      const [, oldPath, newPath] = line.split('\t')
      return `${oldPath}${oldNewSeparator}${newPath}`
    })
}

export const gitDiff = async ({
  cwd,
  sha1,
  sha2,
  diff,
  diffFilter,
  filePatterns = [],
  isSubmodule = false
}: {
  cwd: string
  sha1: string
  sha2: string
  diffFilter: string
  diff: string
  filePatterns?: Pattern[]
  isSubmodule?: boolean
}): Promise<string[]> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    [
      'diff',
      '--name-only',
      '--ignore-submodules=all',
      `--diff-filter=${diffFilter}`,
      `${sha1}${diff}${sha2}`
    ],
    {
      cwd,
      silent: true
    }
  )

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
      core.error(
        stderr || `Failed to get changed files between: ${sha1}${diff}${sha2}`
      )
      throw new Error('Unable to get changed files')
    }

    return []
  }

  return stdout.split('\n').filter(filePath => {
    if (filePatterns.length === 0) {
      return filePath !== ''
    }

    const match = patternHelper.match(filePatterns, filePath)
    return filePath !== '' && match === MatchKind.All
  })
}

export const gitLog = async ({
  args,
  cwd
}: {
  args: string[]
  cwd: string
}): Promise<string> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['log', ...args],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'An unexpected error occurred')
  }

  return stdout.trim()
}

export const getHeadSha = async ({cwd}: {cwd: string}): Promise<string> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['rev-parse', 'HEAD'],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'Unable to get HEAD sha')
  }

  return stdout.trim()
}

export const getParentHeadSha = async ({
  cwd
}: {
  cwd: string
}): Promise<string> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['rev-parse', 'HEAD^'],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'Unable to get HEAD^ sha')
  }

  return stdout.trim()
}

export const getBranchHeadSha = async ({
  branch,
  cwd
}: {
  branch: string
  cwd: string
}): Promise<string> => {
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['rev-parse', branch],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || `Unable to get ${branch} head sha`)
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
    ['rev-parse', '--quiet', '--verify', `${sha}^{commit}`],
    {
      cwd,
      silent: true
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
  const {exitCode, stdout, stderr} = await exec.getExecOutput(
    'git',
    ['tag', '--sort=-version:refname'],
    {
      cwd,
      silent: true
    }
  )

  if (exitCode !== 0) {
    throw new Error(stderr || 'Unable to get previous tag')
  }

  const tags = stdout.trim().split('\n')

  if (tags.length < 2) {
    core.warning('No previous tag found')
    return {tag: '', sha: ''}
  }

  const previousTag = tags[1]

  const {
    exitCode: exitCode2,
    stdout: stdout2,
    stderr: stderr2
  } = await exec.getExecOutput('git', ['rev-parse', previousTag], {
    cwd,
    silent: true
  })

  if (exitCode2 !== 0) {
    throw new Error(stderr2 || 'Unable to get previous tag')
  }

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
      silent: true
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
  excludeRoot
}: {
  pathStr: string
  dirNamesMaxDepth?: number
  excludeRoot?: boolean
}): string => {
  const pathArr = dirname(pathStr).split(path.sep)
  const maxDepth = Math.min(dirNamesMaxDepth || pathArr.length, pathArr.length)
  let output = pathArr[0]

  for (let i = 1; i < maxDepth; i++) {
    output = path.join(output, pathArr[i])
  }

  if (excludeRoot && output === '.') {
    return ''
  }

  return output
}

export const jsonOutput = ({
  value,
  escape
}: {
  value: string | string[]
  escape: boolean
}): string => {
  let result = JSON.stringify(value)

  return escape ? result.replace(/"/g, '\\"') : result
}

export const getFilePatterns = async ({
  inputs
}: {
  inputs: Inputs
}): Promise<Pattern[]> => {
  let filesPatterns: string = inputs.files
    .split(inputs.filesSeparator)
    .filter(p => p !== '')
    .join('\n')

  core.debug(`files patterns: ${filesPatterns}`)

  if (inputs.filesFromSourceFile !== '') {
    const inputFilesFromSourceFile = inputs.filesFromSourceFile
      .split(inputs.filesFromSourceFileSeparator)
      .filter(p => p !== '')

    const filesFromSourceFiles = (
      await getFilesFromSourceFile({filePaths: inputFilesFromSourceFile})
    ).join('\n')

    core.debug(`files from source files patterns: ${filesFromSourceFiles}`)

    filesPatterns = filesPatterns.concat('\n', filesFromSourceFiles)
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

    filesPatterns = filesPatterns.concat('\n', filesIgnorePatterns)
  }

  if (inputs.filesIgnoreFromSourceFile) {
    const inputFilesIgnoreFromSourceFile = inputs.filesIgnoreFromSourceFile
      .split(inputs.filesIgnoreFromSourceFileSeparator)
      .filter(p => p !== '')

    const filesIgnoreFromSourceFiles = (
      await getFilesFromSourceFile({
        filePaths: inputFilesIgnoreFromSourceFile,
        excludedFiles: true
      })
    ).join('\n')

    core.debug(
      `files ignore from source files patterns: ${filesIgnoreFromSourceFiles}`
    )

    filesPatterns = filesPatterns.concat('\n', filesIgnoreFromSourceFiles)
  }

  const patterns = await getPatterns(filesPatterns)

  core.debug(`patterns: ${patterns}`)

  return patterns
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

  if (inputs.writeOutputFiles) {
    const outputDir = inputs.outputDir || '.github/outputs'
    const extension = inputs.json ? 'json' : 'txt'
    const outputFilePath = path.join(outputDir, `${key}.${extension}`)

    if (!(await exists(outputDir))) {
      await fs.mkdir(outputDir, {recursive: true})
    }
    await fs.writeFile(outputFilePath, cleanedValue)
  } else {
    core.setOutput(key, cleanedValue)
  }
}
