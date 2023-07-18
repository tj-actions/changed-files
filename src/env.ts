import * as core from '@actions/core'

export type Env = {
  GITHUB_REF_NAME: string
  GITHUB_REF: string
  GITHUB_WORKSPACE: string
}
export const getEnv = async (): Promise<Env> => {
  core.debug(`Process Env: ${JSON.stringify(process.env, null, 2)}`)

  return {
    GITHUB_REF_NAME: process.env.GITHUB_REF_NAME || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE || ''
  }
}
