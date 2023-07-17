import * as core from '@actions/core'
import * as github from '@actions/github'

export type Env = {
  GITHUB_REF_NAME: string
  GITHUB_REF: string
  GITHUB_WORKSPACE: string
  GITHUB_EVENT_ACTION: string
  GITHUB_EVENT_FORCED: string
  GITHUB_EVENT_BEFORE: string
  GITHUB_EVENT_BASE_REF: string
  GITHUB_EVENT_RELEASE_TARGET_COMMITISH: string
  GITHUB_EVENT_HEAD_REPO_FORK: string
  GITHUB_EVENT_PULL_REQUEST_NUMBER?: number
  GITHUB_EVENT_PULL_REQUEST_BASE_SHA: string
  GITHUB_EVENT_PULL_REQUEST_HEAD_SHA: string
  GITHUB_EVENT_PULL_REQUEST_HEAD_REF: string
  GITHUB_EVENT_PULL_REQUEST_BASE_REF: string
}
export const getEnv = async (): Promise<Env> => {
  const eventPayload = github.context.payload
  core.debug(`Event Payload: ${JSON.stringify(eventPayload, null, 2)}`)

  return {
    GITHUB_EVENT_PULL_REQUEST_HEAD_REF:
      eventPayload.pull_request?.head?.ref || '',
    GITHUB_EVENT_PULL_REQUEST_BASE_REF:
      eventPayload.pull_request?.base?.ref || '',
    GITHUB_EVENT_BEFORE: eventPayload.before || '',
    GITHUB_EVENT_BASE_REF: eventPayload.base_ref || '',
    GITHUB_EVENT_RELEASE_TARGET_COMMITISH:
      eventPayload.release?.target_commitish || '',
    GITHUB_EVENT_HEAD_REPO_FORK: eventPayload.head?.repo?.fork || '',
    GITHUB_EVENT_PULL_REQUEST_NUMBER: eventPayload.pull_request?.number,
    GITHUB_EVENT_PULL_REQUEST_BASE_SHA:
      eventPayload.pull_request?.base?.sha || '',
    GITHUB_EVENT_PULL_REQUEST_HEAD_SHA:
      eventPayload.pull_request?.head?.sha || '',
    GITHUB_EVENT_FORCED: eventPayload.forced || '',
    GITHUB_EVENT_ACTION: eventPayload.action || '',
    GITHUB_REF_NAME: process.env.GITHUB_REF_NAME || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE || ''
  }
}
