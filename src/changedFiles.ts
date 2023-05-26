import * as path from 'path'

import {DiffResult} from './commitSha'
import {Inputs} from './inputs'
import {
  getDirnameMaxDepth,
  gitDiff,
  gitRenamedFiles,
  gitSubmoduleDiffSHA,
  jsonOutput
} from './utils'

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

export const getDiffFiles = async ({
  inputs,
  workingDirectory,
  hasSubmodule,
  diffResult,
  diffFilter,
  filePatterns = [],
  submodulePaths
}: {
  inputs: Inputs
  workingDirectory: string
  hasSubmodule: boolean
  diffResult: DiffResult
  diffFilter: string
  filePatterns?: string[]
  submodulePaths: string[]
}): Promise<string> => {
  let files = await gitDiff({
    cwd: workingDirectory,
    sha1: diffResult.previousSha,
    sha2: diffResult.currentSha,
    diff: diffResult.diff,
    diffFilter,
    filePatterns
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
        const submoduleFiles = await gitDiff({
          cwd: submoduleWorkingDirectory,
          sha1: submoduleShaResult.previousSha,
          sha2: submoduleShaResult.currentSha,
          diff: diffResult.diff,
          diffFilter,
          isSubmodule: true,
          filePatterns,
          parentDir: submodulePath
        })
        files.push(...submoduleFiles)
      }
    }
  }

  if (inputs.dirNames) {
    files = files.map(file =>
      getDirnameMaxDepth({
        pathStr: file,
        dirNamesMaxDepth: inputs.dirNamesMaxDepth,
        excludeRoot: inputs.dirNamesExcludeRoot
      })
    )
    files = [...new Set(files)]
  }

  if (inputs.json) {
    return jsonOutput({value: files, shouldEscape: inputs.escapeJson})
  }

  return files.join(inputs.separator)
}
