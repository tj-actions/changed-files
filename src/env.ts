import {promises as fs} from 'fs'

export type Env = {
  GITHUB_EVENT_PULL_REQUEST_HEAD_REF: string
  GITHUB_EVENT_PULL_REQUEST_BASE_REF: string
  GITHUB_EVENT_BEFORE: string
  GITHUB_REFNAME: string
  GITHUB_REF: string
  GITHUB_EVENT_BASE_REF: string
  GITHUB_EVENT_HEAD_REPO_FORK: string
  GITHUB_WORKSPACE: string
  GITHUB_EVENT_FORCED: string
  GITHUB_EVENT_PULL_REQUEST_NUMBER: string
  GITHUB_EVENT_PULL_REQUEST_BASE_SHA: string
}

export const getEnv = async (): Promise<Env> => {
  const eventJsonPath = process.env.GITHUB_EVENT_PATH
  let eventJson: any = {}

  if (eventJsonPath) {
    eventJson = JSON.parse(await fs.readFile(eventJsonPath, {encoding: 'utf8'}))
  }

  return {
    GITHUB_EVENT_PULL_REQUEST_HEAD_REF: eventJson.pull_request?.head?.ref || '',
    GITHUB_EVENT_PULL_REQUEST_BASE_REF: eventJson.pull_request?.base?.ref || '',
    GITHUB_EVENT_BEFORE: eventJson.before || '',
    GITHUB_EVENT_BASE_REF: eventJson.base_ref || '',
    GITHUB_EVENT_HEAD_REPO_FORK: eventJson.head_repo?.fork || '',
    GITHUB_EVENT_PULL_REQUEST_NUMBER: eventJson.pull_request?.number || '',
    GITHUB_EVENT_PULL_REQUEST_BASE_SHA: eventJson.pull_request?.base?.sha || '',
    GITHUB_EVENT_FORCED: eventJson.forced || '',
    GITHUB_REFNAME: process.env.GITHUB_REFNAME || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE || ''
  }
}
