[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml) [![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml) <a href="https://github.com/search?q=tj-actions+changed-files+path%3A.github%2Fworkflows+language%3AYAML&type=code" target="_blank" title="Public workflows that use this action."><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-git-master.endbug.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue" alt="Public workflows that use this action."></a>

changed-files
-------------

Get all modified files relative to the default branch (`pull_request*` events) or last commit (`push` events).


## Features
- List all files that have changed
  - Between the current pull request branch and the default branch
  - Between the last commit and the current pushed change.
- List only a subset of files that can be used to detect changes.
- Report on a subset of files that have all change.
- Report on a subset of files that have at least one file change.
- Regex pattern matching on a subset of files.


## Outputs

Using the default separator.

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
| all_modified_files   |  `string`    |    'new.txt other.png ...'     |  Select all modified files <br /> *i.e a combination of all added, <br />copied and modified files (ACM).*  |
| all_changed          |  `string`     |     `true OR false`             |  Returns `true` only when the filenames provided using `files` input have all changed |
| all_changed_files   |  `string`    |    'new.txt other.png ...'     |  Select all paths (*) <br /> *i.e a combination of all options below.*  |
| added_files         |  `string`    |    'new.txt other.png ...'     |  Select only files that are Added (A)    |
| copied_files        |  `string`    |    'new.txt other.png ...'     |  Select only files that are Copied (C)   |
| deleted_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that are Deleted (D)  |
| modified_files      |  `string`    |    'new.txt other.png ...'     |  Select only files that are Modified (M) |
| renamed_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that are Renamed (R)  |
| changed_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that have their file type changed (T) |
| unmerged_files      |  `string`    |    'new.txt other.png ...'     |  Select only files that are Unmerged (U) |
| unknown_files       |  `string`    |    'new.txt other.png ...'     |  Select only files that are Unknown (X)  |


## Inputs

|   Input       |    type    |  required      |  default                      |  description  |
|:-------------:|:-----------:|:-------------:|:----------------------------:|:-------------:|
| separator         |  `string`   |    `true` |                          `' '` |  Separator to return outputs        |
| files         |  `string OR string[]`   |    `false` |                           |  Restricted list of specific files to watch for changes |


## Usage

> NOTE: :warning:
> * For `push` events to work you need to include `fetch-depth: 0` **OR** `fetch-depth: 2` depending on your use case.



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
  test:
    runs-on: ubuntu-latest
    name: Test changed-files
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # OR "2" -> To retrieve the preceding commit.
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v5.3
      
      - name: List all modified files
        run: |
          for file in "${{ steps.changed-files.outputs.all_modified_files }}"; do
            echo "$file was modified"
          done
```


## Example

```yaml
...
    steps:
      - uses: actions/checkout@v2
      - name: Get changed files using defaults
        id: changed-files
        uses: tj-actions/changed-files@v5.3
      
      - name: Get changed files using a comma separator
        id: changed-files-comma
        uses: tj-actions/changed-files@v5.3
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
        uses: tj-actions/changed-files@v5.3
        with:
          files: |
            my-file.txt
            test.txt
            new.txt
            test_directory
            .(py|jpeg)$   
            .(sql)$
            ^(mynewfile|custom)

       - name: Run step if all files listed above have changed
         if: steps.changed-files-specific.outputs.all_changed == 'true'
         run: |
           echo "Both my-file.txt and test.txt have changed."
        
       - name: Run step if any of the listed files above change
         if: steps.changed-files-specific.outputs.any_changed == 'true'
         run: |
           echo "Either my-file.txt or test.txt have changed."
        
```

### Running [pre-commit](https://pre-commit.com/) on all modified files

```yaml
...
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # otherwise, you will fail to push refs to dest repo
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v5.3

      - name: Pre-commit
        uses: pre-commit/action@v2.0.0
        with:
          extra_args: -v --hook-stage push --files ${{ steps.changed-files.outputs.all_modified_files }}
          token: ${{ secrets.github_token }}
```




## Example

![Screen Shot 2021-04-02 at 9 06 04 AM](https://user-images.githubusercontent.com/17484350/113418057-b9fff600-9392-11eb-84e5-f5a91bfa8b11.png)



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
