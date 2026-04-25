import * as github from '@actions/github'
import {getChangedFilesFromGithubAPI, ChangeTypeEnum} from '../changedFiles'
import {Inputs} from '../inputs'

// Minimal valid inputs for REST API tests
const baseInputs: Inputs = {
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
}

// Mock octokit
const mockPaginate = jest.fn()
const mockListFilesEndpointMerge = jest.fn()
const mockCompareCommitsEndpointMerge = jest.fn()

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
      pulls: {
        listFiles: {
          endpoint: {
            merge: mockListFilesEndpointMerge
          }
        }
      },
      repos: {
        compareCommits: {
          endpoint: {
            merge: mockCompareCommitsEndpointMerge
          }
        }
      }
    },
    paginate: mockPaginate
  }))
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mutableContext = github.context as any

describe('getChangedFilesFromGithubAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListFilesEndpointMerge.mockReturnValue('pulls-options')
    mockCompareCommitsEndpointMerge.mockReturnValue('compare-options')
    // Default: PR event
    mutableContext.eventName = 'pull_request'
    mutableContext.payload = {
      pull_request: {
        number: 42,
        base: {sha: 'base-sha'},
        head: {sha: 'head-sha'}
      }
    }
  })

  describe('pull_request events (existing behavior)', () => {
    it('calls pulls.listFiles for pull_request events', async () => {
      mockPaginate.mockResolvedValue([])

      await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(mockListFilesEndpointMerge).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 42,
        per_page: 100
      })
      expect(mockPaginate).toHaveBeenCalledWith('pulls-options')
    })

    it('maps file statuses correctly', async () => {
      mockPaginate.mockResolvedValue([
        {filename: 'added.ts', status: 'added'},
        {filename: 'removed.ts', status: 'removed'},
        {filename: 'modified.ts', status: 'modified'},
        {filename: 'copied.ts', status: 'copied'},
        {filename: 'changed.ts', status: 'changed'},
        {filename: 'unchanged.ts', status: 'unchanged'}
      ])

      const result = await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(result[ChangeTypeEnum.Added]).toEqual(['added.ts'])
      expect(result[ChangeTypeEnum.Deleted]).toEqual(['removed.ts'])
      expect(result[ChangeTypeEnum.Modified]).toEqual(['modified.ts'])
      expect(result[ChangeTypeEnum.Copied]).toEqual(['copied.ts'])
      expect(result[ChangeTypeEnum.TypeChanged]).toEqual(['changed.ts'])
      expect(result[ChangeTypeEnum.Unmerged]).toEqual(['unchanged.ts'])
    })

    it('handles renamed files normally', async () => {
      mockPaginate.mockResolvedValue([
        {
          filename: 'new-name.ts',
          status: 'renamed',
          previous_filename: 'old-name.ts'
        }
      ])

      const result = await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(result[ChangeTypeEnum.Renamed]).toEqual(['new-name.ts'])
      expect(result[ChangeTypeEnum.Deleted]).toEqual([])
      expect(result[ChangeTypeEnum.Added]).toEqual([])
    })

    it('handles renamed files as deleted+added when configured', async () => {
      mockPaginate.mockResolvedValue([
        {
          filename: 'new-name.ts',
          status: 'renamed',
          previous_filename: 'old-name.ts'
        }
      ])

      const result = await getChangedFilesFromGithubAPI({
        inputs: {...baseInputs, outputRenamedFilesAsDeletedAndAdded: true}
      })

      expect(result[ChangeTypeEnum.Renamed]).toEqual([])
      expect(result[ChangeTypeEnum.Deleted]).toEqual(['old-name.ts'])
      expect(result[ChangeTypeEnum.Added]).toEqual(['new-name.ts'])
    })

    it('maps unknown statuses to Unknown', async () => {
      mockPaginate.mockResolvedValue([
        {filename: 'weird.ts', status: 'something_unexpected'}
      ])

      const result = await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(result[ChangeTypeEnum.Unknown]).toEqual(['weird.ts'])
    })
  })

  describe('push events (new behavior)', () => {
    beforeEach(() => {
      mutableContext.eventName = 'push'
      mutableContext.payload = {
        before: 'base-sha-push',
        after: 'head-sha-push'
      }
    })

    it('calls repos.compareCommits for push events', async () => {
      mockPaginate.mockResolvedValue([])

      await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(mockCompareCommitsEndpointMerge).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        base: 'base-sha-push',
        head: 'head-sha-push',
        per_page: 100
      })
      expect(mockPaginate).toHaveBeenCalledWith('compare-options')
      expect(mockListFilesEndpointMerge).not.toHaveBeenCalled()
    })

    it('returns empty results for force push with null SHA', async () => {
      mutableContext.payload = {
        before: '0000000000000000000000000000000000000000',
        after: 'head-sha-push'
      }

      const result = await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(result[ChangeTypeEnum.Added]).toEqual([])
      expect(result[ChangeTypeEnum.Modified]).toEqual([])
      expect(result[ChangeTypeEnum.Deleted]).toEqual([])
      expect(mockPaginate).not.toHaveBeenCalled()
      expect(mockCompareCommitsEndpointMerge).not.toHaveBeenCalled()
    })

    it('maps file statuses correctly for push events', async () => {
      mockPaginate.mockResolvedValue([
        {filename: 'added.ts', status: 'added'},
        {filename: 'modified.ts', status: 'modified'},
        {filename: 'removed.ts', status: 'removed'}
      ])

      const result = await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(result[ChangeTypeEnum.Added]).toEqual(['added.ts'])
      expect(result[ChangeTypeEnum.Modified]).toEqual(['modified.ts'])
      expect(result[ChangeTypeEnum.Deleted]).toEqual(['removed.ts'])
    })
  })

  describe('merge_group events (new behavior)', () => {
    beforeEach(() => {
      mutableContext.eventName = 'merge_group'
      mutableContext.payload = {
        merge_group: {
          base_sha: 'mg-base-sha',
          head_sha: 'mg-head-sha'
        }
      }
    })

    it('calls repos.compareCommits for merge_group events', async () => {
      mockPaginate.mockResolvedValue([])

      await getChangedFilesFromGithubAPI({inputs: baseInputs})

      expect(mockCompareCommitsEndpointMerge).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        base: 'mg-base-sha',
        head: 'mg-head-sha',
        per_page: 100
      })
      expect(mockPaginate).toHaveBeenCalledWith('compare-options')
      expect(mockListFilesEndpointMerge).not.toHaveBeenCalled()
    })
  })

  describe('unsupported events', () => {
    it('throws for unsupported event types', async () => {
      mutableContext.eventName = 'schedule'
      mutableContext.payload = {}

      await expect(
        getChangedFilesFromGithubAPI({inputs: baseInputs})
      ).rejects.toThrow()
    })
  })
})
