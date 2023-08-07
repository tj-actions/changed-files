import * as core from '@actions/core'
import {
  ChangedFiles,
  ChangeTypeEnum,
  getAllChangeTypeFiles,
  getChangeTypeFiles
} from './changedFiles'
import {Inputs} from './inputs'
import {setOutput} from './utils'

const getOutputKey = (key: string, outputPrefix: string): string => {
  return outputPrefix ? `${outputPrefix}_${key}` : key
}

export const setChangedFilesOutput = async ({
  allDiffFiles,
  allFilteredDiffFiles,
  inputs,
  filePatterns = [],
  outputPrefix = ''
}: {
  allDiffFiles: ChangedFiles
  allFilteredDiffFiles: ChangedFiles
  inputs: Inputs
  filePatterns?: string[]
  outputPrefix?: string
}): Promise<void> => {
  const addedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Added]
  })
  core.debug(`Added files: ${JSON.stringify(addedFiles)}`)
  await setOutput({
    key: getOutputKey('added_files', outputPrefix),
    value: addedFiles.paths,
    inputs
  })
  await setOutput({
    key: getOutputKey('added_files_count', outputPrefix),
    value: addedFiles.count,
    inputs
  })

  const copiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Copied]
  })
  core.debug(`Copied files: ${JSON.stringify(copiedFiles)}`)
  await setOutput({
    key: getOutputKey('copied_files', outputPrefix),
    value: copiedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('copied_files_count', outputPrefix),
    value: copiedFiles.count,
    inputs
  })

  const modifiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Modified]
  })
  core.debug(`Modified files: ${JSON.stringify(modifiedFiles)}`)
  await setOutput({
    key: getOutputKey('modified_files', outputPrefix),
    value: modifiedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('modified_files_count', outputPrefix),
    value: modifiedFiles.count,
    inputs
  })

  const renamedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Renamed]
  })
  core.debug(`Renamed files: ${JSON.stringify(renamedFiles)}`)
  await setOutput({
    key: getOutputKey('renamed_files', outputPrefix),
    value: renamedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('renamed_files_count', outputPrefix),
    value: renamedFiles.count,
    inputs
  })

  const typeChangedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.TypeChanged]
  })
  core.debug(`Type changed files: ${JSON.stringify(typeChangedFiles)}`)
  await setOutput({
    key: getOutputKey('type_changed_files', outputPrefix),
    value: typeChangedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('type_changed_files_count', outputPrefix),
    value: typeChangedFiles.count,
    inputs
  })

  const unmergedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Unmerged]
  })
  core.debug(`Unmerged files: ${JSON.stringify(unmergedFiles)}`)
  await setOutput({
    key: getOutputKey('unmerged_files', outputPrefix),
    value: unmergedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('unmerged_files_count', outputPrefix),
    value: unmergedFiles.count,
    inputs
  })

  const unknownFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Unknown]
  })
  core.debug(`Unknown files: ${JSON.stringify(unknownFiles)}`)
  await setOutput({
    key: getOutputKey('unknown_files', outputPrefix),
    value: unknownFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('unknown_files_count', outputPrefix),
    value: unknownFiles.count,
    inputs
  })

  const allChangedAndModifiedFiles = await getAllChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles
  })
  core.debug(
    `All changed and modified files: ${JSON.stringify(
      allChangedAndModifiedFiles
    )}`
  )
  await setOutput({
    key: getOutputKey('all_changed_and_modified_files', outputPrefix),
    value: allChangedAndModifiedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('all_changed_and_modified_files_count', outputPrefix),
    value: allChangedAndModifiedFiles.count,
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
  core.debug(`All changed files: ${JSON.stringify(allChangedFiles)}`)
  await setOutput({
    key: getOutputKey('all_changed_files', outputPrefix),
    value: allChangedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('all_changed_files_count', outputPrefix),
    value: allChangedFiles.count,
    inputs
  })

  await setOutput({
    key: getOutputKey('any_changed', outputPrefix),
    value: allChangedFiles.paths.length > 0 && filePatterns.length > 0,
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
  core.debug(`All other changed files: ${JSON.stringify(allOtherChangedFiles)}`)

  const otherChangedFiles = allOtherChangedFiles.paths
    .split(inputs.separator)
    .filter(
      (filePath: string) =>
        !allChangedFiles.paths.split(inputs.separator).includes(filePath)
    )

  const onlyChanged =
    otherChangedFiles.length === 0 &&
    allChangedFiles.paths.length > 0 &&
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

  await setOutput({
    key: getOutputKey('other_changed_files_count', outputPrefix),
    value: otherChangedFiles.length.toString(),
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
  core.debug(`All modified files: ${JSON.stringify(allModifiedFiles)}`)
  await setOutput({
    key: getOutputKey('all_modified_files', outputPrefix),
    value: allModifiedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('all_modified_files_count', outputPrefix),
    value: allModifiedFiles.count,
    inputs
  })

  await setOutput({
    key: getOutputKey('any_modified', outputPrefix),
    value: allModifiedFiles.paths.length > 0 && filePatterns.length > 0,
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

  const otherModifiedFiles = allOtherModifiedFiles.paths
    .split(inputs.separator)
    .filter(
      (filePath: string) =>
        !allModifiedFiles.paths.split(inputs.separator).includes(filePath)
    )

  const onlyModified =
    otherModifiedFiles.length === 0 &&
    allModifiedFiles.paths.length > 0 &&
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

  await setOutput({
    key: getOutputKey('other_modified_files_count', outputPrefix),
    value: otherModifiedFiles.length.toString(),
    inputs
  })

  const deletedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Deleted]
  })
  core.debug(`Deleted files: ${JSON.stringify(deletedFiles)}`)
  await setOutput({
    key: getOutputKey('deleted_files', outputPrefix),
    value: deletedFiles.paths,
    inputs
  })

  await setOutput({
    key: getOutputKey('deleted_files_count', outputPrefix),
    value: deletedFiles.count,
    inputs
  })

  await setOutput({
    key: getOutputKey('any_deleted', outputPrefix),
    value: deletedFiles.paths.length > 0 && filePatterns.length > 0,
    inputs
  })

  const allOtherDeletedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allDiffFiles,
    changeTypes: [ChangeTypeEnum.Deleted]
  })

  const otherDeletedFiles = allOtherDeletedFiles.paths
    .split(inputs.separator)
    .filter(
      filePath => !deletedFiles.paths.split(inputs.separator).includes(filePath)
    )

  const onlyDeleted =
    otherDeletedFiles.length === 0 &&
    deletedFiles.paths.length > 0 &&
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

  await setOutput({
    key: getOutputKey('other_deleted_files_count', outputPrefix),
    value: otherDeletedFiles.length.toString(),
    inputs
  })
}
