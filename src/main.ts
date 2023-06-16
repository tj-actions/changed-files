import * as core from '@actions/core'
import path from 'path'
import {getAllDiffFiles, getRenamedFiles} from './changedFiles'
import {setChangedFilesOutput} from './changedFilesOutput'
import {
  DiffResult,
  getSHAForPullRequestEvent,
  getSHAForPushEvent
} from './commitSha'
import {getEnv} from './env'
import {getInputs} from './inputs'
import {
  getFilePatterns,
  getSubmodulePath,
  getYamlFilePatterns,
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

  if (!env.GITHUB_EVENT_PULL_REQUEST_BASE_REF) {
    core.info(`Running on a ${env.GITHUB_EVENT_NAME || 'push'} event...`)
    diffResult = await getSHAForPushEvent(
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
      `Running on a ${env.GITHUB_EVENT_NAME || 'pull_request'} (${env.GITHUB_EVENT_ACTION}) event...`
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

  const filePatterns = await getFilePatterns({
    inputs,
    workingDirectory
  })
  core.debug(`File patterns: ${filePatterns}`)

  if (filePatterns.length > 0) {
    core.startGroup('changed-files-patterns')
    await setChangedFilesOutput({
      allDiffFiles,
      filePatterns,
      inputs
    })
    core.info('All Done!')
    core.endGroup()
  }

  const yamlFilePatterns = await getYamlFilePatterns({
    inputs,
    workingDirectory
  })
  core.debug(`Yaml file patterns: ${JSON.stringify(yamlFilePatterns)}`)

  if (Object.keys(yamlFilePatterns).length > 0) {
    for (const key of Object.keys(yamlFilePatterns)) {
      core.startGroup(`changed-files-yaml-${key}`)
      await setChangedFilesOutput({
        allDiffFiles,
        filePatterns: yamlFilePatterns[key],
        inputs,
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
      inputs
    })
    core.info('All Done!')
    core.endGroup()
  }

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
      value: allOldNewRenamedFiles,
      inputs
    })
    core.info('All Done!')
    core.endGroup()
  }
}

/* istanbul ignore if */
if (!process.env.TESTING) {
  // eslint-disable-next-line github/no-then
  run().catch(e => {
    core.setFailed(e.message || e)
  })
}
