import * as core from '@actions/core'
import path from 'path'
import {
  getAllChangeTypeFiles,
  getAllDiffFiles,
  getChangeTypeFiles,
  getRenamedFiles
} from './changedFiles'
import {
  DiffResult,
  getSHAForPullRequestEvent,
  getSHAForPushEvent
} from './commitSha'
import {getEnv} from './env'
import {getInputs} from './inputs'
import {ChangeTypeEnum} from './types'
import {
  getFilePatterns,
  getFilteredChangedFiles,
  getSubmodulePath,
  isRepoShallow,
  setOutput,
  submoduleExists,
  updateGitGlobalConfig,
  verifyMinimumGitVersion
} from './utils'

export async function run(): Promise<void> {
  core.startGroup('changed-files')

  const env = await getEnv()
  core.debug(`Env: ${JSON.stringify(env, null, 2)}`)
  const inputs = getInputs()
  core.debug(`Inputs: ${JSON.stringify(inputs, null, 2)}`)

  await verifyMinimumGitVersion()

  let quotePathValue = 'on'

  if (!inputs.quotePath) {
    quotePathValue = 'off'
  }

  await updateGitGlobalConfig({
    name: 'core.quotepath',
    value: quotePathValue
  })

  if (inputs.diffRelative) {
    await updateGitGlobalConfig({
      name: 'diff.relative',
      value: 'true'
    })
  }

  const workingDirectory = path.resolve(
    env.GITHUB_WORKSPACE || process.cwd(),
    inputs.path
  )
  const isShallow = await isRepoShallow({cwd: workingDirectory})
  const hasSubmodule = await submoduleExists({cwd: workingDirectory})
  let gitExtraArgs = ['--no-tags', '--prune', '--recurse-submodules']
  const isTag = env.GITHUB_REF?.startsWith('refs/tags/')
  let submodulePaths: string[] = []

  if (hasSubmodule) {
    submodulePaths = await getSubmodulePath({cwd: workingDirectory})
  }

  if (isTag) {
    gitExtraArgs = ['--prune', '--no-recurse-submodules']
  }

  let diffResult: DiffResult

  if (!env.GITHUB_EVENT_PULL_REQUEST_BASE_REF) {
    core.info(`Running on a ${env.GITHUB_EVENT_NAME || 'push'} event...`)
    diffResult = await getSHAForPushEvent(
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitExtraArgs,
      isTag
    )
  } else {
    core.info(
      `Running on a ${env.GITHUB_EVENT_NAME || 'pull_request'} event...`
    )
    diffResult = await getSHAForPullRequestEvent(
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitExtraArgs
    )
  }

  if (diffResult.initialCommit) {
    core.info('This is the first commit for this repository; exiting...')
    core.endGroup()
    return
  }

  core.info(
    `Retrieving changes between ${diffResult.previousSha} (${diffResult.targetBranch}) → ${diffResult.currentSha} (${diffResult.currentBranch})`
  )

  const filePatterns = await getFilePatterns({
    inputs,
    workingDirectory
  })

  const allDiffFiles = await getAllDiffFiles({
    workingDirectory,
    hasSubmodule,
    diffResult,
    submodulePaths
  })

  const allFilteredDiffFiles = await getFilteredChangedFiles({
    allDiffFiles,
    filePatterns
  })

  const addedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Added]
  })
  core.debug(`Added files: ${addedFiles}`)
  await setOutput({
    key: 'added_files',
    value: addedFiles,
    inputs
  })

  const copiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Copied]
  })
  core.debug(`Copied files: ${copiedFiles}`)
  await setOutput({
    key: 'copied_files',
    value: copiedFiles,
    inputs
  })

  const modifiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Modified]
  })
  core.debug(`Modified files: ${modifiedFiles}`)
  await setOutput({
    key: 'modified_files',
    value: modifiedFiles,
    inputs
  })

  const renamedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Renamed]
  })
  core.debug(`Renamed files: ${renamedFiles}`)
  await setOutput({
    key: 'renamed_files',
    value: renamedFiles,
    inputs
  })

  const typeChangedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.TypeChanged]
  })
  core.debug(`Type changed files: ${typeChangedFiles}`)
  await setOutput({
    key: 'type_changed_files',
    value: typeChangedFiles,
    inputs
  })

  const unmergedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Unmerged]
  })
  core.debug(`Unmerged files: ${unmergedFiles}`)
  await setOutput({
    key: 'unmerged_files',
    value: unmergedFiles,
    inputs
  })

  const unknownFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Unknown]
  })
  core.debug(`Unknown files: ${unknownFiles}`)
  await setOutput({
    key: 'unknown_files',
    value: unknownFiles,
    inputs
  })

  const allChangedAndModifiedFiles = await getAllChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles
  })
  core.debug(`All changed and modified files: ${allChangedAndModifiedFiles}`)
  await setOutput({
    key: 'all_changed_and_modified_files',
    value: allChangedAndModifiedFiles,
    inputs
  })

  const allChangedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [
      ChangeTypeEnum.Added,
      ChangeTypeEnum.Copied,
      ChangeTypeEnum.Modified,
      ChangeTypeEnum.Renamed
    ]
  })
  core.debug(`All changed files: ${allChangedFiles}`)
  await setOutput({
    key: 'all_changed_files',
    value: allChangedFiles,
    inputs
  })

  await setOutput({
    key: 'any_changed',
    value: allChangedFiles.length > 0 && filePatterns.length > 0,
    inputs
  })

  const allOtherChangedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allDiffFiles,
    changeTypes: [
      ChangeTypeEnum.Added,
      ChangeTypeEnum.Copied,
      ChangeTypeEnum.Modified,
      ChangeTypeEnum.Renamed
    ]
  })
  core.debug(`All other changed files: ${allOtherChangedFiles}`)

  const otherChangedFiles = allOtherChangedFiles
    .split(inputs.separator)
    .filter(
      filePath => !allChangedFiles.split(inputs.separator).includes(filePath)
    )

  const onlyChanged =
    otherChangedFiles.length === 0 &&
    allChangedFiles.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: 'only_changed',
    value: onlyChanged,
    inputs
  })

  await setOutput({
    key: 'other_changed_files',
    value: otherChangedFiles.join(inputs.separator),
    inputs
  })

  const allModifiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [
      ChangeTypeEnum.Added,
      ChangeTypeEnum.Copied,
      ChangeTypeEnum.Modified,
      ChangeTypeEnum.Renamed,
      ChangeTypeEnum.Deleted
    ]
  })
  core.debug(`All modified files: ${allModifiedFiles}`)
  await setOutput({
    key: 'all_modified_files',
    value: allModifiedFiles,
    inputs
  })

  await setOutput({
    key: 'any_modified',
    value: allModifiedFiles.length > 0 && filePatterns.length > 0,
    inputs
  })

  const allOtherModifiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allDiffFiles,
    changeTypes: [
      ChangeTypeEnum.Added,
      ChangeTypeEnum.Copied,
      ChangeTypeEnum.Modified,
      ChangeTypeEnum.Renamed,
      ChangeTypeEnum.Deleted
    ]
  })

  const otherModifiedFiles = allOtherModifiedFiles
    .split(inputs.separator)
    .filter(
      filePath => !allModifiedFiles.split(inputs.separator).includes(filePath)
    )

  const onlyModified =
    otherModifiedFiles.length === 0 &&
    allModifiedFiles.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: 'only_modified',
    value: onlyModified,
    inputs
  })

  await setOutput({
    key: 'other_modified_files',
    value: otherModifiedFiles.join(inputs.separator),
    inputs
  })

  const deletedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Deleted]
  })
  core.debug(`Deleted files: ${deletedFiles}`)
  await setOutput({
    key: 'deleted_files',
    value: deletedFiles,
    inputs
  })

  await setOutput({
    key: 'any_deleted',
    value: deletedFiles.length > 0 && filePatterns.length > 0,
    inputs
  })

  const allOtherDeletedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allDiffFiles,
    changeTypes: [ChangeTypeEnum.Deleted]
  })

  const otherDeletedFiles = allOtherDeletedFiles
    .split(inputs.separator)
    .filter(
      filePath => !deletedFiles.split(inputs.separator).includes(filePath)
    )

  const onlyDeleted =
    otherDeletedFiles.length === 0 &&
    deletedFiles.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: 'only_deleted',
    value: onlyDeleted,
    inputs
  })

  await setOutput({
    key: 'other_deleted_files',
    value: otherDeletedFiles.join(inputs.separator),
    inputs
  })

  if (inputs.includeAllOldNewRenamedFiles) {
    const allOldNewRenamedFiles = await getRenamedFiles({
      inputs,
      workingDirectory,
      hasSubmodule,
      diffResult,
      submodulePaths
    })
    core.debug(`All old new renamed files: ${allOldNewRenamedFiles}`)
    await setOutput({
      key: 'all_old_new_renamed_files',
      value: allOldNewRenamedFiles,
      inputs
    })
  }

  core.info('All Done!')

  core.endGroup()
}

/* istanbul ignore if */
if (!process.env.TESTING) {
  // eslint-disable-next-line github/no-then
  run().catch(e => {
    core.setFailed(e.message || e)
  })
}
