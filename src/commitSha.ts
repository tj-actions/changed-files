import * as core from '@actions/core'
import * as github from '@actions/github'

import {Env} from './env'
import {Inputs} from './inputs'
import {
  canDiffCommits,
  getHeadSha,
  getParentSha,
  getPreviousGitTag,
  getRemoteBranchHeadSha,
  gitFetch,
  gitFetchSubmodules,
  gitLog,
  verifyCommitSha
} from './utils'

const getCurrentSHA = async ({
  env,
  inputs,
  workingDirectory
}: {
  env: Env
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
      if (
        github.context.payload.pull_request?.head?.sha &&
        (await verifyCommitSha({
          sha: github.context.payload.pull_request?.head?.sha,
          cwd: workingDirectory,
          showAsErrorMessage: false
        })) === 0
      ) {
        currentSha = github.context.payload.pull_request?.head?.sha
      } else {
        currentSha = await getHeadSha({cwd: workingDirectory})
      }
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
  initialCommit?: boolean
}

export const getSHAForPushEvent = async (
  inputs: Inputs,
  env: Env,
  workingDirectory: string,
  isShallow: boolean,
  hasSubmodule: boolean,
  gitFetchExtraArgs: string[],
  isTag: boolean
): Promise<DiffResult> => {
  let targetBranch = env.GITHUB_REF_NAME
  const currentBranch = targetBranch
  let initialCommit = false

  if (isShallow && !inputs.skipInitialFetch) {
    core.info('Repository is shallow, fetching more history...')

    if (isTag) {
      const sourceBranch =
        github.context.payload.base_ref.replace('refs/heads/', '') ||
        github.context.payload.release?.target_commitish
      await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitFetchExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`,
          'origin',
          `+refs/heads/${sourceBranch}:refs/remotes/origin/${sourceBranch}`
        ]
      })
    } else {
      await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitFetchExtraArgs,
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
          ...gitFetchExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`
        ]
      })
    }
  }

  const currentSha = await getCurrentSHA({env, inputs, workingDirectory})
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
    core.debug(`Previous SHA: ${previousSha}`)

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
      core.debug('Getting previous SHA for last remote commit...')
      if (
        github.context.payload.forced === 'false' ||
        !github.context.payload.forced
      ) {
        previousSha = github.context.payload.before
      }

      if (
        !previousSha ||
        previousSha === '0000000000000000000000000000000000000000'
      ) {
        previousSha = await getParentSha({
          cwd: workingDirectory
        })
      } else if (
        (await verifyCommitSha({
          sha: previousSha,
          cwd: workingDirectory,
          showAsErrorMessage: false
        })) !== 0
      ) {
        core.warning(
          `Previous commit ${previousSha} is not valid. Using parent commit.`
        )
        previousSha = await getParentSha({
          cwd: workingDirectory
        })
      }

      if (!previousSha || previousSha === currentSha) {
        previousSha = await getParentSha({
          cwd: workingDirectory
        })

        if (!previousSha) {
          core.warning('Initial commit detected no previous commit found.')
          initialCommit = true
          previousSha = currentSha
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
    diff,
    initialCommit
  }
}

