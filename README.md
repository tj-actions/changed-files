[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge\&logo=ubuntu\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Mac OS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge\&logo=macos\&logoColor=F0F0F0)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge\&logo=windows\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Public workflows that use this action.](https://img.shields.io/endpoint?style=for-the-badge\&url=https%3A%2F%2Fused-by.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue)](https://github.com/search?o=desc\&q=tj-actions+changed-files+language%3AYAML\&s=\&type=Code)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4a625e9b62794b5b98e169c15c0e673c)](https://www.codacy.com/gh/tj-actions/changed-files/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=tj-actions/changed-files\&utm_campaign=Badge_Grade)
[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml)
[![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-20-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

## changed-files

Effortlessly track all changed files and directories relative to a target branch, preceding commit or the last remote commit returning **relative paths** from the project root using this GitHub action.

## Table of contents

*   [Features](#features)
*   [Usage](#usage)
    *   [On `pull_request`](#on-pull_request)
        *   [Using local .git history](#using-local-git-history)
        *   [Using Github's API](#using-githubs-api)
    *   [On `push`](#on-push)
*   [Useful Acronyms](#useful-acronyms)
*   [Outputs](#outputs)
*   [Inputs](#inputs)
*   [Versioning](#versioning)
*   [Examples](#examples)
*   [Real-world usage](#real-world-usage)
*   [Known Limitation](#known-limitation)
*   [Migration guide](#migration-guide)
*   [Credits](#credits)
*   [Report Bugs](#report-bugs)
*   [Contributors ✨](#contributors-)

## Features

*   Fast execution, averaging 0-10 seconds.
*   Leverages either [Github's REST API](https://docs.github.com/en/rest/reference/repos#list-commits) or [Git's native diff](https://git-scm.com/docs/git-diff) to determine changed files.
*   Facilitates easy debugging.
*   Scales to handle large repositories.
*   Supports Git submodules.
*   Supports [merge queues](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue) for pull reequests.
*   Generates escaped JSON output for running matrix jobs based on changed files.
*   Lists changed directories.
    *   Limits matching changed directories to a specified maximum depth.
    *   Optionally excludes the current directory.
*   Writes outputs to a designated `.txt` or `.json` file for further processing.
*   Restores deleted files to their previous location or a newly specified location.
*   Supports Monorepos by fetching a fixed number of commits.
*   Compatible with all platforms (Linux, MacOS, Windows).
*   Supports [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners).
*   Supports [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@3.3/admin/github-actions/getting-started-with-github-actions-for-your-enterprise/getting-started-with-github-actions-for-github-enterprise-server).
*   Supports [self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners).
*   Lists all files and directories that have changed:
    *   Between the current pull request branch and the last commit on the target branch.
    *   Between the last commit and the current pushed change.
    *   Between the last remote branch commit and the current HEAD.
*   Restricts change detection to a subset of files and directories:
    *   Provides boolean output indicating changes in specific files.
    *   Uses [Glob pattern](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet) matching.
        *   Supports Globstar.
        *   Supports brace expansion.
        *   Supports negation.
    *   Uses [YAML](https://yaml.org/) syntax for specifying patterns.
        *   Supports [YAML anchors & aliases](https://www.educative.io/blog/advanced-yaml-syntax-cheatsheet#anchors).
        *   Supports [YAML multi-line strings](https://learnxinyminutes.com/docs/yaml/).

And many more.

## Usage

> **Warning**:
>
> *   For `push` events: \*\*When configuring [`actions/checkout`](https://github.com/actions/checkout#usage), make sure to set [`fetch-depth`](https://github.com/actions/checkout#usage) to either `0` or `2`, depending on your use case.
> *   For mono repositories where pulling all the branch history might not be desired, you can still use the default [`fetch-depth`](https://github.com/actions/checkout#usage), which is set to `1` for `pull_request` events.
> *   Avoid using single or double quotes for multiline inputs, as the value is already a string separated by a newline character. See [Examples](#examples) for more information.
> *   If [`fetch-depth`](https://github.com/actions/checkout#usage) isn't set to `0`, ensure that `persist-credentials` is set to `true` when configuring [`actions/checkout`](https://github.com/actions/checkout#usage).
> *   For repositories that have PRs generated from forks, when configuring [`actions/checkout`](https://github.com/actions/checkout#usage), set the [`repository`](https://github.com/actions/checkout#usage) to `${{ github.event.pull_request.head.repo.full_name }}`. See [Example](https://github.com/tj-actions/changed-files/blob/main/.github/workflows/test.yml#L47-L51).

Visit the [discussions for more information](https://github.com/tj-actions/changed-files/discussions) or [create a new discussion](https://github.com/tj-actions/changed-files/discussions/new/choose) for usage-related questions.

### On `pull_request`

#### Using local .git history

```yaml
name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  # ------------------------------------------------------------------------------------------------------------------------------------------------
  # Event `pull_request`: Compare the last commit of the main branch or last remote commit of the PR branch -> to the current commit of a PR branch.
  # ------------------------------------------------------------------------------------------------------------------------------------------------
  changed_files:
    runs-on: ubuntu-latest  # windows-latest || macos-latest
    name: Test changed-files
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # OR "2" -> To retrieve the preceding commit.

      # Example 1
      - name: Get all test, doc and src files that have changed
        id: changed-files-yaml
        uses: tj-actions/changed-files@v37
        with:
          files_yaml: |
            doc:
              - '**.md'
              - docs/**
              - docs/README.md
            test:
              - test/**
              - '!test/**.md'
            src:
              - src/**
          # Optionally set `files_yaml_from_source_file` to read the YAML from a file. e.g `files_yaml_from_source_file: .github/changed-files.yml`

      - name: Run step if test file(s) change
        # NOTE: The key has to start with the same key used above e.g. `test_(...)` | `doc_(...)` | `src_(...)` when trying to access the `any_changed` output.
        if: steps.changed-files-yaml.outputs.test_any_changed == 'true'  
        run: |
          echo "One or more test file(s) has changed."
          echo "List all the files that have changed: ${{ steps.changed-files-yaml.outputs.test_all_changed_files }}"
      
      - name: Run step if doc file(s) change
        if: steps.changed-files-yaml.outputs.doc_any_changed == 'true'
        run: |
          echo "One or more doc file(s) has changed."
          echo "List all the files that have changed: ${{ steps.changed-files-yaml.outputs.doc_all_changed_files }}"

      # Example 2
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v37
        
        # To compare changes between the current commit and the last pushed remote commit set `since_last_remote_commit: true`. e.g
        # with:
        #   since_last_remote_commit: true 

      - name: List all changed files
        run: |
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            echo "$file was changed"
          done

      # Example 3
      - name: Get changed files in the docs folder
        id: changed-files-specific
        uses: tj-actions/changed-files@v37
        with:
          files: docs/*.{js,html}  # Alternatively using: `docs/**` or `docs`
          files_ignore: docs/static.js

      - name: Run step if any file(s) in the docs folder change
        if: steps.changed-files-specific.outputs.any_changed == 'true'
        run: |
          echo "One or more files in the docs folder has changed."
          echo "List all the files that have changed: ${{ steps.changed-files-specific.outputs.all_changed_files }}"
```

#### Using Github's API

```yaml
name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  # -------------------------------------------------------------
  # Event `pull_request`: Returns all changed pull request files.
  # --------------------------------------------------------------
  changed_files:
    # NOTE:
    # - This is limited to pull_request* events and would raise an error for other events.
    # - A maximum of 3000 files can be returned.
    # - For more flexibility and no limitations see "Using local .git history" above.

    runs-on: ubuntu-latest  # windows-latest || macos-latest
    name: Test changed-files
    permissions:
      pull-requests: read

    steps:
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v37

      - name: List all changed files
        run: |
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            echo "$file was changed"
          done
```

### On `push`

```yaml
name: CI

on:
  push:
    branches:
      - main

# -------------------------------
#  Optionally run on other events
# -------------------------------
#  schedule:
#     - cron: '0 0 * * *'
#
#  release:
#    types: [...]
#
#  workflow_dispatch:
#
#  push:
#    tags:
#      - '**'
#
# ...and many more


jobs:
  # -------------------------------------------------------------
  # Using GitHub's API is not supported for push events
  # -------------------------------------------------------------
  # 
  # ----------------------------------------------------------------------------------------------
  # Using local .git history
  # ----------------------------------------------------------------------------------------------
  # Event `push`: Compare the preceding remote commit -> to the current commit of the main branch 
  # ----------------------------------------------------------------------------------------------
  changed_files:
    runs-on: ubuntu-latest  # windows-latest || macos-latest
    name: Test changed-files
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # OR "2" -> To retrieve the preceding commit.

      # Example 1
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v37

      # NOTE: `since_last_remote_commit: true` is implied by default and falls back to the previous local commit.

      - name: List all changed files
        run: |
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            echo "$file was changed"
          done

      # Example 2: See above
      ...

      # Example 3: See above
      ...
```

To access more examples, navigate to the [Examples](#examples) section.

If you feel generous and want to show some extra appreciation:

Support this project with a :star:

[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

[buymeacoffee]: https://www.buymeacoffee.com/jackton1

[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png

## Useful Acronyms

|  Acronym  |   Meaning    |
|:---------:|:------------:|
|     A     |    Added     |
|     C     |    Copied    |
|     M     |   Modified   |
|     D     |   Deleted    |
|     R     |   Renamed    |
|     T     | Type changed |
|     U     |   Unmerged   |
|     X     |   Unknown    |

> **Warning**:
>
> *   When using `files_yaml*` ensure all ouputs are prefixed by the key. e.g. `test_added_files`, `test_any_changed`

## Outputs

<!-- AUTO-DOC-OUTPUT:START - Do not remove or modify this section -->

|                OUTPUT                |  TYPE  |                                                                                                                                                       DESCRIPTION                                                                                                                                                       |
|--------------------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|             added\_files              | string |                                                                                                                                       Returns only files that are <br>Added (A).                                                                                                                                        |
|          added\_files\_count           | string |                                                                                                                                           Returns the number of `added_files`                                                                                                                                           |
|    all\_changed\_and\_modified\_files    | string |                                                                                                                     Returns all changed and modified <br>files i.e. *a combination of (ACMRDTUX)*                                                                                                                       |
| all\_changed\_and\_modified\_files\_count | string |                                                                                                                                 Returns the number of `all_changed_and_modified_files`                                                                                                                                  |
|          all\_changed\_files           | string |                                                                                                       Returns all changed files i.e. <br>*a combination of all added, copied, modified and renamed files (ACMR)*                                                                                                        |
|       all\_changed\_files\_count        | string |                                                                                                                                        Returns the number of `all_changed_files`                                                                                                                                        |
|          all\_modified\_files          | string |                                                                                                 Returns all changed files i.e. <br>*a combination of all added, copied, modified, renamed and deleted files (ACMRD)*.                                                                                                   |
|       all\_modified\_files\_count       | string |                                                                                                                                       Returns the number of `all_modified_files`                                                                                                                                        |
|      all\_old\_new\_renamed\_files       | string | Returns only files that are <br>Renamed and lists their old <br>and new names. **NOTE:** This <br>requires setting `include_all_old_new_renamed_files` to `true`. <br>Also, keep in mind that <br>this output is global and <br>wouldn't be nested in outputs <br>generated when the `*_yaml_*` input <br>is used. (R)  |
|   all\_old\_new\_renamed\_files\_count    | string |                                                                                                                                    Returns the number of `all_old_new_renamed_files`                                                                                                                                    |
|             any\_changed              | string |                                                      Returns `true` when any of <br>the filenames provided using the <br>`files*` or `files_ignore*` inputs has changed. i.e. <br>*using a combination of all added, copied, modified and renamed files (ACMR)*.                                                        |
|             any\_deleted              | string |                                                                                            Returns `true` when any of <br>the filenames provided using the <br>`files*` or `files_ignore*` inputs has been deleted. <br>(D)                                                                                             |
|             any\_modified             | string |                                              Returns `true` when any of <br>the filenames provided using the <br>`files*` or `files_ignore*` inputs has been modified. <br>i.e. *using a combination of all added, copied, modified, renamed, and deleted files (ACMRD)*.                                               |
|             copied\_files             | string |                                                                                                                                      Returns only files that are <br>Copied (C).                                                                                                                                        |
|          copied\_files\_count          | string |                                                                                                                                          Returns the number of `copied_files`                                                                                                                                           |
|            deleted\_files             | string |                                                                                                                                      Returns only files that are <br>Deleted (D).                                                                                                                                       |
|         deleted\_files\_count          | string |                                                                                                                                          Returns the number of `deleted_files`                                                                                                                                          |
|            modified\_files            | string |                                                                                                                                     Returns only files that are <br>Modified (M).                                                                                                                                       |
|         modified\_files\_count         | string |                                                                                                                                         Returns the number of `modified_files`                                                                                                                                          |
|             only\_changed             | string |                                                             Returns `true` when only files <br>provided using the `files*` or `files_ignore*` inputs <br>has changed. i.e. *using a combination of all added, copied, modified and renamed files (ACMR)*.                                                               |
|             only\_deleted             | string |                                                                                                   Returns `true` when only files <br>provided using the `files*` or `files_ignore*` inputs <br>has been deleted. (D)                                                                                                    |
|            only\_modified             | string |                                                                                                Returns `true` when only files <br>provided using the `files*` or `files_ignore*` inputs <br>has been modified. (ACMRD).                                                                                                 |
|         other\_changed\_files          | string |                                                                               Returns all other changed files <br>not listed in the files <br>input i.e. *using a combination of all added, copied, modified and renamed files (ACMR)*.                                                                                 |
|      other\_changed\_files\_count       | string |                                                                                                                                       Returns the number of `other_changed_files`                                                                                                                                       |
|         other\_deleted\_files          | string |                                                                                                  Returns all other deleted files <br>not listed in the files <br>input i.e. *a  combination of all deleted files (D)*                                                                                                   |
|      other\_deleted\_files\_count       | string |                                                                                                                                       Returns the number of `other_deleted_files`                                                                                                                                       |
|         other\_modified\_files         | string |                                                                                 Returns all other modified files <br>not listed in the files <br>input i.e. *a  combination of all added, copied, modified, and deleted files (ACMRD)*                                                                                  |
|      other\_modified\_files\_count      | string |                                                                                                                                      Returns the number of `other_modified_files`                                                                                                                                       |
|            renamed\_files             | string |                                                                                                                                      Returns only files that are <br>Renamed (R).                                                                                                                                       |
|         renamed\_files\_count          | string |                                                                                                                                          Returns the number of `renamed_files`                                                                                                                                          |
|          type\_changed\_files          | string |                                                                                                                             Returns only files that have <br>their file type changed (T).                                                                                                                               |
|       type\_changed\_files\_count       | string |                                                                                                                                       Returns the number of `type_changed_files`                                                                                                                                        |
|            unknown\_files             | string |                                                                                                                                      Returns only files that are <br>Unknown (X).                                                                                                                                       |
|         unknown\_files\_count          | string |                                                                                                                                          Returns the number of `unknown_files`                                                                                                                                          |
|            unmerged\_files            | string |                                                                                                                                     Returns only files that are <br>Unmerged (U).                                                                                                                                       |
|         unmerged\_files\_count         | string |                                                                                                                                         Returns the number of `unmerged_files`                                                                                                                                          |

<!-- AUTO-DOC-OUTPUT:END -->

## Inputs

<!-- AUTO-DOC-INPUT:START - Do not remove or modify this section -->

|                    INPUT                     |  TYPE  | REQUIRED |          DEFAULT          |                                                                                                                                 DESCRIPTION                                                                                                                                  |
|----------------------------------------------|--------|----------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|                   api\_url                    | string |  false   | `"${{ github.api_url }}"` |                                                                                                                               Github API URL.                                                                                                                                |
|                   base\_sha                   | string |  false   |                           |                                                                                                     Specify a different base commit <br>SHA used for comparing changes                                                                                                       |
|                diff\_relative                 | string |  false   |         `"true"`          |                                         Exclude changes outside the current <br>directory and show path names <br>relative to it. **NOTE:** This <br>requires you to specify the <br>top level directory via the <br>`path` input.                                           |
|                  dir\_names                   | string |  false   |         `"false"`         |                                    Output unique changed directories instead <br>of filenames. **NOTE:** This returns <br>`.` for changed files located <br>in the current working directory <br>which defaults to `$GITHUB_WORKSPACE`.                                      |
|        dir\_names\_exclude\_current\_dir         | string |  false   |         `"false"`         |                                                                               Exclude the current directory represented <br>by `.` from the output <br>when `dir_names` is set to <br>`true`.                                                                                |
|             dir\_names\_max\_depth              | string |  false   |                           |                                                                        Limit the directory output to <br>a maximum depth e.g `test/test1/test2` <br>with max depth of `2` <br>returns `test/test1`.                                                                          |
|                 escape\_json                  | string |  false   |         `"true"`          |                                                                                                                             Escape JSON output.                                                                                                                              |
|                 fetch\_depth                  | string |  false   |          `"50"`           |                                                                     Depth of additional branch history <br>fetched. **NOTE**: This can be <br>adjusted to resolve errors with <br>insufficient history.                                                                      |
|                    files                     | string |  false   |                           |                                                File and directory patterns used <br>to detect changes (Defaults to the entire repo if unset) **NOTE:** <br>Multiline file/directory patterns should not <br>include quotes.                                                  |
|            files\_from\_source\_file            | string |  false   |                           |                                                                                                           Source file(s) used to populate <br>the `files` input.                                                                                                             |
|       files\_from\_source\_file\_separator       | string |  false   |          `"\n"`           |                                                                                                       Separator used to split the <br>`files_from_source_file` input                                                                                                         |
|                 files\_ignore                 | string |  false   |                           |                                                                               Ignore changes to these file(s) <br>**NOTE:** Multiline file/directory patterns should <br>not include quotes.                                                                                 |
|        files\_ignore\_from\_source\_file         | string |  false   |                           |                                                                                                        Source file(s) used to populate <br>the `files_ignore` input                                                                                                          |
|   files\_ignore\_from\_source\_file\_separator    | string |  false   |          `"\n"`           |                                                                                                    Separator used to split the <br>`files_ignore_from_source_file` input                                                                                                     |
|            files\_ignore\_separator            | string |  false   |          `"\n"`           |                                                                                                            Separator used to split the <br>`files_ignore` input                                                                                                              |
|              files\_ignore\_yaml               | string |  false   |                           |                                                                                                    YAML used to define a <br>set of file patterns to <br>ignore changes                                                                                                      |
|      files\_ignore\_yaml\_from\_source\_file      | string |  false   |                           |                                                         Source file(s) used to populate <br>the `files_ignore_yaml` input. [Example](https://github.com/tj-actions/changed-files/blob/main/test/changed-files.yml)                                                           |
| files\_ignore\_yaml\_from\_source\_file\_separator | string |  false   |          `"\n"`           |                                                                                                 Separator used to split the <br>`files_ignore_yaml_from_source_file` input                                                                                                   |
|               files\_separator                | string |  false   |          `"\n"`           |                                                                                                                Separator used to split the <br>`files` input                                                                                                                 |
|                  files\_yaml                  | string |  false   |                           |                                                                                                    YAML used to define a <br>set of file patterns to <br>detect changes                                                                                                      |
|         files\_yaml\_from\_source\_file          | string |  false   |                           |                                                             Source file(s) used to populate <br>the `files_yaml` input. [Example](https://github.com/tj-actions/changed-files/blob/main/test/changed-files.yml)                                                              |
|    files\_yaml\_from\_source\_file\_separator     | string |  false   |          `"\n"`           |                                                                                                     Separator used to split the <br>`files_yaml_from_source_file` input                                                                                                      |
|      include\_all\_old\_new\_renamed\_files       | string |  false   |         `"false"`         |                                                       Include `all_old_new_renamed_files` output. Note this <br>can generate a large output <br>See: [#501](https://github.com/tj-actions/changed-files/issues/501).                                                         |
|                     json                     | string |  false   |         `"false"`         |                                                                                   Output list of changed files <br>in a JSON formatted string <br>which can be used for <br>matrix jobs.                                                                                     |
|           old\_new\_files\_separator            | string |  false   |           `" "`           |                                                                                                         Split character for old and <br>new renamed filename pairs.                                                                                                          |
|              old\_new\_separator               | string |  false   |           `","`           |                                                                                                             Split character for old and <br>new filename pairs.                                                                                                              |
|                  output\_dir                  | string |  false   |    `".github/outputs"`    |                                                                                                                       Directory to store output files.                                                                                                                       |
|  output\_renamed\_files\_as\_deleted\_and\_added   | string |  false   |         `"false"`         |                                                                                                            Output renamed files as deleted <br>and added files.                                                                                                              |
|                     path                     | string |  false   |           `"."`           |                                                                                               Specify a relative path under <br>`$GITHUB_WORKSPACE` to locate the repository.                                                                                                |
|                  quotepath                   | string |  false   |         `"true"`          |                                                                         Use non-ascii characters to match <br>files and output the filenames <br>completely verbatim by setting this <br>to `false`                                                                          |
|            recover\_deleted\_files             | string |  false   |         `"false"`         |                                                                                                                            Recover deleted files.                                                                                                                            |
|     recover\_deleted\_files\_to\_destination     | string |  false   |                           |                                                                                      Recover deleted files to a <br>new destination directory, defaults to <br>the original location.                                                                                        |
|                recover\_files                 | string |  false   |                           | File and directory patterns used <br>to recover deleted files, defaults <br>to the patterns provided via <br>the `files`, `files_from_source_file`, `files_ignore` and <br>`files_ignore_from_source_file` inputs or all deleted <br>files if no patterns are <br>provided.  |
|             recover\_files\_ignore             | string |  false   |                           |                                                                                                  File and directory patterns to <br>ignore when recovering deleted files.                                                                                                    |
|        recover\_files\_ignore\_separator        | string |  false   |          `"\n"`           |                                                                                                        Separator used to split the <br>`recover_files_ignore` input                                                                                                          |
|           recover\_files\_separator            | string |  false   |          `"\n"`           |                                                                                                            Separator used to split the <br>`recover_files` input                                                                                                             |
|                  separator                   | string |  false   |           `" "`           |                                                                                                                      Split character for output strings                                                                                                                      |
|                     sha                      | string |  false   |                           |                                                                                                        Specify a different commit SHA <br>used for comparing changes                                                                                                         |
|                    since                     | string |  false   |                           |                                                                                             Get changed files for commits <br>whose timestamp is older than <br>the given time.                                                                                              |
|           since\_last\_remote\_commit           | string |  false   |         `"false"`         |              Use the last commit on <br>the remote branch as the <br>`base_sha`. Defaults to the last <br>non-merge commit on the target <br>branch for pull request events <br>and the previous remote commit <br>of the current branch for <br>push events.                |
|              skip\_initial\_fetch              | string |  false   |         `"false"`         |       Skip the initial fetch to <br>improve performance for shallow repositories. <br>**NOTE**: This could lead to <br>errors with missing history and <br>the intended use is limited <br>to when you've fetched the <br>history necessary to perform the <br>diff.         |
|                    token                     | string |  false   |  `"${{ github.token }}"`  |                                                                                                       Github token used to fetch <br>changed files from Github's API.                                                                                                        |
|                    until                     | string |  false   |                           |                                                                                            Get changed files for commits <br>whose timestamp is earlier than <br>the given time.                                                                                             |
|              write\_output\_files              | string |  false   |         `"false"`         |                                         Write outputs to the `output_dir` <br>defaults to `.github/outputs` folder. **NOTE:** <br>This creates a `.txt` file <br>by default and a `.json` <br>file if `json` is set <br>to `true`.                                           |

<!-- AUTO-DOC-INPUT:END -->

## Versioning

This GitHub Action follows the principles of [Semantic Versioning](https://semver.org) for versioning releases.

The format of the version string is as follows:

*   major: indicates significant changes or new features that may not be backward compatible.

*   minor: indicates minor changes or new features that are backward compatible.

*   patch: indicates bug fixes or other small changes that are backward compatible.

## Examples

<details>
<summary>Get all changed files in the current branch</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v37
...
```

</details>

<details>
<summary>Get all changed files and use a comma separator</summary>

```yaml
...
    - name: Get all changed files and use a comma separator in the output
      id: changed-files
      uses: tj-actions/changed-files@v37
      with:
        separator: ","
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary> Get all changed files and list all added files</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v37

    - name: List all added files
      run: |
        for file in ${{ steps.changed-files.outputs.added_files }}; do
          echo "$file was added"
        done
...
```

See [outputs](#outputs) for a list of all available outputs.

</details>

<details>
<summary>Get all changed files and optionally run a step if a file was modified</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v37

    - name: Run a step if my-file.txt was modified
      if: contains(steps.changed-files.outputs.modified_files, 'my-file.txt')
      run: |
        echo "my-file.txt file has been modified."
...
```

See [outputs](#outputs) for a list of all available outputs.

</details>

<details>
<summary>Get all changed files and write the outputs to a txt file</summary>

```yaml
...

   - name: Get changed files and write the outputs to a Txt file
     id: changed-files-write-output-files-txt
     uses: ./
     with:
       write_output_files: true

   - name: Verify the contents of the .github/outputs/added_files.txt file
     run: |
       cat .github/outputs/added_files.txt
...
```

</details>

<details>
<summary>Get all changed files and write the outputs to a json file</summary>

```yaml
...
   - name: Get changed files and write the outputs to a JSON file
     id: changed-files-write-output-files-json
     uses: ./
     with:
       json: true
       write_output_files: true

   - name: Verify the contents of the .github/outputs/added_files.json file
     run: |
       cat .github/outputs/added_files.json
...
```

</details>

<details>
<summary>Get all changed files using a list of files</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v37
      with:
        files: |
          my-file.txt
          *.sh
          *.png
          !*.md
          test_directory
          **.sql
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files using a list of files and take action based on the changes</summary>

```yaml
...
    - name: Get changed files
      id: changed-files-specific
      uses: tj-actions/changed-files@v37
      with:
        files: |
          my-file.txt
          *.sh
          *.png
          !*.md
          test_directory
          **.sql

    - name: Run step if any of the listed files above change
      if: steps.changed-files-specific.outputs.any_changed == 'true'
      run: |
        echo "One or more files listed above has changed."

    - name: Run step if only the files listed above change
      if: steps.changed-files-specific.outputs.only_changed == 'true'
      run: |
        echo "Only files listed above have changed."

    - name: Run step if any of the listed files above is deleted
      if: steps.changed-files-specific.outputs.any_deleted == 'true'
      run: |
        for file in ${{ steps.changed-files-specific.outputs.deleted_files }}; do
          echo "$file was deleted"
        done

    - name: Run step if all listed files above have been deleted
      if: steps.changed-files-specific.outputs.only_deleted == 'true'
      run: |
        for file in ${{ steps.changed-files-specific.outputs.deleted_files }}; do
          echo "$file was deleted"
        done
...
```

See [outputs](#outputs) for a list of all available outputs.

</details>

<details>
<summary>Get all changed files using a source file or list of file(s) to populate to files input</summary>

```yaml
...
    - name: Get changed files using a source file or list of file(s) to populate to files input.
      id: changed-files-specific-source-file
      uses: tj-actions/changed-files@v37
      with:
        files_from_source_file: test/changed-files-list.txt
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get changed files using a source file or list of file(s) to populate to files input and optionally specify more files</summary>

```yaml
...
    - name: Get changed files using a source file or list of file(s) to populate to files input and optionally specify more files.
      id: changed-files-specific-source-file-and-specify-files
      uses: tj-actions/changed-files@v37
      with:
        files_from_source_file: |
          test/changed-files-list.txt
        files: |
          test.txt
...
```

See [inputs](#inputs) for more information.

</details>

<details>

<summary>Get all changed files using a different SHA</summary>

```yaml
...
    - name: Get changed files using a different SHA
      id: changed-files
      uses: tj-actions/changed-files@v37
      with:
        sha: ${{ github.event.pull_request.head.sha }}
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files using a different base SHA</summary>

```yaml
...
    - name: Get changed files using a different base SHA
      id: changed-files
      uses: tj-actions/changed-files@v37
      with:
        base_sha: ${{ github.event.pull_request.base.sha }}
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files between the previous tag and the current tag</summary>

```yaml
...
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v37

      - name: Get changed files in the .github folder
        id: changed-files-specific
        uses: tj-actions/changed-files@v37
        with:
          base_sha: ${{ steps.get-base-sha.outputs.base_sha }}
          files: .github/**

      - name: Run step if any file(s) in the .github folder change
        if: steps.changed-files-specific.outputs.any_changed == 'true'
        run: |
          echo "One or more files in the .github folder has changed."
          echo "List all the files that have changed: ${{ steps.changed-files-specific.outputs.all_changed_files }}"
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files for a repository located in a different path</summary>

```yaml
...
    - name: Checkout into dir1
      uses: actions/checkout@v3
      with:
        fetch-depth: 0
        path: dir1

    - name: Run changed-files with defaults in dir1
      id: changed-files-for-dir1
      uses: tj-actions/changed-files@v37
      with:
        path: dir1

    - name: List all added files in dir1
      run: |
        for file in ${{ steps.changed-files-for-dir1.outputs.added_files }}; do
          echo "$file was added"
        done
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files with non-äšćįí characters i.e (Filename in other languages)</summary>

```yaml
...
    - name: Run changed-files with quotepath disabled
      id: changed-files-quotepath
      uses: tj-actions/changed-files@v37
      with:
        quotepath: "false"

    - name: Run changed-files with quotepath disabled for a specified list of file(s)
      id: changed-files-quotepath-specific
      uses: ./
      with:
        files: test/test-è.txt
        quotepath: "false"
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files using the last successful commit of the base branch</summary>

<ul>
    <li>
        <details>
        <summary>Push event</summary>

```yaml
...
      - name: Get branch name
        id: branch-name
        uses: tj-actions/branch-names@v6

      - uses: nrwl/nx-set-shas@v3
        id: last_successful_commit_push
        with:
          main-branch-name: ${{ steps.branch-name.outputs.current_branch }} # Get the last successful commit for the current branch.
          workflow-id: 'test.yml'

      - name: Run changed-files with the commit of the last successful test workflow run
        id: changed-files-base-sha-push
        uses: tj-actions/changed-files@v37
        with:
          base_sha: ${{ steps.last_successful_commit_push.outputs.base }}
...
```

</details>
</li>

<li>
<details>
<summary>Pull request events </summary>

```yaml
...
      - name: Get branch name
        id: branch-name
        uses: tj-actions/branch-names@v5

      - uses: nrwl/nx-set-shas@v3
        id: last_successful_commit_pull_request
        with:
          main-branch-name: ${{ steps.branch-name.outputs.base_ref_branch }} # Get the last successful commit on the master or main branch
          workflow_id: 'test.yml'

      - name: Run changed-files with the commit of the last successful test workflow run on the main branch
        id: changed-files-base-sha-pull-request
        uses: tj-actions/changed-files@v37
        with:
          base_sha: ${{ steps.last_successful_commit_pull_request.outputs.base }}
...
```

</details>
</li>
</ul>

> **Warning**: This setting overrides the commit sha used by setting `since_last_remote_commit` to true.
> It is recommended to use either solution that works for your use case.

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files but only return the directory names</summary>

```yaml
...
    - name: Run changed-files with dir_names
      id: changed-files-dir-names
      uses: tj-actions/changed-files@v37
      with:
        dir_names: "true"
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files and return JSON formatted outputs</summary>

```yaml
...
    - name: Run changed-files with JSON output
      id: changed-files-json
      uses: tj-actions/changed-files@v37
      with:
        json: "true"
...
```

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files by commits pushed in the past</summary>

```yaml
...
    - name: Get changed-files since 2022-08-19
      id: changed-files-since
      uses: tj-actions/changed-files@v37
      with:
        since: "2022-08-19"

    - name: Get changed-files until 2022-08-20
      id: changed-files-until
      uses: tj-actions/changed-files@v37
      with:
        until: "2022-08-20"
...
```

See [inputs](#inputs) for more information.

</details>

## Real-world usage

*   [vitejs/vite: uses tj-actions/changed-files to automate testing](https://github.com/vitejs/vite/blob/8da04227d6f818a8ad9efc0056101968037c2e36/.github/workflows/ci.yml#L61)

*   [qgis/QGIS: uses tj-actions/changed-files to automate spell checking](https://github.com/qgis/QGIS/blob/a5333497e90ac9de4ca70463d8e0b64c3f294d63/.github/workflows/code_layout.yml#L147)

*   [coder/code-server: uses tj-actions/changed-files to automate detecting changes and run steps based on the outcome](https://github.com/coder/code-server/blob/c32a31d802f679846876b8ad9aacff6cf7b5361d/.github/workflows/build.yaml#L48)

*   [tldr-pages/tldr: uses tj-actions/changed-files to automate detecting spelling errors](https://github.com/tldr-pages/tldr/blob/main/.github/workflows/codespell.yml#L14)

*   [nodejs/docker-node: uses tj-actions/changed-files to generate matrix jobs based on changes detected](https://github.com/nodejs/docker-node/blob/3c4fa6daf06a4786d202f2f610351837806a0380/.github/workflows/build-test.yml#L29)

*   [refined-github: uses tj-actions/changed-files to automate test URL validation in added/edited files](https://github.com/refined-github/refined-github/blob/b754bfe58904da8a599d7876fdaaf18302785629/.github/workflows/features.yml#L35)

*   [aws-doc-sdk-examples: uses tj-actions/changed-files to automate testing](https://github.com/awsdocs/aws-doc-sdk-examples/blob/2393723ef6b0cad9502f4852f5c72f7be58ca89d/.github/workflows/javascript.yml#L22)

*   [nhost: uses tj-actions/changed-files to automate testing based on changes detected](https://github.com/nhost/nhost/blob/main/.github/workflows/ci.yaml#L44-L48)

![image](https://github.com/tj-actions/changed-files/assets/17484350/23767413-4c51-42fb-ab1c-39ef72c44904)

And many more...

## Known Limitation

> **Warning**:
>
> *   Spaces in file names can introduce bugs when using bash loops. See: [#216](https://github.com/tj-actions/changed-files/issues/216)
>     However, this action will handle spaces in file names, with a recommendation of using a separator to prevent any hidden issues.
>
>     ![Screen Shot 2021-10-23 at 9 37 34 AM](https://user-images.githubusercontent.com/17484350/138558767-b13c90bf-a1ae-4e86-9520-70a6a4624f41.png)

## Migration guide

With the switch from using grep's Extended regex to match files to the natively supported workflow glob pattern matching syntax introduced in [v13](https://github.com/tj-actions/changed-files/releases/tag/v13) you'll need to modify patterns used to match `files`.

```diff
...
      - name: Get specific changed files
        id: changed-files-specific
        uses: tj-actions/changed-files@v24
        with:
          files: |
-            \.sh$
-            .(sql|py)$
-            ^(dir1|dir2)
+            *.{sh,sql,py}
+            dir1
+            dir2
```

*   Free software: [MIT license](LICENSE)

## Credits

This package was created with [cookiecutter-action](https://github.com/tj-actions/cookiecutter-action).

*   [tj-actions/auto-doc](https://github.com/tj-actions/auto-doc)
*   [tj-actions/verify-changed-files](https://github.com/tj-actions/verify-changed-files)
*   [tj-actions/demo](https://github.com/tj-actions/demo)
*   [tj-actions/demo2](https://github.com/tj-actions/demo2)
*   [tj-actions/demo3](https://github.com/tj-actions/demo3)
*   [tj-actions/release-tagger](https://github.com/tj-actions/release-tagger)

## Report Bugs

Report bugs at https://github.com/tj-actions/changed-files/issues.

If you are reporting a bug, please include:

*   Your operating system name and version.
*   Any details about your workflow that might be helpful in troubleshooting. (**NOTE**: Ensure that you include full log outputs with debugging enabled)
*   Detailed steps to reproduce the bug.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore-start -->

<!-- markdownlint-disable -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jsoref"><img src="https://avatars.githubusercontent.com/u/2119212?v=4?s=100" width="100px;" alt="Josh Soref"/><br /><sub><b>Josh Soref</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=jsoref" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/monoxgas"><img src="https://avatars.githubusercontent.com/u/1223016?v=4?s=100" width="100px;" alt="Nick Landers"/><br /><sub><b>Nick Landers</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=monoxgas" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Kras4ooo"><img src="https://avatars.githubusercontent.com/u/1948054?v=4?s=100" width="100px;" alt="Krasimir Nikolov"/><br /><sub><b>Krasimir Nikolov</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=Kras4ooo" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=Kras4ooo" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/IvanPizhenko"><img src="https://avatars.githubusercontent.com/u/11859904?v=4?s=100" width="100px;" alt="Ivan Pizhenko"/><br /><sub><b>Ivan Pizhenko</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=IvanPizhenko" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=IvanPizhenko" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/talva-tr"><img src="https://avatars.githubusercontent.com/u/82046981?v=4?s=100" width="100px;" alt="talva-tr"/><br /><sub><b>talva-tr</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=talva-tr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://bandism.net/"><img src="https://avatars.githubusercontent.com/u/22633385?v=4?s=100" width="100px;" alt="Ikko Ashimine"/><br /><sub><b>Ikko Ashimine</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=eltociear" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Zamiell"><img src="https://avatars.githubusercontent.com/u/5511220?v=4?s=100" width="100px;" alt="James"/><br /><sub><b>James</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=Zamiell" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/wushujames"><img src="https://avatars.githubusercontent.com/u/677529?v=4?s=100" width="100px;" alt="James Cheng"/><br /><sub><b>James Cheng</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=wushujames" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://qiita.com/SUZUKI_Masaya"><img src="https://avatars.githubusercontent.com/u/15100604?v=4?s=100" width="100px;" alt="Masaya Suzuki"/><br /><sub><b>Masaya Suzuki</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=massongit" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://fagai.net"><img src="https://avatars.githubusercontent.com/u/1772112?v=4?s=100" width="100px;" alt="fagai"/><br /><sub><b>fagai</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=fagai" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pkit"><img src="https://avatars.githubusercontent.com/u/805654?v=4?s=100" width="100px;" alt="Constantine Peresypkin"/><br /><sub><b>Constantine Peresypkin</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=pkit" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/deronnax"><img src="https://avatars.githubusercontent.com/u/439279?v=4?s=100" width="100px;" alt="Mathieu Dupuy"/><br /><sub><b>Mathieu Dupuy</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=deronnax" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/JoeOvo"><img src="https://avatars.githubusercontent.com/u/100686542?v=4?s=100" width="100px;" alt="Joe Moggridge"/><br /><sub><b>Joe Moggridge</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=JoeOvo" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.credly.com/users/thyarles/badges"><img src="https://avatars.githubusercontent.com/u/1340046?v=4?s=100" width="100px;" alt="Charles Santos"/><br /><sub><b>Charles Santos</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=thyarles" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kostiantyn-korniienko-aurea"><img src="https://avatars.githubusercontent.com/u/37180625?v=4?s=100" width="100px;" alt="Kostiantyn Korniienko"/><br /><sub><b>Kostiantyn Korniienko</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=kostiantyn-korniienko-aurea" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/lpulley"><img src="https://avatars.githubusercontent.com/u/7193187?v=4?s=100" width="100px;" alt="Logan Pulley"/><br /><sub><b>Logan Pulley</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=lpulley" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/kenji-miyake/"><img src="https://avatars.githubusercontent.com/u/31987104?v=4?s=100" width="100px;" alt="Kenji Miyake"/><br /><sub><b>Kenji Miyake</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=kenji-miyake" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/adonisgarciac"><img src="https://avatars.githubusercontent.com/u/71078987?v=4?s=100" width="100px;" alt="adonisgarciac"/><br /><sub><b>adonisgarciac</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=adonisgarciac" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=adonisgarciac" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/cfernhout"><img src="https://avatars.githubusercontent.com/u/22294606?v=4?s=100" width="100px;" alt="Chiel Fernhout"/><br /><sub><b>Chiel Fernhout</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=cfernhout" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/albertoperdomo2"><img src="https://avatars.githubusercontent.com/u/62241095?v=4?s=100" width="100px;" alt="Alberto Perdomo"/><br /><sub><b>Alberto Perdomo</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=albertoperdomo2" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
