[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge\&logo=ubuntu\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Mac OS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge\&logo=macos\&logoColor=F0F0F0)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge\&logo=windows\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Public workflows that use this action.](https://img.shields.io/endpoint?style=for-the-badge\&url=https%3A%2F%2Fused-by.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue)](https://github.com/search?o=desc\&q=tj-actions+changed-files+language%3AYAML\&s=\&type=Code)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4a625e9b62794b5b98e169c15c0e673c)](https://www.codacy.com/gh/tj-actions/changed-files/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=tj-actions/changed-files\&utm_campaign=Badge_Grade)
[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml)
[![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-19-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

## changed-files

Retrieve all changed files and directories relative to the target branch or the last remote commit returning the **relative path** from the project root.

## Features

*   Fast execution (0-10 seconds on average).
*   Easy to debug.
*   Scales to large repositories.
*   Supports Git submodules.
*   Escaped JSON output which can be used for running matrix jobs based on changed files.
*   List changed directories.
*   Restrict the max depth of changed directories.
*   Write outputs to files at a specified location for further processing.
*   Monorepos (Fetches only the last remote commit).
*   Supports all platforms (Linux, MacOS, Windows).
*   [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners) support
*   [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@3.3/admin/github-actions/getting-started-with-github-actions-for-your-enterprise/getting-started-with-github-actions-for-github-enterprise-server) support.
*   [self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners) support.
*   List all files and directories that have changed:
    *   Between the current pull request branch and the last commit on the target branch.
    *   Between the last commit and the current pushed change.
    *   Between the last remote branch commit and the current HEAD.
*   Restrict change detection to a subset of files and directories:
    *   Boolean output indicating that certain files have been changed.
    *   Using [Glob pattern](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet) matching.
        *   Brace expansion.

## Usage

> NOTE: :warning:
>
> *   **IMPORTANT:** For `push` events you need to include `fetch-depth: 0` **OR** `fetch-depth: 2` depending on your use case.
> *   For monorepos where pulling all the branch history might not be desired, you can omit `fetch-depth` for `pull_request` events.
> *   For files located in a sub-directory ensure that the pattern specified contains `**/` (globstar) to match any preceding directories or explicitly pass the full path relative to the project root. See: [#314](https://github.com/tj-actions/changed-files/issues/314).
> *   All multiline inputs should not use double or single qoutes since the value is already a string seperated by a newline character. See [Examples](#examples) for more information.
> *   Ensure that `persist-credentials` is set to `true` when configuring `actions/checkout` if `fetch-depth` isn't set to `0`.

```yaml
name: CI

on:
  # Compare the preceeding commit -> to the current commit of the main branch.
  # (Note: To compare changes between the current commit to the last pushed remote commit of the main branch set `since_last_remote_commit: true`)
  push:
    branches:
      - main
  # Compare the last commit of main -> to the current commit of a PR branch.
  # (Note: To compare changes between the current commit to the last pushed remote commit of a PR branch set `since_last_remote_commit: true`)
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest  # windows-latest | macos-latest
    name: Test changed-files
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # OR "2" -> To retrieve the preceding commit.

      # Example 1
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v35

      - name: List all changed files
        run: |
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            echo "$file was changed"
          done

      # Example 2
      - name: Get changed files in the docs folder
        id: changed-files-specific
        uses: tj-actions/changed-files@v35
        with:
          files: docs/*.{js,html}  # Alternatively using: `docs/**` or `docs`

      - name: Run step if any file(s) in the docs folder change
        if: steps.changed-files-specific.outputs.any_changed == 'true'
        run: |
          echo "One or more files in the docs folder has changed."
          echo "List all the files that have changed: ${{ steps.changed-files-specific.outputs.all_changed_files }}"
      
      # Example 3
      - name: Get changed js files excluding the docs folder
        id: changed-files-excluded
        uses: tj-actions/changed-files@v35
        with:
          files: |
            **/*.js
          files_ignore: docs/** # Alternatively using: `docs`

      - name: Run step if any other js file(s) change
        if: steps.changed-files-excluded.outputs.any_changed == 'true'
        run: |
          echo "One or more js files not in the doc folder has changed."
          echo "List all the files that have changed: ${{ steps.changed-files-excluded.outputs.all_changed_files }}"
```

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

## Outputs

<!-- AUTO-DOC-OUTPUT:START - Do not remove or modify this section -->

|             OUTPUT             |  TYPE  |                                                                                                                                      DESCRIPTION                                                                                                                                       |
|--------------------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|          added\_files           | string |                                                                                                                       Returns only files that are Added<br>(A).                                                                                                                        |
| all\_changed\_and\_modified\_files | string |                                                                                                      Returns all changed and modified files<br>i.e. *a combination of (ACMRDTUX)*                                                                                                      |
|       all\_changed\_files        | string |                                                                                     Returns all changed files i.e. *a<br> combination of all added, copied, modified<br>and renamed files (ACMR)*                                                                                      |
|       all\_modified\_files       | string |                                                                                Returns all changed files i.e. *a<br> combination of all added, copied, modified,<br>renamed and deleted files (ACMRD)*.                                                                                |
|   all\_old\_new\_renamed\_files    | string |                                                           Returns only files that are Renamed<br> and list their old and new<br> names. **NOTE:** This requires setting `include_all_old_new_renamed_files`<br>to `true` (R)                                                           |
|          any\_changed           | string |         Returns `true` when any of the<br> filenames provided using the `files` input<br> has changed. If no `files` have<br> been specified,an empty string `''` is<br> returned. i.e. *using a combination of<br> all added, copied, modified and renamed<br>files (ACMR)*.          |
|          any\_deleted           | string |                                                   Returns `true` when any of the<br> filenames provided using the `files` input<br> has been deleted. If no `files`<br> have been specified,an empty string `''`<br>is returned. (D)                                                   |
|          any\_modified          | string | Returns `true` when any of the<br> filenames provided using the `files` input<br> has been modified. If no `files`<br> have been specified,an empty string `''`<br> is returned. i.e. *using a combination<br> of all added, copied, modified, renamed,<br>and deleted files (ACMRD)*. |
|          copied\_files          | string |                                                                                                                       Returns only files that are Copied<br>(C).                                                                                                                       |
|         deleted\_files          | string |                                                                                                                      Returns only files that are Deleted<br>(D).                                                                                                                       |
|         modified\_files         | string |                                                                                                                      Returns only files that are Modified<br>(M).                                                                                                                      |
|          only\_changed          | string |                Returns `true` when only files provided<br> using the `files` input has changed.<br> If no `files` have been specified,an<br> empty string `''` is returned. i.e.<br> *using a combination of all added,<br>copied, modified and renamed files (ACMR)*.                 |
|          only\_deleted          | string |                                                        Returns `true` when only files provided<br> using the `files` input has been<br> deleted. If no `files` have been<br> specified,an empty string `''` is returned.<br>(D)                                                        |
|         only\_modified          | string |                                                       Returns `true` when only files provided<br> using the `files` input has been<br> modified. If no `files` have been<br>specified,an empty string `''` is returned.(ACMRD).                                                        |
|      other\_changed\_files       | string |                                                              Returns all other changed files not<br> listed in the files input i.e.<br> *using a combination of all added,<br>copied, modified and renamed files (ACMR)*.                                                              |
|      other\_deleted\_files       | string |                                                                                 Returns all other deleted files not<br> listed in the files input i.e.<br> *a combination of all deleted files<br>(D)*                                                                                 |
|      other\_modified\_files      | string |                                                                Returns all other modified files not<br> listed in the files input i.e.<br> *a combination of all added, copied,<br>modified, and deleted files (ACMRD)*                                                                |
|         renamed\_files          | string |                                                                                                                      Returns only files that are Renamed<br>(R).                                                                                                                       |
|       type\_changed\_files       | string |                                                                                                              Returns only files that have their<br>file type changed (T).                                                                                                              |
|         unknown\_files          | string |                                                                                                                      Returns only files that are Unknown<br>(X).                                                                                                                       |
|         unmerged\_files         | string |                                                                                                                      Returns only files that are Unmerged<br>(U).                                                                                                                      |

<!-- AUTO-DOC-OUTPUT:END -->

## Inputs

<!-- AUTO-DOC-INPUT:START - Do not remove or modify this section -->

|               INPUT               |  TYPE  | REQUIRED |       DEFAULT       |                                                                                                                 DESCRIPTION                                                                                                                 |
|-----------------------------------|--------|----------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|             base\_sha              | string |  false   |                     |                                                                                      Specify a different base commit SHA<br>used for comparing changes                                                                                      |
|           diff\_relative           | string |  false   |                     |                            Exclude changes outside the current directory<br> and show path names relative to<br> it. **NOTE:** This requires you to<br> specify the top level directory via<br>the `path` input.                            |
|             dir\_names             | string |  false   |      `"false"`      |                                             Output unique changed directories instead of<br> filenames. **NOTE:** This returns `.` for<br> changed files located in the root<br>of the project.                                             |
|      dir\_names\_exclude\_root       | string |  false   |      `"false"`      |                                                                   Exclude the root directory represented by<br> `.` from the output when `dir_names`is<br>set to `true`.                                                                    |
|        dir\_names\_max\_depth        | string |  false   |                     |                                                              Maximum depth of directories to output.<br> e.g `test/test1/test2` with max depth of<br>`2` returns `test/test1`.                                                              |
|            fetch\_depth            | string |  false   |       `"50"`        |                                                       Depth of additional branch history fetched.<br> **NOTE**: This can be adjusted to<br>resolve errors with insufficient history.                                                        |
|               files               | string |  false   |                     |                     File and directory patterns to detect<br> changes using only these list of<br> file(s) (Defaults to the entire repo)<br> **NOTE:** Multiline file/directory patterns should not<br>include quotes.                      |
|      files\_from\_source\_file       | string |  false   |                     |                                                                                            Source file(s) used to populate the<br>`files` input.                                                                                            |
|           files\_ignore            | string |  false   |                     |                                                                Ignore changes to these file(s) **NOTE:**<br> Multiline file/directory patterns should not include<br>quotes.                                                                |
|   files\_ignore\_from\_source\_file   | string |  false   |                     |                                                                                         Source file(s) used to populate the<br>`files_ignore` input                                                                                         |
|      files\_ignore\_separator       | string |  false   |       `"\n"`        |                                                                                             Separator used to split the `files_ignore`<br>input                                                                                             |
|          files\_separator          | string |  false   |       `"\n"`        |                                                                                                Separator used to split the `files`<br>input                                                                                                 |
| include\_all\_old\_new\_renamed\_files | string |  false   |      `"false"`      |                                          Include `all_old_new_renamed_files` output. Note this can<br>generate a large output See: [#501](https://github.com/tj-actions/changed-files/issues/501).                                          |
|               json                | string |  false   |      `"false"`      |                                                                      Output list of changed files in<br> a JSON formatted string which can<br>be used for matrix jobs.                                                                      |
|          json\_raw\_format          | string |  false   |      `"false"`      |                     Output list of changed files in<br> [jq](https://devdocs.io/jq/) raw output format which means that the output will not be<br> surrounded by quotes and special characters<br>will not be escaped.                      |
|         match\_directories         | string |  false   |      `"true"`       |                                                                                               Indicates whether to include match directories                                                                                                |
|      old\_new\_files\_separator      | string |  false   |        `" "`        |                                                                                         Split character for old and new<br>renamed filename pairs.                                                                                          |
|         old\_new\_separator         | string |  false   |        `","`        |                                                                                             Split character for old and new<br>filename pairs.                                                                                              |
|            output\_dir             | string |  false   | `".github/outputs"` |                                                                                                      Directory to store output files.                                                                                                       |
|               path                | string |  false   |        `"."`        |                                                                               Specify a relative path under `$GITHUB_WORKSPACE`<br>to locate the repository.                                                                                |
|             quotepath             | string |  false   |      `"true"`       |                                                           Use non ascii characters to match<br> files and output the filenames completely<br>verbatim by setting this to `false`                                                            |
|             separator             | string |  false   |        `" "`        |                                                                                                     Split character for output strings                                                                                                      |
|                sha                | string |  false   |                     |                                                                                        Specify a different commit SHA used<br>for comparing changes                                                                                         |
|               since               | string |  false   |                     |                                                                             Get changed files for commits whose<br> timestamp is older than the given<br>time.                                                                              |
|     since\_last\_remote\_commit      | string |  false   |      `"false"`      | Use the last commit on the<br> remote branch as the `base_sha`. Defaults<br> to the last non merge commit<br> on the target branch for pull<br> request events and the previous remote<br> commit of the current branch for<br>push events. |
|               until               | string |  false   |                     |                                                                            Get changed files for commits whose<br> timestamp is earlier than the given<br>time.                                                                             |
|        write\_output\_files         | string |  false   |      `"false"`      |                                                                                    Write outputs to files in the<br>`.github/outputs` folder by default.                                                                                    |

<!-- AUTO-DOC-INPUT:END -->

## Examples

<details>
<summary>Get all changed files in the current branch</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v35
...
```

</details>

<details>
<summary>Get all changed files and using a comma separator</summary>

```yaml
...
    - name: Get all changed files and use a comma separator in the output
      id: changed-files
      uses: tj-actions/changed-files@v35
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
      uses: tj-actions/changed-files@v35

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
      uses: tj-actions/changed-files@v35

    - name: Run a step if my-file.txt was modified
      if: contains(steps.changed-files.outputs.modified_files, 'my-file.txt')
      run: |
        echo "my-file.txt file has been modified."
...
```

See [outputs](#outputs) for a list of all available outputs.

</details>

<details>
<summary>Get all changed files using a list of files</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v35
      with:
        files: |
          my-file.txt
          *.sh
          *.png
          !*.md
          test_directory
          **/*.sql
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
      uses: tj-actions/changed-files@v35
      with:
        files: |
          my-file.txt
          *.sh
          *.png
          !*.md
          test_directory
          **/*.sql

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
      uses: tj-actions/changed-files@v35
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
      uses: tj-actions/changed-files@v35
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
      uses: tj-actions/changed-files@v35
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
      uses: tj-actions/changed-files@v35
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

      - name: Get Base SHA
        id: get-base-sha
        run: |
          echo "base_sha=$(git rev-parse "$(git tag --sort=-v:refname | head -n 2 | tail -n 1)")" >> $GITHUB_OUTPUT

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v35
        with:
          base_sha: ${{ steps.get-base-sha.outputs.base_sha }}

      - name: Get changed files in the .github folder
        id: changed-files-specific
        uses: tj-actions/changed-files@v35
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
      uses: tj-actions/changed-files@v35
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
<summary>Get all changed files with non äšćįí characters i.e (Filename in other languages)</summary>

```yaml
...
    - name: Run changed-files with quotepath disabled
      id: changed-files-quotepath
      uses: tj-actions/changed-files@v35
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
        uses: tj-actions/changed-files@v35
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
          main-branch-name: ${{ steps.branch-name.outputs.base_ref_branch }} # Get the last successful commit on master or main branch
          workflow_id: 'test.yml'

      - name: Run changed-files with the commit of the last successful test workflow run on main
        id: changed-files-base-sha-pull-request
        uses: tj-actions/changed-files@v35
        with:
          base_sha: ${{ steps.last_successful_commit_pull_request.outputs.base }}
...
```

</details>
</li>
</ul>

> NOTE: This setting overrides the commit sha used by setting `since_last_remote_commit` to true.
> It is recommended to use either solution that works for your use case.

See [inputs](#inputs) for more information.

</details>

<details>
<summary>Get all changed files but only return the directory names</summary>

```yaml
...
    - name: Run changed-files with dir_names
      id: changed-files-dir-names
      uses: tj-actions/changed-files@v35
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
    - name: Run changed-files with json output
      id: changed-files-json
      uses: tj-actions/changed-files@v35
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
      uses: tj-actions/changed-files@v35
      with:
        since: "2022-08-19"

    - name: Get changed-files until 2022-08-20
      id: changed-files-until
      uses: tj-actions/changed-files@v35
      with:
        until: "2022-08-20"
...
```

See [inputs](#inputs) for more information.

</details>

### Real world example

<img width="1147" alt="Screen Shot 2021-11-19 at 4 59 21 PM" src="https://user-images.githubusercontent.com/17484350/142696936-8b7ca955-7ef9-4d53-9bdf-3e0008e90c3f.png">

*   Free software: [MIT license](LICENSE)

## Known Limitation

> NOTE: :warning:
>
> *   Using characters like `\n`, `%`, `.` and `\r` as separators would be [URL encoded](https://www.w3schools.com/tags/ref_urlencode.asp)
> *   Spaces in file names can introduce bugs when using bash loops. See: [#216](https://github.com/tj-actions/changed-files/issues/216)
>     However, this action will handle spaces in file names, with a recommendation of using a separator to prevent hidden issues.
>     ![Screen Shot 2021-10-23 at 9 37 34 AM](https://user-images.githubusercontent.com/17484350/138558767-b13c90bf-a1ae-4e86-9520-70a6a4624f41.png)

## Migration guide

With the switch from using grep's Extended regex to match files to the natively supported workflow glob pattern matching syntax introduced in [v13](https://github.com/tj-actions/changed-files/releases/tag/v13) you'll need to modify patterns used to match `files`.

**BEFORE**

```yml
...

      - name: Get specific changed files
        id: changed-files-specific
        uses: tj-actions/changed-files@v12.2
        with:
          files: |
            \.sh$
            .(sql|py)$
            ^(mynewfile|custom)
```

**AFTER**

```yml
...

      - name: Get specific changed files
        id: changed-files-specific
        uses: tj-actions/changed-files@v24
        with:
          files: |
            *.sh
            *.sql
            *.py
            mynewfile
            custom/**
```

## Credits

This package was created with [Cookiecutter](https://github.com/cookiecutter/cookiecutter).

*   [tj-actions/glob](https://github.com/tj-actions/glob)
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
      <td align="center"><a href="https://github.com/jsoref"><img src="https://avatars.githubusercontent.com/u/2119212?v=4?s=100" width="100px;" alt="Josh Soref"/><br /><sub><b>Josh Soref</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=jsoref" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/monoxgas"><img src="https://avatars.githubusercontent.com/u/1223016?v=4?s=100" width="100px;" alt="Nick Landers"/><br /><sub><b>Nick Landers</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=monoxgas" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/Kras4ooo"><img src="https://avatars.githubusercontent.com/u/1948054?v=4?s=100" width="100px;" alt="Krasimir Nikolov"/><br /><sub><b>Krasimir Nikolov</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=Kras4ooo" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=Kras4ooo" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/IvanPizhenko"><img src="https://avatars.githubusercontent.com/u/11859904?v=4?s=100" width="100px;" alt="Ivan Pizhenko"/><br /><sub><b>Ivan Pizhenko</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=IvanPizhenko" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=IvanPizhenko" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/talva-tr"><img src="https://avatars.githubusercontent.com/u/82046981?v=4?s=100" width="100px;" alt="talva-tr"/><br /><sub><b>talva-tr</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=talva-tr" title="Code">💻</a></td>
      <td align="center"><a href="https://bandism.net/"><img src="https://avatars.githubusercontent.com/u/22633385?v=4?s=100" width="100px;" alt="Ikko Ashimine"/><br /><sub><b>Ikko Ashimine</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=eltociear" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/Zamiell"><img src="https://avatars.githubusercontent.com/u/5511220?v=4?s=100" width="100px;" alt="James"/><br /><sub><b>James</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=Zamiell" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/wushujames"><img src="https://avatars.githubusercontent.com/u/677529?v=4?s=100" width="100px;" alt="James Cheng"/><br /><sub><b>James Cheng</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=wushujames" title="Documentation">📖</a></td>
      <td align="center"><a href="https://qiita.com/SUZUKI_Masaya"><img src="https://avatars.githubusercontent.com/u/15100604?v=4?s=100" width="100px;" alt="Masaya Suzuki"/><br /><sub><b>Masaya Suzuki</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=massongit" title="Code">💻</a></td>
      <td align="center"><a href="https://fagai.net"><img src="https://avatars.githubusercontent.com/u/1772112?v=4?s=100" width="100px;" alt="fagai"/><br /><sub><b>fagai</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=fagai" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/pkit"><img src="https://avatars.githubusercontent.com/u/805654?v=4?s=100" width="100px;" alt="Constantine Peresypkin"/><br /><sub><b>Constantine Peresypkin</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=pkit" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/deronnax"><img src="https://avatars.githubusercontent.com/u/439279?v=4?s=100" width="100px;" alt="Mathieu Dupuy"/><br /><sub><b>Mathieu Dupuy</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=deronnax" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/JoeOvo"><img src="https://avatars.githubusercontent.com/u/100686542?v=4?s=100" width="100px;" alt="Joe Moggridge"/><br /><sub><b>Joe Moggridge</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=JoeOvo" title="Documentation">📖</a></td>
      <td align="center"><a href="https://www.credly.com/users/thyarles/badges"><img src="https://avatars.githubusercontent.com/u/1340046?v=4?s=100" width="100px;" alt="Charles Santos"/><br /><sub><b>Charles Santos</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=thyarles" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/kostiantyn-korniienko-aurea"><img src="https://avatars.githubusercontent.com/u/37180625?v=4?s=100" width="100px;" alt="Kostiantyn Korniienko"/><br /><sub><b>Kostiantyn Korniienko</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=kostiantyn-korniienko-aurea" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/lpulley"><img src="https://avatars.githubusercontent.com/u/7193187?v=4?s=100" width="100px;" alt="Logan Pulley"/><br /><sub><b>Logan Pulley</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=lpulley" title="Code">💻</a></td>
      <td align="center"><a href="https://www.linkedin.com/in/kenji-miyake/"><img src="https://avatars.githubusercontent.com/u/31987104?v=4?s=100" width="100px;" alt="Kenji Miyake"/><br /><sub><b>Kenji Miyake</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=kenji-miyake" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/adonisgarciac"><img src="https://avatars.githubusercontent.com/u/71078987?v=4?s=100" width="100px;" alt="adonisgarciac"/><br /><sub><b>adonisgarciac</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=adonisgarciac" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=adonisgarciac" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/cfernhout"><img src="https://avatars.githubusercontent.com/u/22294606?v=4?s=100" width="100px;" alt="Chiel Fernhout"/><br /><sub><b>Chiel Fernhout</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=cfernhout" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
