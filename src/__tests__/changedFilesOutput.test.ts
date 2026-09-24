import * as core from '@actions/core'
import {ChangedFiles, ChangeTypeEnum} from '../changedFiles'
import {setOutputsAndGetModifiedAndChangedFilesStatus} from '../changedFilesOutput'
import {Inputs} from '../inputs'

const baseInputs = {
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
  json: true,
  escapeJson: false,
  safeOutput: false,
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
  useRestApi: false,
  excludeSubmodules: false,
  excludeSymlinks: false,
  skipSameSha: false,
  fetchMissingHistoryMaxRetries: 20,
  usePosixPathSeparator: false,
  tagsPattern: '*',
  tagsIgnorePattern: '',
  fetchDepth: 25
} as unknown as Inputs

const emptyChangedFiles: ChangedFiles = {
  [ChangeTypeEnum.Added]: [],
  [ChangeTypeEnum.Copied]: [],
  [ChangeTypeEnum.Deleted]: [],
  [ChangeTypeEnum.Modified]: [],
  [ChangeTypeEnum.Renamed]: [],
  [ChangeTypeEnum.TypeChanged]: [],
  [ChangeTypeEnum.Unmerged]: [],
  [ChangeTypeEnum.Unknown]: []
}

/**
 * Build a ChangedFiles value from the change types given.
 *
 * @param overrides - paths keyed by change type.
 * @returns a complete ChangedFiles value.
 */
function changedFiles(overrides: Partial<ChangedFiles>): ChangedFiles {
  return {...emptyChangedFiles, ...overrides}
}

/**
 * Read a captured output value and parse it back into a list of paths.
 *
 * @param setOutputMock - the mocked core.setOutput.
 * @param key - the output name to look up.
 * @returns the paths written for that output.
 */
function outputPaths(
  setOutputMock: jest.SpyInstance,
  key: string
): string[] | undefined {
  const call = setOutputMock.mock.calls.find(([name]) => name === key)
  return call ? JSON.parse(call[1] as string) : undefined
}

describe('setOutputsAndGetModifiedAndChangedFilesStatus', () => {
  let setOutputMock: jest.SpyInstance

  beforeEach(() => {
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    jest.spyOn(core, 'debug').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('reports the changed files the filter left out', async () => {
    const allDiffFiles = changedFiles({
      [ChangeTypeEnum.Added]: ['src/a.ts', 'docs/b.md'],
      [ChangeTypeEnum.Modified]: ['src/c.ts', 'docs/d.md']
    })
    const allFilteredDiffFiles = changedFiles({
      [ChangeTypeEnum.Added]: ['src/a.ts'],
      [ChangeTypeEnum.Modified]: ['src/c.ts']
    })

    await setOutputsAndGetModifiedAndChangedFilesStatus({
      allDiffFiles,
      allFilteredDiffFiles,
      inputs: baseInputs,
      filePatterns: ['src/**']
    })

    expect(outputPaths(setOutputMock, 'other_changed_files')).toEqual([
      'docs/b.md',
      'docs/d.md'
    ])
    expect(outputPaths(setOutputMock, 'only_changed')).toBe(false)
  })

  it('reports nothing left out when the filter matches every file', async () => {
    const allDiffFiles = changedFiles({
      [ChangeTypeEnum.Added]: ['src/a.ts', 'src/b.ts']
    })

    await setOutputsAndGetModifiedAndChangedFilesStatus({
      allDiffFiles,
      allFilteredDiffFiles: allDiffFiles,
      inputs: baseInputs,
      filePatterns: ['src/**']
    })

    expect(outputPaths(setOutputMock, 'other_changed_files')).toEqual([])
    expect(outputPaths(setOutputMock, 'only_changed')).toBe(true)
  })

  it('reports every file when the filter matches nothing', async () => {
    const allDiffFiles = changedFiles({
      [ChangeTypeEnum.Added]: ['src/a.ts', 'src/b.ts']
    })

    await setOutputsAndGetModifiedAndChangedFilesStatus({
      allDiffFiles,
      allFilteredDiffFiles: emptyChangedFiles,
      inputs: baseInputs,
      filePatterns: ['nothing/**']
    })

    expect(outputPaths(setOutputMock, 'other_changed_files')).toEqual([
      'src/a.ts',
      'src/b.ts'
    ])
  })

  it('lists a path once when several change types report it', async () => {
    const allDiffFiles = changedFiles({
      [ChangeTypeEnum.Added]: ['docs/b.md'],
      [ChangeTypeEnum.Modified]: ['docs/b.md'],
      [ChangeTypeEnum.Copied]: ['src/a.ts']
    })
    const allFilteredDiffFiles = changedFiles({
      [ChangeTypeEnum.Copied]: ['src/a.ts']
    })

    await setOutputsAndGetModifiedAndChangedFilesStatus({
      allDiffFiles,
      allFilteredDiffFiles,
      inputs: baseInputs,
      filePatterns: ['src/**']
    })

    expect(outputPaths(setOutputMock, 'other_changed_files')).toEqual([
      'docs/b.md'
    ])
  })

  it('treats renamed paths like any other changed path', async () => {
    const allDiffFiles = changedFiles({
      [ChangeTypeEnum.Renamed]: ['src/new.ts', 'docs/new.md']
    })
    const allFilteredDiffFiles = changedFiles({
      [ChangeTypeEnum.Renamed]: ['src/new.ts']
    })

    await setOutputsAndGetModifiedAndChangedFilesStatus({
      allDiffFiles,
      allFilteredDiffFiles,
      inputs: baseInputs,
      filePatterns: ['src/**']
    })

    expect(outputPaths(setOutputMock, 'other_changed_files')).toEqual([
      'docs/new.md'
    ])
  })

  it('reports the modified and deleted files the filter left out', async () => {
    const allDiffFiles = changedFiles({
      [ChangeTypeEnum.Modified]: ['src/c.ts', 'docs/d.md'],
      [ChangeTypeEnum.Deleted]: ['src/gone.ts', 'docs/gone.md']
    })
    const allFilteredDiffFiles = changedFiles({
      [ChangeTypeEnum.Modified]: ['src/c.ts'],
      [ChangeTypeEnum.Deleted]: ['src/gone.ts']
    })

    await setOutputsAndGetModifiedAndChangedFilesStatus({
      allDiffFiles,
      allFilteredDiffFiles,
      inputs: baseInputs,
      filePatterns: ['src/**']
    })

    expect(outputPaths(setOutputMock, 'other_modified_files')).toEqual([
      'docs/d.md',
      'docs/gone.md'
    ])
    expect(outputPaths(setOutputMock, 'other_deleted_files')).toEqual([
      'docs/gone.md'
    ])
  })
})
