[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml) [![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/a3822d6c37f644bc99a5faa0bfb9c2c1)](https://www.codacy.com/gh/tj-actions/changed-files/dashboard?utm\_source=github.com\&utm\_medium=referral\&utm\_content=tj-actions/changed-files\&utm\_campaign=Badge\_Grade) [![Public workflows that use this action.](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-tj-actions1.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue)](https://github.com/search?o=desc\&q=tj-actions+changed-files+language%3AYAML\&s=\&type=Code)

[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?logo=ubuntu\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob\_idruns-on)
[![Mac OS](https://img.shields.io/badge/mac%20os-000000?logo=macos\&logoColor=F0F0F0)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob\_idruns-on)
[![Windows](https://img.shields.io/badge/Windows-0078D6?logo=windows\&logoColor=white)](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob\_idruns-on)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## changed-files

Retrieve all changed files relative to the default branch (`pull_request*` based events) or a previous commit (`push` based event) returning the **absolute path** to all changed files from the project root.

## Features

*   Fast execution (0-2 seconds on average).
*   Easy to debug.
*   Boolean output indicating that certain files have been modified.
*   Multiple repository support.
*   List all files that have changed.
    *   Between the current pull request branch and the default branch.
    *   Between the last commit and the current pushed change.
*   Restrict change detection to a subset of files.
    *   Report on files that have at least one change.
    *   [Regex pattern](https://www.gnu.org/software/grep/manual/grep.html#Regular-Expressions) matching on a subset of files.

## Usage

> NOTE: :warning:
>
> *   **IMPORTANT:** For `push` events you need to include `fetch-depth: 0` **OR** `fetch-depth: 2` depending on your use case.
> *   When using `persist-credentials: false` with `actions/checkout@v2` you'll need to specify a `token` using the `token` input.

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
    runs-on: ubuntu-latest  # windows-latest | macos-latest
    name: Test changed-files
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # OR "2" -> To retrieve the preceding commit.

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v10.1

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
| M         | Modified     |
| D         | Deleted      |
| R         | Renamed      |
| T         | Type changed |
| U         | Unmerged     |
| X         | Unknown      |

|   Output             |    type      |  example                           |         description                      |
|:--------------------:|:------------:|:----------------------------------:|:----------------------------------------:|
| any\_changed          |  `string`    |  `true` OR `false`                 | Returns `true` when any <br /> of the filenames provided using <br /> the `files` input has changed. <br /> i.e. *using a combination of all added, <br />copied, modified and renamed files (ACMR)* |
| only\_changed          |  `string`    |  `true` OR `false`                 | Returns `true` when only <br /> files provided using <br /> the `files` input have changed. (ACMR) |
| other\_changed\_files   |  `string`    |  `'new.txt path/to/file.png ...'`  | Select all other changed files <br/> not listed in the files input <br /> i.e. *a  combination of all added, <br /> copied and modified files (ACMR)*  |
| any\_deleted          |  `string`    |  `true` OR `false`                 | Returns `true` when any <br /> of the filenames provided using <br /> the `files` input has been deleted. (D) |
| only\_deleted          |  `string`    |  `true` OR `false`                 | Returns `true` when only <br /> files provided using <br /> the `files` input has been deleted. (D) |
| other\_deleted\_files   |  `string`    |  `'new.txt path/to/file.png ...'`  | Select all other deleted files <br/> not listed in the files input <br /> i.e. *a  combination of all deleted files (D)*  |
| all\_modified\_files   |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select all modified files <br /> i.e. *a combination of all added, <br />copied, modified and renamed files (ACMR)*  |
| all\_changed\_and\_modified\_files    |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select all changed <br /> and modified files <br /> i.e. *a combination of (ACMRDTUX)*  |
| added\_files          |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Added (A)    |
| copied\_files         |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Copied (C)   |
| deleted\_files        |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Deleted (D)  |
| modified\_files       |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Modified (M) |
| renamed\_files        |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Renamed (R)  |
| type\_changed\_files   |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that have their file type changed (T) |
| unmerged\_files       |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Unmerged (U) |
| unknown\_files        |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Unknown (X)  |

## Inputs

|   Input       |    type    |  required      |  default                      |  description  |
|:-------------:|:-----------:|:-------------:|:-----------------------------:|:-------------:|
| token         |  `string`   |    `false`    | `${{ github.token }}`         | [GITHUB\_TOKEN](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow#using-the-github\_token-in-a-workflow) <br /> or a repo scoped <br /> [Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)              |
| separator     |  `string`   |    `true`     | `' '`                         |  Output string separator   |
| files         |  `string` OR `string[]` |   `false`  |                      | Check for changes  <br> using only these <br> list of file(s) <br> (Defaults to the <br> entire repo) |
| base\_sha           |  `string`      |    `false`     |                     | Specify a different <br> base commit SHA <br> used for <br> comparing changes  |
| sha           |  `string`      |    `true`     | `${{ github.sha }}`           | Specify a different <br> commit SHA <br> used for <br> comparing changes  |
| files\_from\_source\_file |  `string`      |    `false`     |                    | Source file <br> used to populate <br> the files input |
| path | `string` | `false` |  | Relative path under <br> `GITHUB_WORKSPACE` <br> to the repository |

## Example

```yaml
...
    steps:
      - uses: actions/checkout@v2

      - name: Get changed files using defaults
        id: changed-files
        uses: tj-actions/changed-files@v10.1

      - name: Get changed files using a comma separator
        id: changed-files-comma
        uses: tj-actions/changed-files@v10.1
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
          echo "Your my-file.txt file has been modified."

      - name: Run step when a file has been deleted
        if: contains(steps.changed-files.outputs.deleted_files, 'test.txt')
        run: |
          echo "Your test.txt file has been deleted."

      - name: Get specific changed files
        id: changed-files-specific
        uses: tj-actions/changed-files@v10.1
        with:
          files: |
            my-file.txt
            test.txt
            new.txt
            test_directory
            \.sh$
            .(png|jpeg)$
            .(sql|py)$
            ^(mynewfile|custom)

      - name: Run step if any of the listed files above change
        if: steps.changed-files-specific.outputs.any_changed == 'true'
        run: |
          echo "One or more files listed above has changed."

      - name: Run step if only the files listed above change
        if: steps.changed-files-specific.outputs.only_changed == 'true'
        run: |
          echo "Only files listed above have changed."

      - name: Run step if any of the listed files above is deleted
        if: steps.changed-files.outputs.any_deleted == "true"
        run: |
          for file in "${{ steps.changed-files.outputs.deleted_files }}"; do
            echo "$file was deleted"
          done

      - name: Run step if all listed files above have been deleted
        if: steps.changed-files.outputs.only_deleted == "true"
        run: |
          for file in "${{ steps.changed-files.outputs.deleted_files }}"; do
            echo "$file was deleted"
          done

      - name: Use a source file or list of file(s) to populate to files input.
        id: changed-files-specific-source-file
        uses: tj-actions/changed-files@v10.1
        with:
          files_from_source_file: |
            test/changed-files-list.txt

      - name: Use a source file or list of file(s) to populate to files input and optionally specify more files.
        id: changed-files-specific-source-file-and-specify-files
        uses: tj-actions/changed-files@v10.1
        with:
          files_from_source_file: |
            test/changed-files-list.txt
          files: |
            test.txt

      - name: Use a different commit SHA
        id: changed-files-custom-sha
        uses: tj-actions/changed-files@v10.1
        with:
          sha: ${{ github.event.pull_request.head.sha }}

      - name: Use a different base SHA
        id: changed-files-custom-base-sha
        uses: tj-actions/changed-files@v10.1
        with:
          base_sha: "2096ed0"
          
      - name: Checkout into dir1
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
          path: dir1

      - name: Run changed-files with defaults on the dir1
        id: changed-files-for-dir1
        uses: tj-actions/changed-files@v10.1
        with:
          path: dir1

      - name: List all added files in dir1
        run: |
          for file in "${{ steps.changed-files-for-dir1.outputs.added_files }}"; do
            echo "$file was added"
          done
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
        uses: tj-actions/changed-files@v10.1

      - name: Pre-commit
        uses: pre-commit/action@v2.0.0
        with:
          extra_args: -v --hook-stage push --files ${{ steps.changed-files.outputs.all_modified_files }}
          token: ${{ secrets.github_token }}
```

![Screen Shot 2021-07-06 at 2 50 23 PM](https://user-images.githubusercontent.com/17484350/124651978-96ed5280-de69-11eb-86d5-396a4c1a980f.png)

![Screen Shot 2021-07-17 at 10 52 48 AM](https://user-images.githubusercontent.com/17484350/126040772-30b65afb-a6b5-4150-b312-ac2017ba7b98.png)

*   Free software: [MIT license](LICENSE)

If you feel generous and want to show some extra appreciation:

Support me with a :star:

[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

## Credits

This package was created with [Cookiecutter](https://github.com/cookiecutter/cookiecutter).

## Report Bugs

Report bugs at https://github.com/tj-actions/changed-files/issues.

If you are reporting a bug, please include:

*   Your operating system name and version.
*   Any details about your workflow that might be helpful in troubleshooting.
*   Detailed steps to reproduce the bug.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jsoref"><img src="https://avatars.githubusercontent.com/u/2119212?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Josh Soref</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=jsoref" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/monoxgas"><img src="https://avatars.githubusercontent.com/u/1223016?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nick Landers</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=monoxgas" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Kras4ooo"><img src="https://avatars.githubusercontent.com/u/1948054?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Krasimir Nikolov</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=Kras4ooo" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=Kras4ooo" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/IvanPizhenko"><img src="https://avatars.githubusercontent.com/u/11859904?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ivan Pizhenko</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=IvanPizhenko" title="Code">💻</a> <a href="https://github.com/tj-actions/changed-files/commits?author=IvanPizhenko" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/talva-tr"><img src="https://avatars.githubusercontent.com/u/82046981?v=4?s=100" width="100px;" alt=""/><br /><sub><b>talva-tr</b></sub></a><br /><a href="https://github.com/tj-actions/changed-files/commits?author=talva-tr" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[buymeacoffee]: https://www.buymeacoffee.com/jackton1

[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
