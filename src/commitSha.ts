import * as core from '@actions/core'

import {Env} from './env'
import {Inputs} from './inputs'
import {
  canDiffCommits,
  getHeadSha,
  getParentHeadSha,
  getPreviousGitTag,
  gitFetch,
  gitFetchSubmodules,
  gitLog,
  gitLsRemote,
  verifyCommitSha
} from './utils'

const getCurrentSHA = async ({
  inputs,
  workingDirectory
}: {
  inputs: Inputs
  workingDirectory: string
}): Promise<string> => {
  let currentSha = inputs.sha
  core.debug('Getting current SHA...')

  if (inputs.until) {
    core.debug(`Getting base SHA for '${inputs.until}'...`)
    try {
      currentSha = await gitLog({
        cwd: workingDirectory,
        args: [
          '--format=%H',
          '-n',
          '1',
          '--date',
          'local',
          '--until',
          inputs.until
        ]
      })
    } catch (error) {
      core.error(
        `Invalid until date: ${inputs.until}. ${(error as Error).message}`
      )
      throw error
    }
  } else {
    if (!currentSha) {
      currentSha = await getHeadSha({cwd: workingDirectory})
    }
  }

  await verifyCommitSha({sha: currentSha, cwd: workingDirectory})
  core.debug(`Current SHA: ${currentSha}`)

  return currentSha
}

export interface DiffResult {
  previousSha: string
  currentSha: string
  currentBranch: string
  targetBranch: string
  diff: string
}

