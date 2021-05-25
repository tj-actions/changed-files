[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml) [![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml) <a href="https://github.com/search?q=tj-actions+changed-files+path%3A.github%2Fworkflows+language%3AYAML&type=code" target="_blank" title="Public workflows that use this action."><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-tj-actions.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue" alt="Public workflows that use this action."></a>

changed-files
-------------

Retrieve all changed files relative to the default branch (`pull_request*` events) or a previous commit (`push` event).

This includes detecting files that were:

- Added
- Copied
- Modified 
- Deleted 
- Renamed
- Type changed 
- Unmerged   
- Unknown



## Features
- List all files that have changed
  - Between the current pull request branch and the default branch
  - Between the last commit and the current pushed change.
- Restrict change detection to a subset of files.
  - Report on files that have at least one change.
  - Regex pattern matching on a subset of files.


## Usage



> NOTE: :warning:
> * **IMPORTANT:** For `push` events to work you need to include `fetch-depth: 0` **OR** `fetch-depth: 2` depending on your use case. 
> * When using `persist-credentials: false` with `actions/checkout@v2` you'll need to specify a `token` using the `token` input.


```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    name: Test changed-files
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # OR "2" -> To retrieve the preceding commit.
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v6.2
      
      - name: List all modified files
        run: |
          for file in "${{ steps.changed-files.outputs.all_modified_files }}"; do
            echo "$file was modified"
          done
```


## Outputs

| Acronym   |  Meaning     |
|:---------:|:------------:|
| A         | Added        |
| C         | Copied       |
| M         | Modified.    |
| D         | Deleted      |
| R         | Renamed      |
| T         | Type changed |
| U         | Unmerged     |
| X         | Unknown      |


|   Output             |    type      |  example                       |         description                      |
|:-------------------:|:------------:|:------------------------------:|:----------------------------------------:|
| any_changed          |  `string`     |     `true` OR `false`             |  Returns `true` when any of the filenames provided using the `files` input has changed |
| all_modified_files   |  `string`    |    `'new.txt other.png ...'`     |  Select all modified files <br /> i.e *a combination of all added, <br />copied and modified files (ACM).*  |
| all_changed_files   |  `string`    |    `'new.txt other.png ...'`     |  Select all paths (*) <br /> i.e *a combination of all options below.*  |
| added_files         |  `string`    |    `'new.txt other.png ...'`    |  Select only files that are Added (A)    |
| copied_files        |  `string`    |    `'new.txt other.png ...'`     |  Select only files that are Copied (C)   |
| deleted_files       |  `string`    |    `'new.txt other.png ...'`     |  Select only files that are Deleted (D)  |
| modified_files      |  `string`    |    `'new.txt other.png ...'`     |  Select only files that are Modified (M) |
| renamed_files       |  `string`    |    `'new.txt other.png ...'`    |  Select only files that are Renamed (R)  |
| changed_files       |  `string`    |    `'new.txt other.png ...'`     |  Select only files that have their file type changed (T) |
| unmerged_files      |  `string`    |    `'new.txt other.png ...'`     |  Select only files that are Unmerged (U) |
| unknown_files       |  `string`    |    `'new.txt other.png ...'`     |  Select only files that are Unknown (X)  |


## Inputs

|   Input       |    type    |  required      |  default                      |  description  |
|:-------------:|:-----------:|:-------------:|:----------------------------:|:-------------:|
| token         |  `string`   |    `false`    | `${{ github.token }}` | [GITHUB_TOKEN](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow#using-the-github_token-in-a-workflow) <br /> or a repo scoped <br /> [Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)              |
| separator         |  `string`   |    `true` |                          `' '` |  Output string separator   |
| files         |  `string` OR `string[]`   |    `false` |                           |  Restricted list <br> or string of specific <br> files or filename <br> to watch for changes |


## Example

```yaml
...
    steps:
      - uses: actions/checkout@v2

      - name: Get changed files using defaults
        id: changed-files
        uses: tj-actions/changed-files@v6.2
      
      - name: Get changed files using a comma separator
        id: changed-files-comma
        uses: tj-actions/changed-files@v6.2
        with:
          separator: ","

      - name: List all added files
        run: |
          for file in "${{ steps.changed-files.outputs.added_files }}"; do
            echo "$file was added"
          done

      - name: Run step when a file changes
        if: contains(steps.changed-files.outputs.modified_files, 'my-file.txt')
        run: |
          echo "Your file my-file.txt has been modified."

      - name: Run step when a file has been deleted
        if: contains(steps.changed-files.outputs.deleted_files, 'test.txt')
        run: |
          echo "Your test.txt has been deleted."

      - name: Get specific changed files
        id: changed-files-specific
        uses: tj-actions/changed-files@v6.2
        with:
          files: |
            my-file.txt
            test.txt
            new.txt
            test_directory
            .(py|jpeg)$   
            .(sql)$
            ^(mynewfile|custom)

       - name: Run step if any of the listed files above change
         if: steps.changed-files-specific.outputs.any_changed == 'true'
         run: |
           echo "One or more files listed above has changed."
        
```

### Running [pre-commit](https://pre-commit.com/) on all modified files

```yaml
...
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v6.2

      - name: Pre-commit
        uses: pre-commit/action@v2.0.0
        with:
          extra_args: -v --hook-stage push --files ${{ steps.changed-files.outputs.all_modified_files }}
          token: ${{ secrets.github_token }}
```


## Example
![Screen Shot 2021-05-13 at 4 55 30 PM](https://user-images.githubusercontent.com/17484350/118186772-1cc1c400-b40c-11eb-8fe8-b651e674ce96.png) ![Screen Shot 2021-05-21 at 8 38 31 AM](https://user-images.githubusercontent.com/17484350/119138539-fc979380-ba0f-11eb-802c-6e403faac300.png)



* Free software: [MIT license](LICENSE)


Credits
-------

This package was created with [Cookiecutter](https://github.com/cookiecutter/cookiecutter).



Report Bugs
-----------

Report bugs at https://github.com/tj-actions/changed-files/issues.

If you are reporting a bug, please include:

* Your operating system name and version.
* Any details about your workflow that might be helpful in troubleshooting.
* Detailed steps to reproduce the bug.
