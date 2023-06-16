import * as core from '@actions/core'
import {
  ChangedFiles,
  ChangeTypeEnum,
  getAllChangeTypeFiles,
  getChangeTypeFiles
} from './changedFiles'
import {Inputs} from './inputs'
import {getFilteredChangedFiles, setOutput} from './utils'

const getOutputKey = (key: string, outputPrefix: string): string => {
  return outputPrefix ? `${outputPrefix}_${key}` : key
}

export const setChangedFilesOutput = async ({
  allDiffFiles,
  inputs,
  filePatterns = [],
  outputPrefix = ''
}: {
  allDiffFiles: ChangedFiles
  filePatterns?: string[]
  inputs: Inputs
  outputPrefix?: string
}): Promise<void> => {
  const allFilteredDiffFiles = await getFilteredChangedFiles({
    allDiffFiles,
    filePatterns
  })
  core.debug(`All filtered diff files: ${JSON.stringify(allFilteredDiffFiles)}`)

  const addedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Added]
  })
  core.debug(`Added files: ${addedFiles}`)
  await setOutput({
    key: getOutputKey('added_files', outputPrefix),
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
    key: getOutputKey('copied_files', outputPrefix),
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
    key: getOutputKey('modified_files', outputPrefix),
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
    key: getOutputKey('renamed_files', outputPrefix),
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
    key: getOutputKey('type_changed_files', outputPrefix),
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
    key: getOutputKey('unmerged_files', outputPrefix),
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
    key: getOutputKey('unknown_files', outputPrefix),
    value: unknownFiles,
    inputs
  })

  const allChangedAndModifiedFiles = await getAllChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles
  })
  core.debug(`All changed and modified files: ${allChangedAndModifiedFiles}`)
  await setOutput({
    key: getOutputKey('all_changed_and_modified_files', outputPrefix),
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
    key: getOutputKey('all_changed_files', outputPrefix),
    value: allChangedFiles,
    inputs
  })

  await setOutput({
    key: getOutputKey('any_changed', outputPrefix),
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
      (filePath: string) =>
        !allChangedFiles.split(inputs.separator).includes(filePath)
    )

  const onlyChanged =
    otherChangedFiles.length === 0 &&
    allChangedFiles.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: getOutputKey('only_changed', outputPrefix),
    value: onlyChanged,
    inputs
  })

  await setOutput({
    key: getOutputKey('other_changed_files', outputPrefix),
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
    key: getOutputKey('all_modified_files', outputPrefix),
    value: allModifiedFiles,
    inputs
  })

  await setOutput({
    key: getOutputKey('any_modified', outputPrefix),
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
      (filePath: string) =>
        !allModifiedFiles.split(inputs.separator).includes(filePath)
    )

  const onlyModified =
    otherModifiedFiles.length === 0 &&
    allModifiedFiles.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: getOutputKey('only_modified', outputPrefix),
    value: onlyModified,
    inputs
  })

  await setOutput({
    key: getOutputKey('other_modified_files', outputPrefix),
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
    key: getOutputKey('deleted_files', outputPrefix),
    value: deletedFiles,
    inputs
  })

  await setOutput({
    key: getOutputKey('any_deleted', outputPrefix),
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
    key: getOutputKey('only_deleted', outputPrefix),
    value: onlyDeleted,
    inputs
  })

  await setOutput({
    key: getOutputKey('other_deleted_files', outputPrefix),
    value: otherDeletedFiles.join(inputs.separator),
    inputs
  })
}
