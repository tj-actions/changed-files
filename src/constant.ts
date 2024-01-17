import {Inputs} from './inputs'

export const UNSUPPORTED_REST_API_INPUTS: (keyof Inputs)[] = [
  'sha',
  'baseSha',
  'since',
  'until',
  'path',
  'quotepath',
  'diffRelative',
  'sinceLastRemoteCommit',
  'recoverDeletedFiles',
  'recoverDeletedFilesToDestination',
  'recoverFiles',
  'recoverFilesSeparator',
  'recoverFilesIgnore',
  'recoverFilesIgnoreSeparator',
  'includeAllOldNewRenamedFiles',
  'oldNewSeparator',
  'oldNewFilesSeparator',
  'skipInitialFetch',
  'fetchAdditionalSubmoduleHistory',
  'dirNamesDeletedFilesIncludeOnlyDeletedDirs'
]

export const ACTION_INPUT_DEFAULTS: Partial<Inputs> = {
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
