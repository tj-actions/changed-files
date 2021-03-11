changed-files
-------------

Get modified files using [`git diff --diff-filter`](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---diff-filterACDMRTUXB82308203) to locate all files that have been modified relative to the default branch.

```yaml
...
    steps:
      - uses: actions/checkout@v2
      - name: Get modified files with defaults
        id: changed-files
        uses: ./
      - name: Show output
        run: |
          echo "${{ toJSON(steps.changed-files.outputs) }}"
      
      # Outputs:
      # {
      #    added_files: ,
      #    copied_files: ,
      #    deleted_files: ,
      #    modified_files: .github/workflows/test.yml HISTORY.md action.yml,
      #    renamed_files: ,
      #    changed_files: ,
      #    unmerged_files: ,
      #    unknown_files: ,
      #    all_changed_files: 
      #  }
      
      - name: Get modified files with comma separator
        id: changed-files-comma
        uses: ./
        with:
          separator: ","
      - name: Show output
        run: |
          echo "${{ toJSON(steps.changed-files-comma.outputs) }}"

      # Outputs:
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
```


## Inputs

|   Input       |    type    |  required      |  default                      |  description  |
|:-------------:|:-----------:|:-------------:|:----------------------------:|:-------------:|
| separator         |  `string`   |    `true` |                          `' '` |  Separator to return outputs        |



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
