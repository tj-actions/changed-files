import {Inputs} from './inputs'

export const UNSUPPORTED_REST_API_INPUTS: Partial<Inputs> = {
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
  dirNamesDeletedFilesIncludeOnlyDeletedDirs: false
}
