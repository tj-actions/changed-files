import {promises as fs} from 'fs'
import * as core from '@actions/core'

export type Env = {
  GITHUB_REF_NAME: string
  GITHUB_REF: string
  GITHUB_WORKSPACE: string
  GITHUB_EVENT_ACTION: string
  GITHUB_EVENT_NAME: string
  GITHUB_EVENT_FORCED: string
  GITHUB_EVENT_BEFORE: string
  GITHUB_EVENT_BASE_REF: string
  GITHUB_EVENT_RELEASE_TARGET_COMMITISH: string
  GITHUB_EVENT_HEAD_REPO_FORK: string
  GITHUB_EVENT_PULL_REQUEST_NUMBER: string
  GITHUB_EVENT_PULL_REQUEST_BASE_SHA: string
  GITHUB_EVENT_PULL_REQUEST_HEAD_SHA: string
  GITHUB_EVENT_PULL_REQUEST_HEAD_REF: string
  GITHUB_EVENT_PULL_REQUEST_BASE_REF: string
}

type GithubEvent = {
  action?: string
  forced?: string
  pull_request?: {
    head: {
      ref: string
      sha: string
    }
    base: {
      ref: string
      sha: string
    }
    number: string
  }
  release?: {
    target_commitish: string
  }
  before?: string
  base_ref?: string
  head?: {
    repo?: {
      fork: string
    }
  }
}

export const getEnv = async (): Promise<Env> => {
  const eventPath = process.env.GITHUB_EVENT_PATH
  let eventJson: GithubEvent = {}

  if (eventPath) {
    eventJson = JSON.parse(await fs.readFile(eventPath, {encoding: 'utf8'}))
  }
  core.debug(`Env: ${JSON.stringify(process.env, null, 2)}`)
  core.debug(`Event: ${JSON.stringify(eventJson, null, 2)}`)

  return {
    GITHUB_EVENT_PULL_REQUEST_HEAD_REF: eventJson.pull_request?.head?.ref || '',
    GITHUB_EVENT_PULL_REQUEST_BASE_REF: eventJson.pull_request?.base?.ref || '',
    GITHUB_EVENT_BEFORE: eventJson.before || '',
    GITHUB_EVENT_BASE_REF: eventJson.base_ref || '',
    GITHUB_EVENT_RELEASE_TARGET_COMMITISH:
      eventJson.release?.target_commitish || '',
    GITHUB_EVENT_HEAD_REPO_FORK: eventJson.head?.repo?.fork || '',
    GITHUB_EVENT_PULL_REQUEST_NUMBER: eventJson.pull_request?.number || '',
    GITHUB_EVENT_PULL_REQUEST_BASE_SHA: eventJson.pull_request?.base?.sha || '',
    GITHUB_EVENT_PULL_REQUEST_HEAD_SHA: eventJson.pull_request?.head?.sha || '',
    GITHUB_EVENT_FORCED: eventJson.forced || '',
    GITHUB_EVENT_ACTION: eventJson.action || '',
    GITHUB_REF_NAME: process.env.GITHUB_REF_NAME || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE || '',
    GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME || ''
  }
}