export const getSHAForPullRequestEvent = async (
  inputs: Inputs,
  env: Env,
  workingDirectory: string,
  isShallow: boolean,
  hasSubmodule: boolean,
  gitFetchExtraArgs: string[]
): Promise<DiffResult> => {
  let targetBranch = github.context.payload.pull_request?.base?.ref
  const currentBranch = github.context.payload.pull_request?.head?.ref
  if (inputs.sinceLastRemoteCommit) {
    targetBranch = currentBranch
  }

  if (isShallow && !inputs.skipInitialFetch) {
    core.info('Repository is shallow, fetching more history...')

    let prFetchExitCode = await gitFetch({
      cwd: workingDirectory,
      args: [
        ...gitFetchExtraArgs,
        '-u',
        '--progress',
        'origin',
        `pull/${github.context.payload.pull_request?.number}/head:${currentBranch}`
      ]
    })

    if (prFetchExitCode !== 0) {
      prFetchExitCode = await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitFetchExtraArgs,
          '-u',
          '--progress',
          `--deepen=${inputs.fetchDepth}`,
          'origin',
          `+refs/heads/${currentBranch}*:refs/remotes/origin/${currentBranch}*`
        ]
      })
    }

    if (prFetchExitCode !== 0) {
      throw new Error(
        'Failed to fetch pull request branch. Please ensure "persist-credentials" is set to "true" when checking out the repository. See: https://github.com/actions/checkout#usage'
      )
    }

    if (!inputs.sinceLastRemoteCommit) {
      core.debug('Fetching target branch...')
      await gitFetch({
        cwd: workingDirectory,
        args: [
          ...gitFetchExtraArgs,
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
            ...gitFetchExtraArgs,
            '-u',
            '--progress',
            `--deepen=${inputs.fetchDepth}`
          ]
        })
      }
    }
    core.info('Completed fetching more history.')
  }

  const currentSha = await getCurrentSHA({env, inputs, workingDirectory})
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

    await verifyCommitSha({sha: previousSha, cwd: workingDirectory})
    core.debug(`Previous SHA: ${previousSha}`)

    return {
      previousSha,
      currentSha,
      currentBranch,
      targetBranch,
      diff
    }
  }

  if (
    !github.context.payload.pull_request?.base?.ref ||
    github.context.payload.head?.repo?.fork === 'true'
  ) {
    diff = '..'
  }

  if (!previousSha) {
    if (inputs.sinceLastRemoteCommit) {
      previousSha = github.context.payload.before

      if (
        !previousSha ||
        (previousSha &&
          (await verifyCommitSha({sha: previousSha, cwd: workingDirectory})) !==
            0)
      ) {
        core.warning(
          'Unable to locate the remote branch head sha. Falling back to the previous commit in the local history.'
        )
        previousSha = await getParentSha({
          cwd: workingDirectory
        })

        if (!previousSha) {
          core.warning(
            'Unable to locate the previous commit in the local history. Falling back to the pull request base sha.'
          )
          previousSha = github.context.payload.pull_request?.base?.sha
        }
      }
    } else {
      previousSha = await getRemoteBranchHeadSha({
        cwd: workingDirectory,
        branch: targetBranch
      })

      if (!previousSha) {
        previousSha = github.context.payload.pull_request?.base?.sha
      }

      if (isShallow) {
        if (
          !(await canDiffCommits({
            cwd: workingDirectory,
            sha1: previousSha,
            sha2: currentSha,
            diff
          }))
        ) {
          core.info(
            'Merge base is not in the local history, fetching remote target branch...'
          )

          for (let i = 1; i <= 10; i++) {
            await gitFetch({
              cwd: workingDirectory,
              args: [
                ...gitFetchExtraArgs,
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

            core.info(
              'Merge base is not in the local history, fetching remote target branch again...'
            )
            core.info(`Attempt ${i}/10`)
          }
        }
      }
    }

    if (!previousSha || previousSha === currentSha) {
      previousSha = github.context.payload.pull_request?.base?.sha
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
    // This occurs if a PR is created from a forked repository and the event is pull_request_target.
    //  - name: Checkout to branch
    //    uses: actions/checkout@v3
    // Without setting the repository to use the same repository as the pull request will cause the previousSha
    // to be the same as the currentSha since the currentSha cannot be found in the local history.
    // The solution is to use:
    //   - name: Checkout to branch
    //     uses: actions/checkout@v3
    //     with:
    //       repository: ${{ github.event.pull_request.head.repo.full_name }}
    if (github.context.eventName === 'pull_request_target') {
      core.warning(
        'If this pull request is from a forked repository, please set the checkout action `repository` input to the same repository as the pull request.'
      )
      core.warning(
        'This can be done by setting actions/checkout `repository` to ${{ github.event.pull_request.head.repo.full_name }}'
      )
    } else {
      core.error(
        `Please verify that both commits are valid, and increase the fetch_depth to a number higher than ${inputs.fetchDepth}.`
      )
    }
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
