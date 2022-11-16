[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4a625e9b62794b5b98e169c15c0e673c)](https://www.codacy.com/gh/tj-actions/changed-files/dashboard?utm_source=github.com\&utm_medium=referral\&utm_content=tj-actions/changed-files\&utm_campaign=Badge_Grade)
[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml)
[![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml)
[![Public workflows that use this action.](https://img.shields.io/endpoint?url=https%3A%2F%2Fused-by.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue)](https://github.com/search?o=desc\&q=tj-actions+changed-files+language%3AYAML\&s=\&type=Code)

[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?logo=ubuntu\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Mac OS](https://img.shields.io/badge/mac%20os-000000?logo=macos\&logoColor=F0F0F0)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
[![Windows](https://img.shields.io/badge/Windows-0078D6?logo=windows\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-17-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

## changed-files

Retrieve all changed files and directories relative to the target branch or the last remote commit returning the **absolute path** from the project root.

## Features

*   Fast execution (0-2 seconds on average).
*   Easy to debug.
*   Scales to large repositories.
*   Git submodules support.
*   No extra API calls.
*   Escaped JSON Output which can be used for running matrix jobs based on changed files.
*   List only changed directories.
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

## Usage

> NOTE: :warning:
>
> *   **IMPORTANT:** For `push` events you need to include `fetch-depth: 0` **OR** `fetch-depth: 2` depending on your use case.
> *   For monorepos where pulling all the branch history might not be desired, you can omit `fetch-depth` for `pull_request` events.
> *   For files located in a sub-directory ensure that the pattern specified contains `**/` (globstar) to match any preceding directories or explicitly pass the full path relative to the project root. See: [#314](https://github.com/tj-actions/changed-files/issues/314).
> *   All multiline inputs should not use double or single qoutes since the value is already a string seperated by a newline character. See [Examples](#examples) for more information.

```yaml
name: CI

on:
  # Compare the preceeding commit of main -> to the current commit of the main branch.
  # (Note: To compare changes between the last pushed commit to the remote main branch set `since_last_remote_commit: true`)
  push:
    branches:
      - main
  # Compare the last commit of main -> to the current commit of a PR branch. 
  # (Note: To compare changes between the last pushed commit to the remote PR branch set `since_last_remote_commit: true`)
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
        uses: tj-actions/changed-files@v34

      - name: List all changed files
        run: |
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            echo "$file was changed"
          done

      # Example 2
      - name: Get changed files in the docs folder
        id: changed-files-specific
        uses: tj-actions/changed-files@v34
        with:
          files: |
            docs/**

      - name: Run step if any file(s) in the docs folder change
        if: steps.changed-files-specific.outputs.any_changed == 'true'
        run: |
          echo "One or more files in the docs folder has changed."
          echo "List all the files that have changed: ${{ steps.changed-files-specific.outputs.all_changed_files }}"
```

I want to thank everyone supporting and using this project, your are awesome. Special thanks to every contributor.

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

|             OUTPUT             |  TYPE  |                                                                                                                                       DESCRIPTION                                                                                                                                        |
|--------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|          added\_files           | string |                                                                                                                        Returns only files that are<br>Added (A).                                                                                                                         |
| all\_changed\_and\_modified\_files | string |                                                                                                     Returns all changed and modified<br>files i.e. *a combination of<br>(ACMRDTUX)*                                                                                                      |
|       all\_changed\_files        | string |                                                                                     Returns all changed files i.e.<br>*a combination of all added,<br>copied, modified and renamed files<br>(ACMR)*                                                                                      |
|       all\_modified\_files       | string |                                                                                Returns all changed files i.e.<br>*a combination of all added,<br>copied, modified, renamed and deleted<br>files (ACMRD)*.                                                                                |
|   all\_old\_new\_renamed\_files    | string |                                                           Returns only files that are<br>Renamed and list their old<br>and new names. **NOTE:** This<br>requires setting `include_all_old_new_renamed_files` to `true`<br>(R)                                                            |
|          any\_changed           | string |           Returns `true` when any of<br>the filenames provided using the<br>`files` input has changed. If<br>no `files` have been specified,an<br>empty string `''` is returned.<br>i.e. *using a combination of<br>all added, copied, modified and<br>renamed files (ACMR)*.            |
|          any\_deleted           | string |                                                    Returns `true` when any of<br>the filenames provided using the<br>`files` input has been deleted.<br>If no `files` have been<br>specified,an empty string `''` is<br>returned. (D)                                                    |
|          any\_modified          | string | Returns `true` when any of<br>the filenames provided using the<br>`files` input has been modified.<br>If no `files` have been<br>specified,an empty string `''` is<br>returned. i.e. *using a combination<br>of all added, copied, modified,<br>renamed, and deleted files (ACMRD)*.<br> |
|          copied\_files          | string |                                                                                                                        Returns only files that are<br>Copied (C).                                                                                                                        |
|         deleted\_files          | string |                                                                                                                       Returns only files that are<br>Deleted (D).                                                                                                                        |
|         modified\_files         | string |                                                                                                                       Returns only files that are<br>Modified (M).                                                                                                                       |
|          only\_changed          | string |                Returns `true` when only files<br>provided using the `files` input<br>has changed. If no `files`<br>have been specified,an empty string<br>`''` is returned. i.e. *using<br>a combination of all added,<br>copied, modified and renamed files<br>(ACMR)*.                 |
|          only\_deleted          | string |                                                        Returns `true` when only files<br>provided using the `files` input<br>has been deleted. If no<br>`files` have been specified,an empty<br>string `''` is returned. (D)<br>                                                         |
|         only\_modified          | string |                                                        Returns `true` when only files<br>provided using the `files` input<br>has been modified. If no<br>`files` have been specified,an empty<br>string `''` is returned.(ACMRD).                                                        |
|      other\_changed\_files       | string |                                                              Returns all other changed files<br>not listed in the files<br>input i.e. *using a combination<br>of all added, copied, modified<br>and renamed files (ACMR)*.                                                               |
|      other\_deleted\_files       | string |                                                                                   Returns all other deleted files<br>not listed in the files<br>input i.e. *a combination of<br>all deleted files (D)*                                                                                   |
|      other\_modified\_files      | string |                                                                Returns all other modified files<br>not listed in the files<br>input i.e. *a combination of<br>all added, copied, modified, and<br>deleted files (ACMRD)*                                                                 |
|         renamed\_files          | string |                                                                                                                       Returns only files that are<br>Renamed (R).                                                                                                                        |
|       type\_changed\_files       | string |                                                                                                             Returns only files that have<br>their file type changed (T).<br>                                                                                                             |
|         unknown\_files          | string |                                                                                                                       Returns only files that are<br>Unknown (X).                                                                                                                        |
|         unmerged\_files         | string |                                                                                                                       Returns only files that are<br>Unmerged (U).                                                                                                                       |

<!-- AUTO-DOC-OUTPUT:END -->

## Inputs

<!-- AUTO-DOC-INPUT:START - Do not remove or modify this section -->

|               INPUT               |  TYPE  | REQUIRED |        DEFAULT        |                                                                                                            DESCRIPTION                                                                                                             |
|-----------------------------------|--------|----------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|             base\_sha              | string |  false   |                       |                                                                               Specify a different base commit<br>SHA used for comparing changes<br>                                                                                |
|           diff\_relative           | string |  false   |                       |                        Exclude changes outside the current<br>directory and show pathnames relative<br>to it. **NOTE:** This requires<br>you to specify the top<br>level directory via the `path`<br>input.                        |
|             dir\_names             | string |  false   |       `"false"`       |                                        Output unique changed directories instead<br>of filenames. **NOTE:** This returns<br>`.` for changed files located<br>in the root of the<br>project.                                        |
|            fetch\_depth            | string |  false   |        `"40"`         |                                                  Limit depth of the branch<br>history fetched. **NOTE**: This can<br>be adjusted to resolve errors<br>with insufficient history.                                                   |
|               files               | string |  false   |                       |                 File and directory patterns to<br>detect changes using only these<br>list of file(s) (Defaults to<br>the entire repo) **NOTE:** Multiline<br>file/directory patterns should not include<br>qoutes.                 |
|      files\_from\_source\_file       | string |  false   |                       |                                                                                       Source file(s) used to populate<br>the `files` input.                                                                                        |
|           files\_ignore            | string |  false   |                       |                                                            Ignore changes to these file(s)<br>**NOTE:** Multiline file/directory patterns should<br>not include qoutes.                                                            |
|   files\_ignore\_from\_source\_file   | string |  false   |                       |                                                                                    Source file(s) used to populate<br>the `files_ignore` input                                                                                     |
|      files\_ignore\_separator       | string |  false   |        `"\n"`         |                                                                                        Separator used to split the<br>`files-ignore` input                                                                                         |
|          files\_separator          | string |  false   |        `"\n"`         |                                                                                            Separator used to split the<br>`files` input                                                                                            |
| include\_all\_old\_new\_renamed\_files | string |  false   |       `"false"`       |                                    Include `all_old_new_renamed_files` output. Note this<br>can generate a large output<br>See: [#501](https://github.com/tj-actions/changed-files/issues/501).                                    |
|               json                | string |  false   |       `"false"`       |                                                                Output list of changed files<br>in a JSON formatted string<br>which can be used for<br>matrix jobs.                                                                 |
|          max\_fetch\_depth          | string |  false   |       `"5000"`        |                                                 Maximum depth of the branch<br>history fetched. **NOTE**: This can<br>be adjusted to resolve errors<br>with insufficient history.                                                  |
|      old\_new\_files\_separator      | string |  false   |         `" "`         |                                                                                    Split character for multiple old<br>and new filename pairs.                                                                                     |
|         old\_new\_separator         | string |  false   |         `","`         |                                                                                         Split character for old and<br>new filename pairs.                                                                                         |
|               path                | string |  false   |         `"."`         |                                                                         Specify a relative path under<br>`$GITHUB_WORKSPACE` to locate the repository.<br>                                                                         |
|             quotepath             | string |  false   |       `"true"`        |                                                      Use non ascii characters to<br>match files and output the<br>filenames completely verbatim by setting<br>this to `false`                                                      |
|             separator             | string |  false   |         `" "`         |                                                                                               Split character for output strings<br>                                                                                               |
|                sha                | string |  false   | `"${{ github.sha }}"` |                                                                                    Specify a different commit SHA<br>used for comparing changes                                                                                    |
|               since               | string |  false   |                       |                                                                         Get changed files for commits<br>whose timestamp is older than<br>the given time.                                                                          |
|     since\_last\_remote\_commit      | string |   true   |       `"false"`       | Use the last commit on<br>the remote branch as the<br>`base_sha`. Defaults to the last<br>non merge commit on the<br>target branch for pull request<br>events and the previous commit<br>of the current branch for<br>push events. |
|               until               | string |  false   |                       |                                                                        Get changed files for commits<br>whose timestamp is earlier than<br>the given time.                                                                         |

<!-- AUTO-DOC-INPUT:END -->

## Examples

<details>
<summary>Get all changed files in the current branch</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v34
...
```

</details>

<details>
<summary>Get all changed files and using a comma separator</summary>

```yaml
...
    - name: Get all changed files and use a comma separator in the output
      id: changed-files
      uses: tj-actions/changed-files@v34
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
      uses: tj-actions/changed-files@v34
      
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
      uses: tj-actions/changed-files@v34

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
      uses: tj-actions/changed-files@v34
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
<summary>Get all changed files using a list of files and take action base on the changes</summary>

```yaml
...
    - name: Get changed files
      id: changed-files
      uses: tj-actions/changed-files@v34
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
      if: steps.changed-files.outputs.any_deleted == 'true'
      run: |
        for file in ${{ steps.changed-files.outputs.deleted_files }}; do
          echo "$file was deleted"
        done

    - name: Run step if all listed files above have been deleted
      if: steps.changed-files.outputs.only_deleted == 'true'
      run: |
        for file in ${{ steps.changed-files.outputs.deleted_files }}; do
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
      uses: tj-actions/changed-files@v34
      with:
        files_from_source_file: |
          test/changed-files-list.txt
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
      uses: tj-actions/changed-files@v34
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
      uses: tj-actions/changed-files@v34
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
      uses: tj-actions/changed-files@v34
      with:
        base_sha: ${{ github.event.pull_request.base.sha }}
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
      uses: tj-actions/changed-files@v34
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
      uses: tj-actions/changed-files@v34
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

      - uses: nrwl/last-successful-commit-action@v1
        id: last_successful_commit_push
        with:
          branch: ${{ steps.branch-name.outputs.current_branch }} # Get the last successful commit for the current branch. 
          workflow_id: 'test.yml'
          github_token: ${{ secrets.GITHUB_TOKEN }}

      - name: Run changed-files with the commit of the last successful test workflow run
        id: changed-files-base-sha-push
        uses: tj-actions/changed-files@v34
        with:
          base_sha: ${{ steps.last_successful_commit_push.outputs.commit_hash }}
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

      - uses: nrwl/last-successful-commit-action@v1
        id: last_successful_commit_pull_request
        with:
          branch: ${{ steps.branch-name.outputs.base_ref_branch }} # Get the last successful commit on master or main branch 
          workflow_id: 'test.yml'
          github_token: ${{ secrets.GITHUB_TOKEN }}

      - name: Run changed-files with the commit of the last successful test workflow run on main
        id: changed-files-base-sha-pull-request
        uses: tj-actions/changed-files@v34
        with:
          base_sha: ${{ steps.last_successful_commit_pull_request.outputs.commit_hash }}
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
      uses: tj-actions/changed-files@v34
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
      uses: tj-actions/changed-files@v34
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
      uses: tj-actions/changed-files@v34
      with:
        since: "2022-08-19"

    - name: Get changed-files until 2022-08-20
      id: changed-files-until
      uses: tj-actions/changed-files@v34
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

## Credits

This package was created with [Cookiecutter](https://github.com/cookiecutter/cookiecutter).

*   [tj-actions/glob](https://github.com/tj-actions/glob)
*   [tj-actions/demo](https://github.com/tj-actions/demo)
*   [tj-actions/demo2](https://github.com/tj-actions/demo2)
*   [tj-actions/demo3](https://github.com/tj-actions/demo3)
*   [tj-actions/release-tagger](https://github.com/tj-actions/release-tagger)
*   [tj-actions/auto-doc](https://github.com/tj-actions/auto-doc)
*   [tj-actions/verify-changed-files](https://github.com/tj-actions/verify-changed-files)

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
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
