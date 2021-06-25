[![CI](https://github.com/tj-actions/changed-files/actions/workflows/test.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/test.yml) [![Update release version.](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml/badge.svg)](https://github.com/tj-actions/changed-files/actions/workflows/sync-release-version.yml) [![Public workflows that use this action.](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-endbug.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dtj-actions%2Fchanged-files%26badge%3Dtrue)](https://github.com/search?o=desc\&q=tj-actions+changed-files+language%3AYAML\&s=\&type=Code)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

## changed-files

Retrieve all changed files relative to the default branch (`pull_request*` based events) or a previous commit (`push` based event) returning the **absolute path** to all changed files from the project root.

## Features

*   Boolean output indicating that certain files have been modified.
*   List all files that have changed.
    *   Between the current pull request branch and the default branch.
    *   Between the last commit and the current pushed change.
*   Restrict change detection to a subset of files.
    *   Report on files that have at least one change.
    *   [Regex pattern](https://www.gnu.org/software/grep/manual/grep.html#Regular-Expressions) matching on a subset of files.

## Supported Platforms

*   [`ubuntu-*`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
*   [`macos-*`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)
*   [`windows-*`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on)

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
        uses: tj-actions/changed-files@v8.2
      
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
| any_changed          |  `string`    |  `true` OR `false`                 |  Returns `true` when any of the filenames provided using the `files` input has changed |
| all_modified_files   |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select all modified files <br /> i.e. *a combination of all added, <br />copied and modified files (ACM).*  |
| all_changed_files    |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select all paths (\*) <br /> i.e. *a combination of all options below.*  |
| added_files          |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Added (A)    |
| copied_files         |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Copied (C)   |
| deleted_files        |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Deleted (D)  |
| modified_files       |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Modified (M) |
| renamed_files        |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Renamed (R)  |
| type_changed_files   |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that have their file type changed (T) |
| unmerged_files       |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Unmerged (U) |
| unknown_files        |  `string`    |  `'new.txt path/to/file.png ...'`  |  Select only files that are Unknown (X)  |

## Inputs

|   Input       |    type    |  required      |  default                      |  description  |
|:-------------:|:-----------:|:-------------:|:-----------------------------:|:-------------:|
| token         |  `string`   |    `false`    | `${{ github.token }}`         | [GITHUB_TOKEN](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow#using-the-github_token-in-a-workflow) <br /> or a repo scoped <br /> [Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)              |
| separator     |  `string`   |    `true`     | `' '`                         |  Output string separator   |
| files         |  `string` OR `string[]` |   `false`  |                      | Check for changes  <br> using only this list of files <br> (Defaults to the entire repo) |

## Example

```yaml
...
    steps:
      - uses: actions/checkout@v2

      - name: Get changed files using defaults
        id: changed-files
        uses: tj-actions/changed-files@v8.2
      
      - name: Get changed files using a comma separator
        id: changed-files-comma
        uses: tj-actions/changed-files@v8.2
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
        uses: tj-actions/changed-files@v8.2
        with:
          files: |
            my-file.txt
            test.txt
            new.txt
            test_directory
            .(png|jpeg)$   
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
        uses: tj-actions/changed-files@v8.2

      - name: Pre-commit
        uses: pre-commit/action@v2.0.0
        with:
          extra_args: -v --hook-stage push --files ${{ steps.changed-files.outputs.all_modified_files }}
          token: ${{ secrets.github_token }}
```

## Example

![Screen Shot 2021-05-13 at 4 55 30 PM](https://user-images.githubusercontent.com/17484350/118186772-1cc1c400-b40c-11eb-8fe8-b651e674ce96.png)

![Screen Shot 2021-05-21 at 8 38 31 AM](https://user-images.githubusercontent.com/17484350/119138539-fc979380-ba0f-11eb-802c-6e403faac300.png)

![Screen Shot 2021-06-03 at 7 01 57 AM](https://user-images.githubusercontent.com/17484350/120634754-9f510880-c439-11eb-9e7b-5184bd8f7939.png)

*   Free software: [MIT license](LICENSE)

If you feel generous and want to show some extra appreciation:

[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

[buymeacoffee]: https://www.buymeacoffee.com/jackton1

[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png

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
  </tr>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
