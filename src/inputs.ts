import * as core from '@actions/core'

export type Inputs = {
  files: string
  filesSeparator: string
  filesFromSourceFile: string
  filesFromSourceFileSeparator: string
  filesYaml: string
  filesYamlFromSourceFile: string
  filesYamlFromSourceFileSeparator: string
  filesIgnore: string
  filesIgnoreSeparator: string
  filesIgnoreFromSourceFile: string
  filesIgnoreFromSourceFileSeparator: string
  filesIgnoreYaml: string
  filesIgnoreYamlFromSourceFile: string
  filesIgnoreYamlFromSourceFileSeparator: string
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
  dirNamesExcludeCurrentDir: boolean
  dirNamesIncludeFiles: string
  dirNamesIncludeFilesSeparator: string
  dirNamesDeletedFilesIncludeOnlyDeletedDirs: boolean
  json: boolean
  escapeJson: boolean
  safeOutput: boolean
  fetchDepth?: number
  fetchSubmoduleHistory: boolean
  sinceLastRemoteCommit: boolean
  writeOutputFiles: boolean
  outputDir: string
  outputRenamedFilesAsDeletedAndAdded: boolean
  recoverDeletedFiles: boolean
  recoverDeletedFilesToDestination: string
  recoverFiles: string
  recoverFilesSeparator: string
  recoverFilesIgnore: string
  recoverFilesIgnoreSeparator: string
  token: string
  apiUrl: string
  skipInitialFetch: boolean
  failOnInitialDiffError: boolean
  failOnSubmoduleDiffError: boolean
  negationPatternsFirst: boolean
}

