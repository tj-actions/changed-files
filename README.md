changed-files
-------------

Get modified files

```yaml
...
    steps:
      - uses: actions/checkout@v2
      - name: Get modified files
        uses: tj-actions/changed-files@v1
```


## Inputs

|   Input       |    type    |  required      |  default                      |  description  |
|:-------------:|:-----------:|:-------------:|:----------------------------:|:-------------:|
| separator         |  `string`   |    `true` |                          ` ` |  Separator to return outputs        |



* Free software: [MIT license](LICENSE)

Features
--------

* TODO


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
