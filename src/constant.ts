import {Inputs} from './inputs'

export const DEFAULT_VALUES_OF_UNSUPPORTED_API_INPUTS: Partial<Inputs> = {
  sha: '',
  baseSha: '',
  since: '',
  until: '',
  path: '.',
  quotepath: true,
  diffRelative: true,
  sinceLastRemoteCommit: false,
  recoverDeletedFiles: false,
  recoverDeletedFilesToDestination: '',
  recoverFiles: '',
  recoverFilesSeparator: '\n',
  recoverFilesIgnore: '',
  recoverFilesIgnoreSeparator: '\n',
  includeAllOldNewRenamedFiles: false,
  oldNewSeparator: ',',
  oldNewFilesSeparator: ' ',
  skipInitialFetch: false,
  fetchAdditionalSubmoduleHistory: false,
  dirNamesDeletedFilesIncludeOnlyDeletedDirs: false,
  excludeSubmodules: false,
  fetchMissingHistoryMaxRetries: 20,
  usePosixPathSeparator: false,
  tagsPattern: '*',
  tagsIgnorePattern: ''
}