export const getSHAForPushEvent = async (
  inputs: Inputs,
  env: Env,
  workingDirectory: string,
  isShallow: boolean,
  hasSubmodule: boolean,
  gitExtraArgs: string[],
  isTag: boolean
): Promise<DiffResult> => {
  let targetBranch = env.GITHUB_REF_NAME
  const currentBranch = targetBranch
  let initialCommit = false

  if (isShallow) {
    core.info('Repository is shallow, fetching more history...')

    if (isTag) {
      const sourceBranch = env.GITHUB_EVENT_BASE_REF.replace('refs/heads/', '')
      await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`,
          'origin',
          `+refs/tags/${sourceBranch}:refs/remotes/origin/${sourceBranch}`
        ]
      })
    } else {
      await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`,
          'origin',
          `+refs/heads/${targetBranch}:refs/remotes/origin/${targetBranch}`
        ]
      })
    }

    if (hasSubmodule) {
      await gitFetchSubmodules({
        cwd: workingDirectory,
        args: [
          ...gitExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`
        ]
      })
    }
  }

  const currentSha = await getCurrentSHA({inputs, workingDirectory})
  let previousSha = inputs.baseSha
  const diff = '..'

  if (previousSha && currentSha && currentBranch && targetBranch) {
    if (previousSha === currentSha) {
      core.error(
        `Similar commit hashes detected: previous sha: ${previousSha} is equivalent to the current sha: ${currentSha}.`
      )
      core.error(
        `Please verify that both commits are valid, and increase the fetch_depth to a number higher than ${inputs.fetchDepth}.`
      )
      throw new Error('Similar commit hashes detected.')
    }

    await verifyCommitSha({sha: previousSha, cwd: workingDirectory})
    core.info(`Previous SHA: ${previousSha}`)

    return {
      previousSha,
      currentSha,
      currentBranch,
      targetBranch,
      diff
    }
  }

  if (!previousSha) {
    core.debug('Getting previous SHA...')
    if (inputs.since) {
      core.debug(`Getting base SHA for '${inputs.since}'...`)
      try {
        const allCommitsFrom = await gitLog({
          cwd: workingDirectory,
          args: ['--format=%H', '--date', 'local', '--since', inputs.since]
        })

        if (allCommitsFrom) {
          const allCommitsFromArray = allCommitsFrom.split('\n')
          previousSha = allCommitsFromArray[allCommitsFromArray.length - 1]
        }
      } catch (error) {
        core.error(
          `Invalid since date: ${inputs.since}. ${(error as Error).message}`
        )
        throw error
      }
    } else if (isTag) {
      core.debug('Getting previous SHA for tag...')
      const {sha, tag} = await getPreviousGitTag({cwd: workingDirectory})
      previousSha = sha
      targetBranch = tag
    } else {
      if (inputs.sinceLastRemoteCommit) {
        core.debug('Getting previous SHA for last remote commit...')

        if (env.GITHUB_EVENT_FORCED === 'false' || !env.GITHUB_EVENT_FORCED) {
          previousSha = env.GITHUB_EVENT_BEFORE
        } else {
          previousSha = await getParentHeadSha({cwd: workingDirectory})
        }
      } else {
        core.debug('Getting previous SHA for last commit...')
        previousSha = await getParentHeadSha({cwd: workingDirectory})
      }

      if (
        !previousSha ||
        previousSha === '0000000000000000000000000000000000000000'
      ) {
        previousSha = await getParentHeadSha({cwd: workingDirectory})
      }

      if (previousSha === currentSha) {
        if (!(await getParentHeadSha({cwd: workingDirectory}))) {
          core.warning('Initial commit detected no previous commit found.')
          initialCommit = true
          previousSha = currentSha
        } else {
          previousSha = await getParentHeadSha({cwd: workingDirectory})
        }
      } else {
        if (!previousSha) {
          core.error('Unable to locate a previous commit.')
          throw new Error('Unable to locate a previous commit.')
        }
      }
    }
  }

  await verifyCommitSha({sha: previousSha, cwd: workingDirectory})
  core.debug(`Previous SHA: ${previousSha}`)

  core.debug(`Target branch: ${targetBranch}`)
  core.debug(`Current branch: ${currentBranch}`)

  if (!initialCommit && previousSha === currentSha) {
    core.error(
      `Similar commit hashes detected: previous sha: ${previousSha} is equivalent to the current sha: ${currentSha}.`
    )
    core.error(
      `Please verify that both commits are valid, and increase the fetch_depth to a number higher than ${inputs.fetchDepth}.`
    )
    throw new Error('Similar commit hashes detected.')
  }

  return {
    previousSha,
    currentSha,
    currentBranch,
    targetBranch,
    diff
  }
}

export const getSHAForPullRequestEvent = async (
  inputs: Inputs,
  env: Env,
  workingDirectory: string,
  isShallow: boolean,
  hasSubmodule: boolean,
  gitExtraArgs: string[]
): Promise<DiffResult> => {
  let targetBranch = env.GITHUB_EVENT_PULL_REQUEST_BASE_REF
  const currentBranch = env.GITHUB_EVENT_PULL_REQUEST_HEAD_REF
  if (inputs.sinceLastRemoteCommit) {
    targetBranch = currentBranch
  }

  if (isShallow) {
    core.info('Repository is shallow, fetching more history...')

    const prFetchExitCode = await gitFetch({
      cwd: workingDirectory,
      args: [
        ...gitExtraArgs,
        '-u',
        '--progress',
        'origin',
        `pull/${env.GITHUB_EVENT_PULL_REQUEST_NUMBER}/head:${currentBranch}`
      ]
    })

    if (prFetchExitCode !== 0) {
      await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`,
          'origin',
          `+refs/heads/${currentBranch}*:refs/remotes/origin/${currentBranch}*`
        ]
      })
    }

    if (!inputs.sinceLastRemoteCommit) {
      core.debug('Fetching target branch...')
      await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`,
          'origin',
          `+refs/heads/${targetBranch}:refs/remotes/origin/${targetBranch}`
        ]
      })

      if (hasSubmodule) {
        await gitFetchSubmodules({
          cwd: workingDirectory,
          args: [
            ...gitExtraArgs,
            '-u',
            '--progress',
            `--deepen=${inputs.fetchDepth}`
          ]
        })
      }
    }
  }

  const currentSha = await getCurrentSHA({inputs, workingDirectory})
  let previousSha = inputs.baseSha
  let diff = '...'

  if (previousSha && currentSha && currentBranch && targetBranch) {
    if (previousSha === currentSha) {
      core.error(
        `Similar commit hashes detected: previous sha: ${previousSha} is equivalent to the current sha: ${currentSha}.`
      )
      core.error(
        `Please verify that both commits are valid, and increase the fetch_depth to a number higher than ${inputs.fetchDepth}.`
      )
      throw new Error('Similar commit hashes detected.')
    }

    await verifyCommitSha({sha: currentSha, cwd: workingDirectory})
    core.info(`Previous SHA: ${previousSha}`)

    return {
      previousSha,
      currentSha,
      currentBranch,
      targetBranch,
      diff
    }
  }

  if (
    !env.GITHUB_EVENT_PULL_REQUEST_BASE_REF ||
    env.GITHUB_EVENT_HEAD_REPO_FORK === 'true'
  ) {
    diff = '..'
  }

  if (!previousSha) {
    if (inputs.sinceLastRemoteCommit) {
      previousSha = env.GITHUB_EVENT_BEFORE

      if (!previousSha) {
        previousSha = await gitLsRemote({
          cwd: workingDirectory,
          args: [currentBranch]
        })
      }

      if (
        (await verifyCommitSha({
          sha: previousSha,
          cwd: workingDirectory,
          showAsErrorMessage: false
        })) !== 0
      ) {
        previousSha = env.GITHUB_EVENT_PULL_REQUEST_BASE_SHA
      }
    } else {
      previousSha = env.GITHUB_EVENT_PULL_REQUEST_BASE_SHA

      if (!previousSha) {
        previousSha = await gitLsRemote({
          cwd: workingDirectory,
          args: [targetBranch]
        })
      }

      if (isShallow) {
        if (
          await canDiffCommits({
            cwd: workingDirectory,
            sha1: previousSha,
            sha2: currentSha,
            diff
          })
        ) {
          core.debug(
            'Merge base is not in the local history, fetching remote target branch...'
          )

          for (let i = 1; i <= 10; i++) {
            await gitFetch({
              cwd: workingDirectory,
              args: [
                ...gitExtraArgs,
                '-u',
                '--progress',
                `--deepen=${inputs.fetchDepth}`,
                'origin',
                `+refs/heads/${targetBranch}:refs/remotes/origin/${targetBranch}`
              ]
            })

            if (
              await canDiffCommits({
                cwd: workingDirectory,
                sha1: previousSha,
                sha2: currentSha,
                diff
              })
            ) {
              break
            }

            core.debug(
              'Merge base is not in the local history, fetching remote target branch again...'
            )
            core.debug(`Attempt ${i}/10`)
          }
        }
      }
    }

    if (!previousSha || previousSha === currentSha) {
      previousSha = env.GITHUB_EVENT_PULL_REQUEST_BASE_SHA
    }
  }

  if (
    !(await canDiffCommits({
      cwd: workingDirectory,
      sha1: previousSha,
      sha2: currentSha,
      diff
    }))
  ) {
    diff = '..'
  }

  await verifyCommitSha({sha: previousSha, cwd: workingDirectory})
  core.debug(`Previous SHA: ${previousSha}`)

  if (
    !(await canDiffCommits({
      cwd: workingDirectory,
      sha1: previousSha,
      sha2: currentSha,
      diff
    }))
  ) {
    throw new Error(
      `Unable to determine a difference between ${previousSha}${diff}${currentSha}`
    )
  }

  if (previousSha === currentSha) {
    core.error(
      `Similar commit hashes detected: previous sha: ${previousSha} is equivalent to the current sha: ${currentSha}.`
    )
    core.error(
      `Please verify that both commits are valid, and increase the fetch_depth to a number higher than ${inputs.fetchDepth}.`
    )
    throw new Error('Similar commit hashes detected.')
  }

  return {
    previousSha,
    currentSha,
    currentBranch,
    targetBranch,
    diff
  }
}
