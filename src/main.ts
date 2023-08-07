import * as core from '@actions/core'
import * as github from '@actions/github'
import path from 'path'
import {
  ChangedFiles,
  ChangeTypeEnum,
  getAllDiffFiles,
  getChangedFilesFromGithubAPI,
  getRenamedFiles
} from './changedFiles'
import {setChangedFilesOutput} from './changedFilesOutput'
import {
  DiffResult,
  getSHAForPullRequestEvent,
  getSHAForNonPullRequestEvent
} from './commitSha'
import {Env, getEnv} from './env'
import {getInputs, Inputs} from './inputs'
import {
  getFilePatterns,
  getFilteredChangedFiles,
  getRecoverFilePatterns,
  getSubmodulePath,
  getYamlFilePatterns,
  hasLocalGitDirectory,
  isRepoShallow,
  recoverDeletedFiles,
  setOutput,
  submoduleExists,
  updateGitGlobalConfig,
  verifyMinimumGitVersion
} from './utils'

const changedFilesOutput = async ({
  filePatterns,
  allDiffFiles,
  inputs,
  yamlFilePatterns
}: {
  filePatterns: string[]
  allDiffFiles: ChangedFiles
  inputs: Inputs
  yamlFilePatterns: Record<string, string[]>
}): Promise<void> => {
  if (filePatterns.length > 0) {
    core.startGroup('changed-files-patterns')
    const allFilteredDiffFiles = await getFilteredChangedFiles({
      allDiffFiles,
      filePatterns
    })
    core.debug(
      `All filtered diff files: ${JSON.stringify(allFilteredDiffFiles)}`
    )
    await setChangedFilesOutput({
      allDiffFiles,
      allFilteredDiffFiles,
      inputs,
      filePatterns
    })
    core.info('All Done!')
    core.endGroup()
  }

  if (Object.keys(yamlFilePatterns).length > 0) {
    for (const key of Object.keys(yamlFilePatterns)) {
      core.startGroup(`changed-files-yaml-${key}`)
      const allFilteredDiffFiles = await getFilteredChangedFiles({
        allDiffFiles,
        filePatterns: yamlFilePatterns[key]
      })
      core.debug(
        `All filtered diff files for ${key}: ${JSON.stringify(
          allFilteredDiffFiles
        )}`
      )
      await setChangedFilesOutput({
        allDiffFiles,
        allFilteredDiffFiles,
        inputs,
        filePatterns: yamlFilePatterns[key],
        outputPrefix: key
      })
      core.info('All Done!')
      core.endGroup()
    }
  }

  if (filePatterns.length === 0 && Object.keys(yamlFilePatterns).length === 0) {
    core.startGroup('changed-files-all')
    await setChangedFilesOutput({
      allDiffFiles,
      allFilteredDiffFiles: allDiffFiles,
      inputs
    })
    core.info('All Done!')
    core.endGroup()
  }
}

