import * as core from '@actions/core'
import path from 'path'
import {getDiffFiles, getRenamedFiles} from './changedFiles'
import {
  getSHAForPullRequestEvent,
  getSHAForPushEvent,
  SHAResult
} from './commitSha'
import {getEnv} from './env'
import {getInputs} from './inputs'
import {
  getFilePatterns,
  isRepoShallow,
  setOutput,
  submoduleExists,
  updateGitGlobalConfig,
  verifyMinimumGitVersion
} from './utils'

export async function run(): Promise<void> {
  const env = getEnv()
  const inputs = getInputs()

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

  if (isTag) {
    gitExtraArgs = ['--prune', '--no-recurse-submodules']
  }

  let shaResult: SHAResult

  if (!env.GITHUB_EVENT_PULL_REQUEST_BASE_REF) {
    core.info('Running on a push event...')
    shaResult = await getSHAForPushEvent(
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitExtraArgs,
      isTag
    )
  } else {
    core.info('Running on a pull request event...')
    shaResult = await getSHAForPullRequestEvent(
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitExtraArgs
    )
  }

  const filePatterns = await getFilePatterns({
    inputs
  })

  const addedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'A',
    filePatterns
  })
  core.debug(`Added files: ${addedFiles}`)
  await setOutput({
    key: 'added_files',
    value: addedFiles,
    inputs
  })

  const copiedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'C',
    filePatterns
  })
  core.debug(`Copied files: ${copiedFiles}`)
  await setOutput({
    key: 'copied_files',
    value: copiedFiles,
    inputs
  })

  const modifiedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'M',
    filePatterns
  })
  core.debug(`Modified files: ${modifiedFiles}`)
  await setOutput({
    key: 'modified_files',
    value: modifiedFiles,
    inputs
  })

  const renamedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'R',
    filePatterns
  })
  core.debug(`Renamed files: ${renamedFiles}`)
  await setOutput({
    key: 'renamed_files',
    value: renamedFiles,
    inputs
  })

  const typeChangedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'T',
    filePatterns
  })
  core.debug(`Type changed files: ${typeChangedFiles}`)
  await setOutput({
    key: 'type_changed_files',
    value: typeChangedFiles,
    inputs
  })

  const unmergedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'U',
    filePatterns
  })
  core.debug(`Unmerged files: ${unmergedFiles}`)
  await setOutput({
    key: 'unmerged_files',
    value: unmergedFiles,
    inputs
  })

  const unknownFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'X',
    filePatterns
  })
  core.debug(`Unknown files: ${unknownFiles}`)
  await setOutput({
    key: 'unknown_files',
    value: unknownFiles,
    inputs
  })

  const allChangedAndModifiedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'ACDMRTUX',
    filePatterns
  })
  core.debug(`All changed and modified files: ${allChangedAndModifiedFiles}`)
  await setOutput({
    key: 'all_changed_and_modified_files',
    value: allChangedAndModifiedFiles,
    inputs
  })

  const allChangedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'ACMR',
    filePatterns
  })
  core.debug(`All changed files: ${allChangedFiles}`)
  await setOutput({
    key: 'all_changed_files',
    value: allChangedFiles,
    inputs
  })

  await setOutput({
    key: 'any_changed',
    value: allChangedFiles && filePatterns.length > 0,
    inputs
  })

  const allOtherChangedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'ACMR'
  })
  core.debug(`All other changed files: ${allOtherChangedFiles}`)

  const otherChangedFiles = allOtherChangedFiles
    .split(inputs.filesSeparator)
    .filter(
      filePath =>
        !allChangedFiles.split(inputs.filesSeparator).includes(filePath)
    )

  const onlyChanged =
    otherChangedFiles.length === 0 && allChangedFiles.length > 0

  await setOutput({
    key: 'only_changed',
    value: onlyChanged,
    inputs
  })

  await setOutput({
    key: 'other_changed_files',
    value: otherChangedFiles.join(inputs.filesSeparator),
    inputs
  })

  const allModifiedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'ACMRD',
    filePatterns
  })
  core.debug(`All modified files: ${allModifiedFiles}`)
  await setOutput({
    key: 'all_modified_files',
    value: allModifiedFiles,
    inputs
  })

  await setOutput({
    key: 'any_modified',
    value: allModifiedFiles && filePatterns.length > 0,
    inputs
  })

  const allOtherModifiedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'ACMRD'
  })

  const otherModifiedFiles = allOtherModifiedFiles
    .split(inputs.filesSeparator)
    .filter(
      filePath =>
        !allModifiedFiles.split(inputs.filesSeparator).includes(filePath)
    )

  const onlyModified =
    otherModifiedFiles.length === 0 && allModifiedFiles.length > 0

  await setOutput({
    key: 'only_modified',
    value: onlyModified,
    inputs
  })

  await setOutput({
    key: 'other_modified_files',
    value: otherModifiedFiles.join(inputs.filesSeparator),
    inputs
  })

  const deletedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'D',
    filePatterns
  })
  core.debug(`Deleted files: ${deletedFiles}`)
  await setOutput({
    key: 'deleted_files',
    value: deletedFiles,
    inputs
  })

  await setOutput({
    key: 'any_deleted',
    value: deletedFiles && filePatterns.length > 0,
    inputs
  })

  const allOtherDeletedFiles = await getDiffFiles({
    inputs,
    workingDirectory,
    hasSubmodule,
    shaResult,
    diffFilter: 'D'
  })

  const otherDeletedFiles = allOtherDeletedFiles
    .split(inputs.filesSeparator)
    .filter(
      filePath => !deletedFiles.split(inputs.filesSeparator).includes(filePath)
    )

  const onlyDeleted = otherDeletedFiles.length === 0 && deletedFiles.length > 0

  await setOutput({
    key: 'only_deleted',
    value: onlyDeleted,
    inputs
  })

  await setOutput({
    key: 'other_deleted_files',
    value: otherDeletedFiles.join(inputs.filesSeparator),
    inputs
  })

  if (inputs.includeAllOldNewRenamedFiles) {
    const allOldNewRenamedFiles = await getRenamedFiles({
      inputs,
      workingDirectory,
      hasSubmodule,
      shaResult
    })
    core.debug(`All old new renamed files: ${allOldNewRenamedFiles}`)
    await setOutput({
      key: 'all_old_new_renamed_files',
      value: allOldNewRenamedFiles,
      inputs
    })
  }
}

/* istanbul ignore if */
if (!process.env.TESTING) {
  // eslint-disable-next-line github/no-then
  run().catch(e => {
    core.setFailed(e.message || e)
  })
}
