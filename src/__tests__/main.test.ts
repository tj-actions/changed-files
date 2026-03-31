import * as github from '@actions/github'
import * as core from '@actions/core'

// Must import run() after mocks are set up
import {run} from '../main'

// Mock all heavy dependencies to isolate routing logic
jest.mock('@actions/core')
jest.mock('@actions/github', () => ({
  context: {
    repo: {owner: 'test-owner', repo: 'test-repo'},
    eventName: 'pull_request',
    payload: {
      pull_request: {
        number: 42,
        base: {sha: 'base-sha'},
        head: {sha: 'head-sha'}
      }
    }
  },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: {listFiles: {endpoint: {merge: jest.fn()}}},
      repos: {compareCommits: {endpoint: {merge: jest.fn()}}}
    },
    paginate: jest.fn().mockResolvedValue([])
  }))
}))

// Mock utils to avoid git operations
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  hasLocalGitDirectory: jest.fn().mockResolvedValue(false),
  getFilePatterns: jest.fn().mockResolvedValue([]),
  getYamlFilePatterns: jest.fn().mockResolvedValue({}),
  warnUnsupportedRESTAPIInputs: jest.fn(),
  verifyMinimumGitVersion: jest.fn(),
  updateGitGlobalConfig: jest.fn(),
  isRepoShallow: jest.fn().mockResolvedValue(false),
  submoduleExists: jest.fn().mockResolvedValue(false),
  getSubmodulePath: jest.fn().mockResolvedValue([]),
  getRecoverFilePatterns: jest.fn().mockResolvedValue([]),
  setOutput: jest.fn()
}))

jest.mock('../env', () => ({
  getEnv: jest.fn().mockResolvedValue({
    GITHUB_REF_NAME: 'main',
    GITHUB_REF: 'refs/heads/main',
    GITHUB_WORKSPACE: '/workspace'
  })
}))

jest.mock('../inputs', () => ({
  getInputs: jest.fn().mockReturnValue({
    files: '',
    filesSeparator: '\n',
    filesFromSourceFile: '',
    filesFromSourceFileSeparator: '\n',
    filesYaml: '',
    filesYamlFromSourceFile: '',
    filesYamlFromSourceFileSeparator: '\n',
    filesIgnore: '',
    filesIgnoreSeparator: '\n',
    filesIgnoreFromSourceFile: '',
    filesIgnoreFromSourceFileSeparator: '\n',
    filesIgnoreYaml: '',
    filesIgnoreYamlFromSourceFile: '',
    filesIgnoreYamlFromSourceFileSeparator: '\n',
    separator: ' ',
    includeAllOldNewRenamedFiles: false,
    oldNewSeparator: ',',
    oldNewFilesSeparator: ' ',
    sha: '',
    baseSha: '',
    since: '',
    until: '',
    path: '.',
    quotepath: true,
    diffRelative: true,
    dirNames: false,
    dirNamesExcludeCurrentDir: false,
    dirNamesIncludeFiles: '',
    dirNamesIncludeFilesSeparator: '\n',
    dirNamesDeletedFilesIncludeOnlyDeletedDirs: false,
    json: false,
    escapeJson: true,
    safeOutput: true,
    fetchAdditionalSubmoduleHistory: false,
    sinceLastRemoteCommit: false,
    writeOutputFiles: false,
    outputDir: '.github/outputs',
    outputRenamedFilesAsDeletedAndAdded: false,
    recoverDeletedFiles: false,
    recoverDeletedFilesToDestination: '',
    recoverFiles: '',
    recoverFilesSeparator: '\n',
    recoverFilesIgnore: '',
    recoverFilesIgnoreSeparator: '\n',
    token: 'fake-token',
    apiUrl: 'https://api.github.com',
    skipInitialFetch: false,
    failOnInitialDiffError: false,
    failOnSubmoduleDiffError: false,
    negationPatternsFirst: false,
    useRestApi: true,
    excludeSubmodules: false,
    excludeSymlinks: false,
    skipSameSha: false,
    fetchMissingHistoryMaxRetries: 20,
    usePosixPathSeparator: false,
    tagsPattern: '*',
    tagsIgnorePattern: ''
  })
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mutableContext = github.context as any

describe('main routing logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses REST API for pull_request events without git directory', async () => {
    mutableContext.eventName = 'pull_request'
    mutableContext.payload = {
      pull_request: {number: 42, base: {sha: 'abc'}, head: {sha: 'def'}}
    }

    await run()

    expect(core.info).toHaveBeenCalledWith(
      "Using GitHub's REST API to get changed files"
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('uses REST API for push events without git directory', async () => {
    mutableContext.eventName = 'push'
    mutableContext.payload = {before: 'abc', after: 'def'}

    await run()

    expect(core.info).toHaveBeenCalledWith(
      "Using GitHub's REST API to get changed files"
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('uses REST API for merge_group events without git directory', async () => {
    mutableContext.eventName = 'merge_group'
    mutableContext.payload = {merge_group: {base_sha: 'abc', head_sha: 'def'}}

    await run()

    expect(core.info).toHaveBeenCalledWith(
      "Using GitHub's REST API to get changed files"
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('throws for unsupported events with use_rest_api', async () => {
    mutableContext.eventName = 'schedule'
    mutableContext.payload = {}

    await expect(run()).rejects.toThrow('not supported')
  })
})
