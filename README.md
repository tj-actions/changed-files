[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml) [![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml) <a href="https://github.com/search?q=tj-actions+changed-files+path%3A.github%2Fworkflows+language%3AYAML&type=code" target="_blank" title="Public workflows that use this action."><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-git-master.endbug.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue" alt="Public workflows that use this action."></a>

changed-files
-------------

Get modified files using [`git diff --diff-filter`](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---diff-filterACDMRTUXB82308203) to locate all files that have been modified relative to the default branch.

> NOTE: :warning: This action should only run on the following events :warning:
> * [pull_request](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request)
> * [pull_request_review](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_review)
> * [pull_request_review_comment](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_review_comment)
> * [pull_request_target](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_target)


## Usage

With defaults

```yaml
name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test changed-files
    steps:
      - uses: actions/checkout@v2
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v3.2
```


## Example

```yaml
...
    steps:
      - uses: actions/checkout@v2
      - name: Get changed files using defaults
        id: changed-files
        uses: tj-actions/changed-files@v3.2
      
      - name: Get changed files using a comma separator
        id: changed-files-comma
        uses: tj-actions/changed-files@v3.2
        with:
          separator: ","
       
      - name: List all added files
        run: |
          for file in "${{ steps.changed-files.outputs.added_files }}"; do
            echo $file
          done
          
      - name: Run step when a file changes in a PR relative to the default branch
        if: contains(steps.changed-files.outputs.modified_files, 'my-file.txt')
        run: |
            echo "Your file my-file.txt has been modified."

      - name: Run step when a file is deleted in a PR relative to the default branch
        if: contains(steps.changed-files.outputs.deleted_files, 'test.txt')
        run: |
            echo "Your test.txt has been deleted."
            
        
```


## Inputs

|   Input       |    type    |  required      |  default                      |  description  |
|:-------------:|:-----------:|:-------------:|:----------------------------:|:-------------:|
| separator         |  `string`   |    `true` |                          `' '` |  Separator to return outputs        |



## Outputs

Using the default separator.

|   Output             |    type      |  example                       |         description                      |
|:-------------------:|:------------:|:------------------------------:|:----------------------------------------:|
| added_files         |  `string`    |    'new.txt other.png ...'     |  Select only files that are Added (A)    |
| copied_files        |  `string`    |    'new.txt other.png ...'     |  Select only files that are Copied (C)   |
| deleted_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that are Deleted (D)  |
| modified_files      |  `string`    |    'new.txt other.png ...'     |  Select only files that are Modified (M) |
| renamed_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that are Renamed (R)  |
| changed_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that have their type changed (T) |
| unmerged_files      |  `string`    |    'new.txt other.png ...'     |  Select only files that are Unmerged (U) |
| unknown_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that are Unknown (X)  |
| all_changed_files   |  `string`    |    'new.txt other.png ...'     |  Select all paths (*) <br /> *i.e a combination of all options above.*  |
| all_modified_files   |  `string`    |    'new.txt other.png ...'     |  Select all modified files (*) <br /> *i.e a combination of all added, <br />copied and modified files (ACM).*  |


## Example

![Screen Shot 2021-04-02 at 9 06 04 AM](https://user-images.githubusercontent.com/17484350/113418057-b9fff600-9392-11eb-84e5-f5a91bfa8b11.png)



* Free software: [MIT license](LICENSE)


Features
--------
- Added Files
- Copied Files
- Deleted Files
- Modified Files
- Renamed Files
- Changed Files
- Unmerged Files
- Unknown Files
- All Changed Files


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
