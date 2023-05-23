import * as core from '@actions/core'

export type Inputs = {
  files: string
  filesSeparator: string
  filesFromSourceFile: string
  filesFromSourceFileSeparator: string
  filesIgnore: string
  filesIgnoreSeparator: string
  filesIgnoreFromSourceFile: string
  filesIgnoreFromSourceFileSeparator: string
  separator: string
  includeAllOldNewRenamedFiles: boolean
  oldNewSeparator: string
  oldNewFilesSeparator: string
  sha: string
  baseSha: string
  since: string
  until: string
  path: string
  quotePath: boolean
  diffRelative: boolean
  dirNames: boolean
  dirNamesMaxDepth?: number
  dirNamesExcludeRoot: boolean
  json: boolean
  jsonRawFormat: boolean
  fetchDepth?: number
  sinceLastRemoteCommit: boolean
  writeOutputFiles: boolean
  outputDir: string
  matchDirectories: boolean
}

export const getInputs = (): Inputs => {
  const files = core.getInput('files', {required: false})
  const filesSeparator = core.getInput('files-separator', {
    required: false,
    trimWhitespace: false
  })
  const filesIgnore = core.getInput('files-ignore', {required: false})
  const filesIgnoreSeparator = core.getInput('files-ignore-separator', {
    required: false,
    trimWhitespace: false
  })
  const filesFromSourceFile = core.getInput('files-from-source-file', {
    required: false
  })
  const filesFromSourceFileSeparator = core.getInput(
    'files-from-source-file-separator',
    {
      required: false,
      trimWhitespace: false
    }
  )
  const filesIgnoreFromSourceFile = core.getInput(
    'files-ignore-from-source-file',
    {required: false}
  )
  const filesIgnoreFromSourceFileSeparator = core.getInput(
    'files-ignore-from-source-file-separator',
    {
      required: false,
      trimWhitespace: false
    }
  )
  const separator = core.getInput('separator', {
    required: true,
    trimWhitespace: false
  })
  const includeAllOldNewRenamedFiles = core.getBooleanInput(
    'include-all-old-new-renamed-files',
    {required: false}
  )
  const oldNewSeparator = core.getInput('old-new-separator', {
    required: true,
    trimWhitespace: false
  })
  const oldNewFilesSeparator = core.getInput('old-new-files-separator', {
    required: true,
    trimWhitespace: false
  })
  const sha = core.getInput('sha', {required: false})
  const baseSha = core.getInput('base-sha', {required: false})
  const since = core.getInput('since', {required: false})
  const until = core.getInput('until', {required: false})
  const path = core.getInput('path', {required: false})
  const quotePath = core.getBooleanInput('quotepath', {required: false})
  const diffRelative = core.getBooleanInput('diff-relative', {required: false})
  const dirNames = core.getBooleanInput('dir-names', {required: false})
  const dirNamesMaxDepth = core.getInput('dir-names-max-depth', {
    required: false
  })
  const dirNamesExcludeRoot = core.getBooleanInput('dir-names-exclude-root', {
    required: false
  })
  const json = core.getBooleanInput('json', {required: false})
  const jsonRawFormat = core.getBooleanInput('json-raw-format', {
    required: false
  })
  const fetchDepth = core.getInput('fetch-depth', {required: false})
  const sinceLastRemoteCommit = core.getBooleanInput(
    'since-last-remote-commit',
    {required: false}
  )
  const writeOutputFiles = core.getBooleanInput('write-output-files', {
    required: false
  })
  const outputDir = core.getInput('output-dir', {required: false})
  const matchDirectories = core.getBooleanInput('match-directories', {
    required: false
  })

  const inputs: Inputs = {
    files,
    filesSeparator,
    filesFromSourceFile,
    filesFromSourceFileSeparator,
    filesIgnore,
    filesIgnoreSeparator,
    filesIgnoreFromSourceFile,
    filesIgnoreFromSourceFileSeparator,
    separator,
    includeAllOldNewRenamedFiles,
    oldNewSeparator,
    oldNewFilesSeparator,
    sha,
    baseSha,
    since,
    until,
    path,
    quotePath,
    diffRelative,
    dirNames,
    dirNamesExcludeRoot,
    json,
    jsonRawFormat,
    sinceLastRemoteCommit,
    writeOutputFiles,
    outputDir,
    matchDirectories
  }

  if (fetchDepth) {
    inputs.fetchDepth = parseInt(fetchDepth, 10)
  }

  if (dirNamesMaxDepth) {
    inputs.dirNamesMaxDepth = parseInt(dirNamesMaxDepth, 10)
  }

  return inputs
}
