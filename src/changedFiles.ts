import * as path from 'path'

import {DiffResult} from './commitSha'
import {Inputs} from './inputs'
import {
  getDirnameMaxDepth,
  gitRenamedFiles,
  gitSubmoduleDiffSHA,
  jsonOutput,
  getAllChangedFiles
} from './utils'
import flatten from 'lodash/flatten'

export const getRenamedFiles = async ({
  inputs,
  workingDirectory,
  hasSubmodule,
  diffResult,
  submodulePaths
}: {
  inputs: Inputs
  workingDirectory: string
  hasSubmodule: boolean
  diffResult: DiffResult
  submodulePaths: string[]
}): Promise<string> => {
  const renamedFiles = await gitRenamedFiles({
    cwd: workingDirectory,
    sha1: diffResult.previousSha,
    sha2: diffResult.currentSha,
    diff: diffResult.diff,
    oldNewSeparator: inputs.oldNewSeparator
  })

  if (hasSubmodule) {
    for (const submodulePath of submodulePaths) {
      const submoduleShaResult = await gitSubmoduleDiffSHA({
        cwd: workingDirectory,
        parentSha1: diffResult.previousSha,
        parentSha2: diffResult.currentSha,
        submodulePath,
        diff: diffResult.diff
      })

      const submoduleWorkingDirectory = path.join(
        workingDirectory,
        submodulePath
      )

      if (submoduleShaResult.currentSha && submoduleShaResult.previousSha) {
        const submoduleRenamedFiles = await gitRenamedFiles({
          cwd: submoduleWorkingDirectory,
          sha1: submoduleShaResult.previousSha,
          sha2: submoduleShaResult.currentSha,
          diff: diffResult.diff,
          oldNewSeparator: inputs.oldNewSeparator,
          isSubmodule: true,
          parentDir: submodulePath
        })
        renamedFiles.push(...submoduleRenamedFiles)
      }
    }
  }

  if (inputs.json) {
    return jsonOutput({value: renamedFiles, shouldEscape: inputs.escapeJson})
  }

  return renamedFiles.join(inputs.oldNewFilesSeparator)
}

export enum ChangeTypeEnum {
  Added = 'A',
  Copied = 'C',
  Deleted = 'D',
  Modified = 'M',
  Renamed = 'R',
  TypeChanged = 'T',
  Unmerged = 'U',
  Unknown = 'X'
}

export type ChangedFiles = {
  [key in ChangeTypeEnum]: string[]
}

export const getAllDiffFiles = async ({
  workingDirectory,
  hasSubmodule,
  diffResult,
  submodulePaths
}: {
  workingDirectory: string
  hasSubmodule: boolean
  diffResult: DiffResult
  submodulePaths: string[]
}): Promise<ChangedFiles> => {
  const files = await getAllChangedFiles({
    cwd: workingDirectory,
    sha1: diffResult.previousSha,
    sha2: diffResult.currentSha,
    diff: diffResult.diff
  })

  if (hasSubmodule) {
    for (const submodulePath of submodulePaths) {
      const submoduleShaResult = await gitSubmoduleDiffSHA({
        cwd: workingDirectory,
        parentSha1: diffResult.previousSha,
        parentSha2: diffResult.currentSha,
        submodulePath,
        diff: diffResult.diff
      })

      const submoduleWorkingDirectory = path.join(
        workingDirectory,
        submodulePath
      )

      if (submoduleShaResult.currentSha && submoduleShaResult.previousSha) {
        const submoduleFiles = await getAllChangedFiles({
          cwd: submoduleWorkingDirectory,
          sha1: submoduleShaResult.previousSha,
          sha2: submoduleShaResult.currentSha,
          diff: diffResult.diff,
          isSubmodule: true,
          parentDir: submodulePath
        })

        for (const changeType of Object.keys(
          submoduleFiles
        ) as ChangeTypeEnum[]) {
          if (!files[changeType]) {
            files[changeType] = []
          }
          files[changeType].push(...submoduleFiles[changeType])
        }
      }
    }
  }

  return files
}

function* getChangeTypeFilesGenerator({
  inputs,
  changedFiles,
  changeTypes
}: {
  inputs: Inputs
  changedFiles: ChangedFiles
  changeTypes: ChangeTypeEnum[]
}): Generator<string> {
  for (const changeType of changeTypes) {
    const files = changedFiles[changeType] || []
    for (const file of files) {
      if (inputs.dirNames) {
        yield getDirnameMaxDepth({
          pathStr: file,
          dirNamesMaxDepth: inputs.dirNamesMaxDepth,
          excludeCurrentDir:
            inputs.dirNamesExcludeRoot || inputs.dirNamesExcludeCurrentDir
        })
      } else {
        yield file
      }
    }
  }
}

export const getChangeTypeFiles = async ({
  inputs,
  changedFiles,
  changeTypes
}: {
  inputs: Inputs
  changedFiles: ChangedFiles
  changeTypes: ChangeTypeEnum[]
}): Promise<string> => {
  const files = [
    ...new Set(getChangeTypeFilesGenerator({inputs, changedFiles, changeTypes}))
  ]

  if (inputs.json) {
    return jsonOutput({value: files, shouldEscape: inputs.escapeJson})
  }

  return files.join(inputs.separator)
}

function* getAllChangeTypeFilesGenerator({
  inputs,
  changedFiles
}: {
  inputs: Inputs
  changedFiles: ChangedFiles
}): Generator<string> {
  for (const file of flatten(Object.values(changedFiles))) {
    if (inputs.dirNames) {
      yield getDirnameMaxDepth({
        pathStr: file,
        dirNamesMaxDepth: inputs.dirNamesMaxDepth,
        excludeCurrentDir:
          inputs.dirNamesExcludeRoot || inputs.dirNamesExcludeCurrentDir
      })
    } else {
      yield file
    }
  }
}

export const getAllChangeTypeFiles = async ({
  inputs,
  changedFiles
}: {
  inputs: Inputs
  changedFiles: ChangedFiles
}): Promise<string> => {
  const files = [
    ...new Set(getAllChangeTypeFilesGenerator({inputs, changedFiles}))
  ]

  if (inputs.json) {
    return jsonOutput({value: files, shouldEscape: inputs.escapeJson})
  }

  return files.join(inputs.separator)
}