export const getInputs = (): Inputs => {
  const files = core.getInput('files', {required: false})
  const filesSeparator = core.getInput('files_separator', {
    required: false,
    trimWhitespace: false
  })
  const filesIgnore = core.getInput('files_ignore', {required: false})
  const filesIgnoreSeparator = core.getInput('files_ignore_separator', {
    required: false,
    trimWhitespace: false
  })
  const filesFromSourceFile = core.getInput('files_from_source_file', {
    required: false
  })
  const filesFromSourceFileSeparator = core.getInput(
    'files_from_source_file_separator',
    {
      required: false,
      trimWhitespace: false
    }
  )
  const filesYaml = core.getInput('files_yaml', {required: false})
  const filesYamlFromSourceFile = core.getInput('files_yaml_from_source_file', {
    required: false
  })
  const filesYamlFromSourceFileSeparator = core.getInput(
    'files_yaml_from_source_file_separator',
    {
      required: false,
      trimWhitespace: false
    }
  )
  const filesIgnoreFromSourceFile = core.getInput(
    'files_ignore_from_source_file',
    {required: false}
  )
  const filesIgnoreFromSourceFileSeparator = core.getInput(
    'files_ignore_from_source_file_separator',
    {
      required: false,
      trimWhitespace: false
    }
  )
  const filesIgnoreYaml = core.getInput('files_ignore_yaml', {required: false})
  const filesIgnoreYamlFromSourceFile = core.getInput(
    'files_ignore_yaml_from_source_file',
    {required: false}
  )
  const filesIgnoreYamlFromSourceFileSeparator = core.getInput(
    'files_ignore_yaml_from_source_file_separator',
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
    'include_all_old_new_renamed_files',
    {required: false}
  )
  const oldNewSeparator = core.getInput('old_new_separator', {
    required: true,
    trimWhitespace: false
  })
  const oldNewFilesSeparator = core.getInput('old_new_files_separator', {
    required: true,
    trimWhitespace: false
  })
  const sha = core.getInput('sha', {required: false})
  const baseSha = core.getInput('base_sha', {required: false})
  const since = core.getInput('since', {required: false})
  const until = core.getInput('until', {required: false})
  const path = core.getInput('path', {required: false})
  const quotePath = core.getBooleanInput('quotepath', {required: false})
  const diffRelative = core.getBooleanInput('diff_relative', {required: false})
  const dirNames = core.getBooleanInput('dir_names', {required: false})
  const dirNamesMaxDepth = core.getInput('dir_names_max_depth', {
    required: false
  })
  const dirNamesExcludeCurrentDir = core.getBooleanInput(
    'dir_names_exclude_current_dir',
    {
      required: false
    }
  )
  const dirNamesIncludeFiles = core.getInput('dir_names_include_files', {
    required: false
  })
  const dirNamesIncludeFilesSeparator = core.getInput(
    'dir_names_include_files_separator',
    {
      required: false,
      trimWhitespace: false
    }
  )
  const json = core.getBooleanInput('json', {required: false})
  const escapeJson = core.getBooleanInput('escape_json', {required: false})
  const safeOutput = core.getBooleanInput('safe_output', {required: false})
  const fetchDepth = core.getInput('fetch_depth', {required: false})
  const sinceLastRemoteCommit = core.getBooleanInput(
    'since_last_remote_commit',
    {required: false}
  )
  const writeOutputFiles = core.getBooleanInput('write_output_files', {
    required: false
  })
  const outputDir = core.getInput('output_dir', {required: false})
  const outputRenamedFilesAsDeletedAndAdded = core.getBooleanInput(
    'output_renamed_files_as_deleted_and_added',
    {required: false}
  )
  const recoverDeletedFiles = core.getBooleanInput('recover_deleted_files', {
    required: false
  })
  const recoverDeletedFilesToDestination = core.getInput(
    'recover_deleted_files_to_destination',
    {required: false}
  )
  const recoverFiles = core.getInput('recover_files', {required: false})
  const recoverFilesSeparator = core.getInput('recover_files_separator', {
    required: false,
    trimWhitespace: false
  })
  const recoverFilesIgnore = core.getInput('recover_files_ignore', {
    required: false
  })
  const recoverFilesIgnoreSeparator = core.getInput(
    'recover_files_ignore_separator',
    {
      required: false,
      trimWhitespace: false
    }
  )
  const token = core.getInput('token', {required: false})
  const apiUrl = core.getInput('api_url', {required: false})
  const skipInitialFetch = core.getBooleanInput('skip_initial_fetch', {
    required: false
  })
  const fetchSubmoduleHistory = core.getBooleanInput(
    'fetch_additional_submodule_history',
    {
      required: false
    }
  )
  const failOnInitialDiffError = core.getBooleanInput(
    'fail_on_initial_diff_error',
    {
      required: false
    }
  )
  const failOnSubmoduleDiffError = core.getBooleanInput(
    'fail_on_submodule_diff_error',
    {
      required: false
    }
  )
  const dirNamesDeletedFilesIncludeOnlyDeletedDirs = core.getBooleanInput(
    'dir_names_deleted_files_include_only_deleted_dirs',
    {
      required: false
    }
  )

  const negationPatternsFirst = core.getBooleanInput(
    'negation_patterns_first',
    {
      required: false
    }
  )

  const inputs: Inputs = {
    files,
    filesSeparator,
    filesFromSourceFile,
    filesFromSourceFileSeparator,
    filesYaml,
    filesYamlFromSourceFile,
    filesYamlFromSourceFileSeparator,
    filesIgnore,
    filesIgnoreSeparator,
    filesIgnoreFromSourceFile,
    filesIgnoreFromSourceFileSeparator,
    filesIgnoreYaml,
    filesIgnoreYamlFromSourceFile,
    filesIgnoreYamlFromSourceFileSeparator,
    failOnInitialDiffError,
    failOnSubmoduleDiffError,
    separator,
    // Not Supported via REST API
    sha,
    baseSha,
    since,
    until,
    path,
    quotePath,
    diffRelative,
    sinceLastRemoteCommit,
    recoverDeletedFiles,
    recoverDeletedFilesToDestination,
    recoverFiles,
    recoverFilesSeparator,
    recoverFilesIgnore,
    recoverFilesIgnoreSeparator,
    includeAllOldNewRenamedFiles,
    oldNewSeparator,
    oldNewFilesSeparator,
    skipInitialFetch,
    fetchSubmoduleHistory,
    dirNamesDeletedFilesIncludeOnlyDeletedDirs,
    // End Not Supported via REST API
    dirNames,
    dirNamesExcludeCurrentDir,
    dirNamesIncludeFiles,
    dirNamesIncludeFilesSeparator,
    json,
    escapeJson,
    safeOutput,
    writeOutputFiles,
    outputDir,
    outputRenamedFilesAsDeletedAndAdded,
    token,
    apiUrl,
    negationPatternsFirst
  }

  if (fetchDepth) {
    inputs.fetchDepth = Math.max(parseInt(fetchDepth, 10), 2)
  }

  if (dirNamesMaxDepth) {
    inputs.dirNamesMaxDepth = parseInt(dirNamesMaxDepth, 10)
  }

  return inputs
}