const getChangedFilesFromLocalGit = async ({
  inputs,
  env,
  workingDirectory,
  filePatterns,
  yamlFilePatterns
}: {
  inputs: Inputs
  env: Env
  workingDirectory: string
  filePatterns: string[]
  yamlFilePatterns: Record<string, string[]>
}): Promise<void> => {
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

  const isShallow = await isRepoShallow({cwd: workingDirectory})
  const hasSubmodule = await submoduleExists({cwd: workingDirectory})
  let gitFetchExtraArgs = ['--no-tags', '--prune', '--recurse-submodules']
  const isTag = env.GITHUB_REF?.startsWith('refs/tags/')
  const outputRenamedFilesAsDeletedAndAdded =
    inputs.outputRenamedFilesAsDeletedAndAdded
  let submodulePaths: string[] = []

  if (hasSubmodule) {
    submodulePaths = await getSubmodulePath({cwd: workingDirectory})
  }

  if (isTag) {
    gitFetchExtraArgs = ['--prune', '--no-recurse-submodules']
  }

  let diffResult: DiffResult

  if (!github.context.payload.pull_request?.base?.ref) {
    core.info(`Running on a ${github.context.eventName || 'push'} event...`)
    diffResult = await getSHAForNonPullRequestEvent(
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitFetchExtraArgs,
      isTag
    )
  } else {
    core.info(
      `Running on a ${github.context.eventName || 'pull_request'} (${
        github.context.payload.action
      }) event...`
    )
    diffResult = await getSHAForPullRequestEvent(
      inputs,
      env,
      workingDirectory,
      isShallow,
      hasSubmodule,
      gitFetchExtraArgs
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

  const allDiffFiles = await getAllDiffFiles({
    workingDirectory,
    hasSubmodule,
    diffResult,
    submodulePaths,
    outputRenamedFilesAsDeletedAndAdded
  })
  core.debug(`All diff files: ${JSON.stringify(allDiffFiles)}`)
  core.info('All Done!')
  core.endGroup()

  if (inputs.recoverDeletedFiles) {
    let recoverPatterns = getRecoverFilePatterns({inputs})

    if (recoverPatterns.length > 0 && filePatterns.length > 0) {
      core.info('No recover patterns found; defaulting to file patterns')
      recoverPatterns = filePatterns
    }

    await recoverDeletedFiles({
      inputs,
      workingDirectory,
      deletedFiles: allDiffFiles[ChangeTypeEnum.Deleted],
      recoverPatterns,
      sha: diffResult.previousSha
    })
  }

  await changedFilesOutput({
    filePatterns,
    allDiffFiles,
    inputs,
    yamlFilePatterns
  })

  if (inputs.includeAllOldNewRenamedFiles) {
    core.startGroup('changed-files-all-old-new-renamed-files')
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
      value: allOldNewRenamedFiles.paths,
      inputs
    })
    await setOutput({
      key: 'all_old_new_renamed_files_count',
      value: allOldNewRenamedFiles.count,
      inputs
    })
    core.info('All Done!')
    core.endGroup()
  }
}

const getChangedFilesFromRESTAPI = async ({
  inputs,
  filePatterns,
  yamlFilePatterns
}: {
  inputs: Inputs
  filePatterns: string[]
  yamlFilePatterns: Record<string, string[]>
}): Promise<void> => {
  const allDiffFiles = await getChangedFilesFromGithubAPI({
    inputs
  })
  core.debug(`All diff files: ${JSON.stringify(allDiffFiles)}`)
  core.info('All Done!')

  await changedFilesOutput({
    filePatterns,
    allDiffFiles,
    inputs,
    yamlFilePatterns
  })
}

export async function run(): Promise<void> {
  core.startGroup('changed-files')

  const env = await getEnv()
  core.debug(`Env: ${JSON.stringify(env, null, 2)}`)

  const inputs = getInputs()
  core.debug(`Inputs: ${JSON.stringify(inputs, null, 2)}`)

  core.debug(`Github Context: ${JSON.stringify(github.context, null, 2)}`)

  const workingDirectory = path.resolve(
    env.GITHUB_WORKSPACE || process.cwd(),
    inputs.path
  )
  core.debug(`Working directory: ${workingDirectory}`)

  const hasGitDirectory = await hasLocalGitDirectory({workingDirectory})
  core.debug(`Has git directory: ${hasGitDirectory}`)

  const filePatterns = await getFilePatterns({
    inputs,
    workingDirectory
  })
  core.debug(`File patterns: ${filePatterns}`)

  const yamlFilePatterns = await getYamlFilePatterns({
    inputs,
    workingDirectory
  })
  core.debug(`Yaml file patterns: ${JSON.stringify(yamlFilePatterns)}`)

  if (
    inputs.token &&
    github.context.payload.pull_request?.number &&
    !hasGitDirectory
  ) {
    core.info("Using GitHub's REST API to get changed files")
    const unsupportedInputs: (keyof Inputs)[] = [
      'sha',
      'baseSha',
      'since',
      'until',
      'sinceLastRemoteCommit',
      'recoverDeletedFiles',
      'recoverDeletedFilesToDestination',
      'includeAllOldNewRenamedFiles'
    ]

    for (const input of unsupportedInputs) {
      if (inputs[input]) {
        core.warning(
          `Input "${input}" is not supported when using GitHub's REST API to get changed files`
        )
      }
    }
    await getChangedFilesFromRESTAPI({
      inputs,
      filePatterns,
      yamlFilePatterns
    })
  } else {
    if (!hasGitDirectory) {
      core.setFailed(
        "Can't find local .git directory. Please run actions/checkout before this action"
      )
      return
    }

    core.info('Using local .git directory')
    await getChangedFilesFromLocalGit({
      inputs,
      env,
      workingDirectory,
      filePatterns,
      yamlFilePatterns
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
