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
