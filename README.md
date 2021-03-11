changed-files
-------------

Get modified files using [`git diff --diff-filter`](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---diff-filterACDMRTUXB82308203) to locate all files that have been modified relative to the default branch.


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
| all_changed_files   |  `string`    |    'new.txt other.png ...'     |  Select all paths (*) are selected if there <br/> is any file that matches other <br/> criteria in the comparison; <br/> if there is no file that <br/> matches other criteria, <br/> nothing is selected.  |


 # {
      #    added_files: ,
      #    copied_files: ,
      #    deleted_files: ,
      #    modified_files: .github/workflows/test.yml,HISTORY.md,action.yml,
      #    renamed_files: ,
      #    changed_files: ,
      #    unmerged_files: ,
      #    unknown_files: ,
      #    all_changed_files: 
      #  }

## Usage

```yaml
...
    steps:
      - uses: actions/checkout@v2
      - name: Get modified files with defaults
        id: changed-files
        uses: ./
      
      - name: Get modified files with comma separator
        id: changed-files-comma
        uses: ./
        with:
          separator: ","
```


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
