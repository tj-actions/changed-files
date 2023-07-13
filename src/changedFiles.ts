import * as core from '@actions/core'
import * as github from '@actions/github'
import type {RestEndpointMethodTypes} from '@octokit/rest'
import * as path from 'path'

import {DiffResult} from './commitSha'
import {Env} from './env'
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
}): Promise<{paths: string; count: string}> => {
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
    return {
      paths: jsonOutput({value: renamedFiles, shouldEscape: inputs.escapeJson}),
      count: renamedFiles.length.toString()
    }
  }

  return {
    paths: renamedFiles.join(inputs.oldNewFilesSeparator),
    count: renamedFiles.length.toString()
  }
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
  submodulePaths,
  outputRenamedFilesAsDeletedAndAdded
}: {
  workingDirectory: string
  hasSubmodule: boolean
  diffResult: DiffResult
  submodulePaths: string[]
  outputRenamedFilesAsDeletedAndAdded: boolean
}): Promise<ChangedFiles> => {
  const files = await getAllChangedFiles({
    cwd: workingDirectory,
    sha1: diffResult.previousSha,
    sha2: diffResult.currentSha,
    diff: diffResult.diff,
    outputRenamedFilesAsDeletedAndAdded
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
          parentDir: submodulePath,
          outputRenamedFilesAsDeletedAndAdded
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
          excludeCurrentDir: inputs.dirNamesExcludeCurrentDir
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
}): Promise<{paths: string; count: string}> => {
  const files = [
    ...new Set(getChangeTypeFilesGenerator({inputs, changedFiles, changeTypes}))
  ].filter(Boolean)

  if (inputs.json) {
    return {
      paths: jsonOutput({value: files, shouldEscape: inputs.escapeJson}),
      count: files.length.toString()
    }
  }

  return {
    paths: files.join(inputs.separator),
    count: files.length.toString()
  }
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
        excludeCurrentDir: inputs.dirNamesExcludeCurrentDir
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
}): Promise<{paths: string; count: string}> => {
  const files = [
    ...new Set(getAllChangeTypeFilesGenerator({inputs, changedFiles}))
  ].filter(Boolean)

  if (inputs.json) {
    return {
      paths: jsonOutput({value: files, shouldEscape: inputs.escapeJson}),
      count: files.length.toString()
    }
  }

  return {
    paths: files.join(inputs.separator),
    count: files.length.toString()
  }
}

export const getChangedFilesFromGithubAPI = async ({
  inputs,
  env
}: {
  inputs: Inputs
  env: Env
}): Promise<ChangedFiles> => {
  const octokit = github.getOctokit(inputs.token, {
    baseUrl: inputs.apiUrl
  })
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

  core.info('Getting changed files from GitHub API...')

  const options = octokit.rest.pulls.listFiles.endpoint.merge({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: env.GITHUB_EVENT_PULL_REQUEST_NUMBER,
    per_page: 100
  })

  const paginatedResponse = await octokit.paginate<
    RestEndpointMethodTypes['pulls']['listFiles']['response']['data'][0]
  >(options)

  core.info(`Found ${paginatedResponse.length} changed files from GitHub API`)
  const statusMap: Record<string, ChangeTypeEnum> = {
    added: ChangeTypeEnum.Added,
    removed: ChangeTypeEnum.Deleted,
    modified: ChangeTypeEnum.Modified,
    renamed: ChangeTypeEnum.Renamed,
    copied: ChangeTypeEnum.Copied,
    changed: ChangeTypeEnum.TypeChanged,
    unchanged: ChangeTypeEnum.Unmerged
  }

  for await (const item of paginatedResponse) {
    const changeType: ChangeTypeEnum =
      statusMap[item.status] || ChangeTypeEnum.Unknown

    if (changeType === ChangeTypeEnum.Renamed) {
      if (inputs.outputRenamedFilesAsDeletedAndAdded) {
        changedFiles[ChangeTypeEnum.Deleted].push(item.filename)
        changedFiles[ChangeTypeEnum.Added].push(item.filename)
      } else {
        changedFiles[ChangeTypeEnum.Renamed].push(item.filename)
      }
    } else {
      changedFiles[changeType].push(item.filename)
    }
  }

  return changedFiles
}
