# Changelog

## [v9.3](https://github.com/tj-actions/changed-files/tree/v9.3) (2021-08-09)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v9.2...v9.3)

**Fixed bugs:**

- \[BUG\] `all_modified_files` show deleted files [\#155](https://github.com/tj-actions/changed-files/issues/155)
- \[BUG\] Dedupe the output list of changed files [\#151](https://github.com/tj-actions/changed-files/issues/151)

**Merged pull requests:**

- Remove deleted files from the all\_modified\_files output [\#156](https://github.com/tj-actions/changed-files/pull/156) ([jackton1](https://github.com/jackton1))
- Upgraded to v9.2 [\#154](https://github.com/tj-actions/changed-files/pull/154) ([jackton1](https://github.com/jackton1))

## [v9.2](https://github.com/tj-actions/changed-files/tree/v9.2) (2021-08-06)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v9.1...v9.2)

**Closed issues:**

- Dependency Dashboard [\#27](https://github.com/tj-actions/changed-files/issues/27)

**Merged pull requests:**

- Dedupe output file names. [\#153](https://github.com/tj-actions/changed-files/pull/153) ([jackton1](https://github.com/jackton1))
- Update tj-actions/branch-names action to v4.8 [\#152](https://github.com/tj-actions/changed-files/pull/152) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v9.1 [\#150](https://github.com/tj-actions/changed-files/pull/150) ([jackton1](https://github.com/jackton1))

## [v9.1](https://github.com/tj-actions/changed-files/tree/v9.1) (2021-07-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v9...v9.1)

**Implemented enhancements:**

- \[Feature\] any\_changed doesn't capture changes due to deleting files [\#148](https://github.com/tj-actions/changed-files/issues/148)

**Merged pull requests:**

- Detect deleted files via any\_changed output [\#149](https://github.com/tj-actions/changed-files/pull/149) ([jackton1](https://github.com/jackton1))
- Update reviewdog/action-shellcheck action to v1.7 [\#147](https://github.com/tj-actions/changed-files/pull/147) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v9 [\#146](https://github.com/tj-actions/changed-files/pull/146) ([jackton1](https://github.com/jackton1))

## [v9](https://github.com/tj-actions/changed-files/tree/v9) (2021-07-24)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.9...v9)

**Fixed bugs:**

- \[BUG\] \<any\_changed doesn't capture changes due to renaming files\> [\#144](https://github.com/tj-actions/changed-files/issues/144)

**Merged pull requests:**

- Update `any_changed` to include renamed files. [\#145](https://github.com/tj-actions/changed-files/pull/145) ([jackton1](https://github.com/jackton1))
- Update codacy/codacy-analysis-cli-action action to v4 [\#143](https://github.com/tj-actions/changed-files/pull/143) ([renovate[bot]](https://github.com/apps/renovate))
- Update codacy/codacy-analysis-cli-action action to v3 [\#142](https://github.com/tj-actions/changed-files/pull/142) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v8.9 [\#140](https://github.com/tj-actions/changed-files/pull/140) ([jackton1](https://github.com/jackton1))

## [v8.9](https://github.com/tj-actions/changed-files/tree/v8.9) (2021-07-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.8...v8.9)

**Merged pull requests:**

- Updated README.md [\#139](https://github.com/tj-actions/changed-files/pull/139) ([jackton1](https://github.com/jackton1))
- Upgraded to v8.8 [\#138](https://github.com/tj-actions/changed-files/pull/138) ([jackton1](https://github.com/jackton1))

## [v8.8](https://github.com/tj-actions/changed-files/tree/v8.8) (2021-07-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.7...v8.8)

**Implemented enhancements:**

- \[Feature\] Ability to run a workflow if and only if certain file/directory changes [\#124](https://github.com/tj-actions/changed-files/issues/124)

**Merged pull requests:**

- Added support for detecting non specific file changes. [\#137](https://github.com/tj-actions/changed-files/pull/137) ([jackton1](https://github.com/jackton1))
- Upgraded to v8.7 [\#136](https://github.com/tj-actions/changed-files/pull/136) ([jackton1](https://github.com/jackton1))

## [v8.7](https://github.com/tj-actions/changed-files/tree/v8.7) (2021-07-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.6...v8.7)

**Implemented enhancements:**

- \[Feature\] Get Changed files since last successful Action run [\#131](https://github.com/tj-actions/changed-files/issues/131)

**Merged pull requests:**

- Added support for a custom base sha. [\#135](https://github.com/tj-actions/changed-files/pull/135) ([jackton1](https://github.com/jackton1))
- Upgraded to v8.6 [\#134](https://github.com/tj-actions/changed-files/pull/134) ([jackton1](https://github.com/jackton1))

## [v8.6](https://github.com/tj-actions/changed-files/tree/v8.6) (2021-07-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.5...v8.6)

**Implemented enhancements:**

- \[Feature\] Get specific changed files reading a file [\#130](https://github.com/tj-actions/changed-files/issues/130)
- \[Feature\] Rename `files` -\> `paths` [\#125](https://github.com/tj-actions/changed-files/issues/125)

**Merged pull requests:**

- Updated README.md [\#133](https://github.com/tj-actions/changed-files/pull/133) ([jackton1](https://github.com/jackton1))
- Added support for retrieving the files input using a source file. [\#132](https://github.com/tj-actions/changed-files/pull/132) ([jackton1](https://github.com/jackton1))
- Upgraded to v8.5 [\#129](https://github.com/tj-actions/changed-files/pull/129) ([jackton1](https://github.com/jackton1))

## [v8.5](https://github.com/tj-actions/changed-files/tree/v8.5) (2021-07-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.4...v8.5)

**Merged pull requests:**

- Updated README.md [\#128](https://github.com/tj-actions/changed-files/pull/128) ([jackton1](https://github.com/jackton1))
- docs: add Kras4ooo as a contributor for code, doc [\#127](https://github.com/tj-actions/changed-files/pull/127) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Add custom source sha [\#126](https://github.com/tj-actions/changed-files/pull/126) ([Kras4ooo](https://github.com/Kras4ooo))
- Updated README.md [\#123](https://github.com/tj-actions/changed-files/pull/123) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#122](https://github.com/tj-actions/changed-files/pull/122) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#120](https://github.com/tj-actions/changed-files/pull/120) ([jackton1](https://github.com/jackton1))
- Upgraded to v8.4 [\#119](https://github.com/tj-actions/changed-files/pull/119) ([jackton1](https://github.com/jackton1))

## [v8.4](https://github.com/tj-actions/changed-files/tree/v8.4) (2021-06-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.3...v8.4)

**Merged pull requests:**

- Update reviewdog/action-shellcheck action to v1.6 [\#118](https://github.com/tj-actions/changed-files/pull/118) ([renovate[bot]](https://github.com/apps/renovate))
- Add message grouping [\#117](https://github.com/tj-actions/changed-files/pull/117) ([jackton1](https://github.com/jackton1))
- Upgraded to v8.3 [\#116](https://github.com/tj-actions/changed-files/pull/116) ([jackton1](https://github.com/jackton1))

## [v8.3](https://github.com/tj-actions/changed-files/tree/v8.3) (2021-06-25)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.2...v8.3)

**Merged pull requests:**

- Fixed empty branch name in debug message [\#115](https://github.com/tj-actions/changed-files/pull/115) ([jackton1](https://github.com/jackton1))
- Upgraded to v8.2 [\#114](https://github.com/tj-actions/changed-files/pull/114) ([jackton1](https://github.com/jackton1))

## [v8.2](https://github.com/tj-actions/changed-files/tree/v8.2) (2021-06-24)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8.1...v8.2)

**Merged pull requests:**

- Update arrow direction and added branch information [\#113](https://github.com/tj-actions/changed-files/pull/113) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#112](https://github.com/tj-actions/changed-files/pull/112) ([jackton1](https://github.com/jackton1))
- Update tj-actions/verify-changed-files action to v7 [\#111](https://github.com/tj-actions/changed-files/pull/111) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v8.1 [\#110](https://github.com/tj-actions/changed-files/pull/110) ([jackton1](https://github.com/jackton1))

## [v8.1](https://github.com/tj-actions/changed-files/tree/v8.1) (2021-06-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v8...v8.1)

**Closed issues:**

- Rename changed\_files -\> type\_changed\_files [\#105](https://github.com/tj-actions/changed-files/issues/105)

**Merged pull requests:**

- Rename changed\_files to type\_changed\_files [\#109](https://github.com/tj-actions/changed-files/pull/109) ([jackton1](https://github.com/jackton1))

## [v8](https://github.com/tj-actions/changed-files/tree/v8) (2021-06-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v7...v8)

**Closed issues:**

- support windows-latest [\#101](https://github.com/tj-actions/changed-files/issues/101)
- issues with failed getting changed files [\#100](https://github.com/tj-actions/changed-files/issues/100)

**Merged pull requests:**

- Fixed missing env variables [\#108](https://github.com/tj-actions/changed-files/pull/108) ([jackton1](https://github.com/jackton1))
- Add macos to test. [\#107](https://github.com/tj-actions/changed-files/pull/107) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#106](https://github.com/tj-actions/changed-files/pull/106) ([jackton1](https://github.com/jackton1))
- Upgraded to v8 [\#104](https://github.com/tj-actions/changed-files/pull/104) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#103](https://github.com/tj-actions/changed-files/pull/103) ([jackton1](https://github.com/jackton1))
- Add support for multiple platforms [\#102](https://github.com/tj-actions/changed-files/pull/102) ([jackton1](https://github.com/jackton1))
- Update alpine Docker tag to v3.14.0 [\#99](https://github.com/tj-actions/changed-files/pull/99) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#98](https://github.com/tj-actions/changed-files/pull/98) ([jackton1](https://github.com/jackton1))
- docs: add monoxgas as a contributor for code [\#97](https://github.com/tj-actions/changed-files/pull/97) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- docs: add jsoref as a contributor for doc [\#96](https://github.com/tj-actions/changed-files/pull/96) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Upgraded to v7 [\#94](https://github.com/tj-actions/changed-files/pull/94) ([jackton1](https://github.com/jackton1))

## [v7](https://github.com/tj-actions/changed-files/tree/v7) (2021-06-09)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v6.3...v7)

**Closed issues:**

- Request: Option to Output Whole File Path [\#88](https://github.com/tj-actions/changed-files/issues/88)

**Merged pull requests:**

- Clean up debug message [\#93](https://github.com/tj-actions/changed-files/pull/93) ([jackton1](https://github.com/jackton1))
- Make the changes between two commits more explicit [\#92](https://github.com/tj-actions/changed-files/pull/92) ([monoxgas](https://github.com/monoxgas))
- Updated README.md [\#91](https://github.com/tj-actions/changed-files/pull/91) ([jackton1](https://github.com/jackton1))
- Punctuation [\#90](https://github.com/tj-actions/changed-files/pull/90) ([jsoref](https://github.com/jsoref))
- Update README.md [\#89](https://github.com/tj-actions/changed-files/pull/89) ([jackton1](https://github.com/jackton1))
- Update tj-actions/sync-release-version action to v8.7 [\#86](https://github.com/tj-actions/changed-files/pull/86) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v6.3 [\#85](https://github.com/tj-actions/changed-files/pull/85) ([jackton1](https://github.com/jackton1))

## [v6.3](https://github.com/tj-actions/changed-files/tree/v6.3) (2021-05-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v6...v6.3)

## [v6](https://github.com/tj-actions/changed-files/tree/v6) (2021-05-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v6.2...v6)

**Merged pull requests:**

- Added usage link to warning message [\#84](https://github.com/tj-actions/changed-files/pull/84) ([jackton1](https://github.com/jackton1))
- Update pascalgn/automerge-action action to v0.14.2 [\#83](https://github.com/tj-actions/changed-files/pull/83) ([renovate[bot]](https://github.com/apps/renovate))
- Update README.md [\#82](https://github.com/tj-actions/changed-files/pull/82) ([jackton1](https://github.com/jackton1))

## [v6.2](https://github.com/tj-actions/changed-files/tree/v6.2) (2021-05-25)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v6.1...v6.2)

**Fixed bugs:**

- Fixed bug with trailing separator [\#74](https://github.com/tj-actions/changed-files/pull/74) ([jackton1](https://github.com/jackton1))

**Closed issues:**

- Should the Major Issue Version Point to the Latest Minor? [\#79](https://github.com/tj-actions/changed-files/issues/79)

**Merged pull requests:**

- Update test.yml [\#81](https://github.com/tj-actions/changed-files/pull/81) ([jackton1](https://github.com/jackton1))
- Bump peter-evans/create-pull-request from 3.9.2 to 3.10.0 [\#80](https://github.com/tj-actions/changed-files/pull/80) ([dependabot[bot]](https://github.com/apps/dependabot))
- Switch to a docker based action [\#78](https://github.com/tj-actions/changed-files/pull/78) ([jackton1](https://github.com/jackton1))
- Exit with error when HEAD sha is empty [\#77](https://github.com/tj-actions/changed-files/pull/77) ([jackton1](https://github.com/jackton1))
- Upgraded to v6.2 [\#76](https://github.com/tj-actions/changed-files/pull/76) ([jackton1](https://github.com/jackton1))
- Remove unused line [\#75](https://github.com/tj-actions/changed-files/pull/75) ([jackton1](https://github.com/jackton1))
- Update action.yml [\#73](https://github.com/tj-actions/changed-files/pull/73) ([jackton1](https://github.com/jackton1))
- Update README.md [\#72](https://github.com/tj-actions/changed-files/pull/72) ([jackton1](https://github.com/jackton1))
- Improve test coverage [\#71](https://github.com/tj-actions/changed-files/pull/71) ([jackton1](https://github.com/jackton1))
- Update action.yml [\#70](https://github.com/tj-actions/changed-files/pull/70) ([jackton1](https://github.com/jackton1))
- Upgraded to v6.1 [\#69](https://github.com/tj-actions/changed-files/pull/69) ([jackton1](https://github.com/jackton1))

## [v6.1](https://github.com/tj-actions/changed-files/tree/v6.1) (2021-05-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v5.3...v6.1)

**Fixed bugs:**

- \[BUG\] any\_changed reports true without matching changed files [\#67](https://github.com/tj-actions/changed-files/issues/67)

**Closed issues:**

- Improve test coverage [\#54](https://github.com/tj-actions/changed-files/issues/54)

**Merged pull requests:**

- Fixed bug with any\_changed boolean [\#68](https://github.com/tj-actions/changed-files/pull/68) ([jackton1](https://github.com/jackton1))
- Update cirrus-actions/rebase action to v1.5 [\#66](https://github.com/tj-actions/changed-files/pull/66) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v6 [\#64](https://github.com/tj-actions/changed-files/pull/64) ([jackton1](https://github.com/jackton1))
- Bump peter-evans/create-pull-request from 3.9.1 to 3.9.2 [\#63](https://github.com/tj-actions/changed-files/pull/63) ([dependabot[bot]](https://github.com/apps/dependabot))
- Deprecate all\_changed output. [\#62](https://github.com/tj-actions/changed-files/pull/62) ([jackton1](https://github.com/jackton1))
- Bump peter-evans/create-pull-request from 3 to 3.9.1 [\#61](https://github.com/tj-actions/changed-files/pull/61) ([dependabot[bot]](https://github.com/apps/dependabot))
- Bump actions/checkout from 2 to 2.3.4 [\#60](https://github.com/tj-actions/changed-files/pull/60) ([dependabot[bot]](https://github.com/apps/dependabot))
- Fixed typo [\#58](https://github.com/tj-actions/changed-files/pull/58) ([jackton1](https://github.com/jackton1))
- Upgraded to v5.3 [\#57](https://github.com/tj-actions/changed-files/pull/57) ([jackton1](https://github.com/jackton1))

## [v5.3](https://github.com/tj-actions/changed-files/tree/v5.3) (2021-05-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v5.2...v5.3)

**Merged pull requests:**

- Add warning message when the head sha is empty [\#56](https://github.com/tj-actions/changed-files/pull/56) ([jackton1](https://github.com/jackton1))
- Update tj-actions/sync-release-version action to v8.6 [\#55](https://github.com/tj-actions/changed-files/pull/55) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v5.2 [\#53](https://github.com/tj-actions/changed-files/pull/53) ([jackton1](https://github.com/jackton1))

## [v5.2](https://github.com/tj-actions/changed-files/tree/v5.2) (2021-05-06)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v5.1...v5.2)

**Implemented enhancements:**

- \[shellcheck\]: Resolve SC2001 [\#42](https://github.com/tj-actions/changed-files/issues/42)
- \[shellcheck\]: Resolve SC2128 [\#41](https://github.com/tj-actions/changed-files/issues/41)

**Merged pull requests:**

- Update tj-actions/github-changelog-generator action to v1.8 [\#52](https://github.com/tj-actions/changed-files/pull/52) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v5.1 [\#51](https://github.com/tj-actions/changed-files/pull/51) ([jackton1](https://github.com/jackton1))

## [v5.1](https://github.com/tj-actions/changed-files/tree/v5.1) (2021-05-01)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v5...v5.1)

**Merged pull requests:**

- Strip leading whitespaces [\#50](https://github.com/tj-actions/changed-files/pull/50) ([jackton1](https://github.com/jackton1))
- Upgraded to v5 [\#49](https://github.com/tj-actions/changed-files/pull/49) ([jackton1](https://github.com/jackton1))
- Update README.md [\#48](https://github.com/tj-actions/changed-files/pull/48) ([jackton1](https://github.com/jackton1))
- Upgraded to v5.3 [\#47](https://github.com/tj-actions/changed-files/pull/47) ([jackton1](https://github.com/jackton1))

## [v5](https://github.com/tj-actions/changed-files/tree/v5) (2021-05-01)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.4...v5)

**Merged pull requests:**

- Fixed bug with all\_changed when array is empty [\#46](https://github.com/tj-actions/changed-files/pull/46) ([jackton1](https://github.com/jackton1))
- Upgraded to v5.2 [\#45](https://github.com/tj-actions/changed-files/pull/45) ([jackton1](https://github.com/jackton1))
- Upgraded to v5.1 [\#44](https://github.com/tj-actions/changed-files/pull/44) ([jackton1](https://github.com/jackton1))
- Upgraded to v5 [\#43](https://github.com/tj-actions/changed-files/pull/43) ([jackton1](https://github.com/jackton1))
- Upgraded to v5 [\#40](https://github.com/tj-actions/changed-files/pull/40) ([jackton1](https://github.com/jackton1))
- Switch to using a bash script. [\#39](https://github.com/tj-actions/changed-files/pull/39) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.4 [\#38](https://github.com/tj-actions/changed-files/pull/38) ([jackton1](https://github.com/jackton1))

## [v4.4](https://github.com/tj-actions/changed-files/tree/v4.4) (2021-05-01)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.3...v4.4)

**Merged pull requests:**

- Update .gitignore [\#36](https://github.com/tj-actions/changed-files/pull/36) ([jackton1](https://github.com/jackton1))
- Add support for any changed file. [\#35](https://github.com/tj-actions/changed-files/pull/35) ([jackton1](https://github.com/jackton1))
- Update .gitignore [\#34](https://github.com/tj-actions/changed-files/pull/34) ([jackton1](https://github.com/jackton1))
- Renamed has\_changed to all\_changed [\#33](https://github.com/tj-actions/changed-files/pull/33) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.3 [\#32](https://github.com/tj-actions/changed-files/pull/32) ([jackton1](https://github.com/jackton1))

## [v4.3](https://github.com/tj-actions/changed-files/tree/v4.3) (2021-05-01)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.2...v4.3)

**Fixed bugs:**

- fatal error when using @v4.2 [\#28](https://github.com/tj-actions/changed-files/issues/28)

**Closed issues:**

- Add support for watching a subset of files. [\#20](https://github.com/tj-actions/changed-files/issues/20)

**Merged pull requests:**

- Add support to filter only specific files [\#31](https://github.com/tj-actions/changed-files/pull/31) ([jackton1](https://github.com/jackton1))
- Bump tj-actions/sync-release-version from v8 to v8.5 [\#30](https://github.com/tj-actions/changed-files/pull/30) ([dependabot[bot]](https://github.com/apps/dependabot))
- Upgrade to GitHub-native Dependabot [\#29](https://github.com/tj-actions/changed-files/pull/29) ([dependabot-preview[bot]](https://github.com/apps/dependabot-preview))
- Update tj-actions/github-changelog-generator action to v1.6 [\#26](https://github.com/tj-actions/changed-files/pull/26) ([renovate[bot]](https://github.com/apps/renovate))
- Update README.md [\#25](https://github.com/tj-actions/changed-files/pull/25) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.2 [\#24](https://github.com/tj-actions/changed-files/pull/24) ([jackton1](https://github.com/jackton1))

## [v4.2](https://github.com/tj-actions/changed-files/tree/v4.2) (2021-04-23)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.1...v4.2)

**Merged pull requests:**

- Upgraded to v4.1 [\#23](https://github.com/tj-actions/changed-files/pull/23) ([jackton1](https://github.com/jackton1))

## [v4.1](https://github.com/tj-actions/changed-files/tree/v4.1) (2021-04-23)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4...v4.1)

**Merged pull requests:**

- Upgraded to v4 [\#22](https://github.com/tj-actions/changed-files/pull/22) ([jackton1](https://github.com/jackton1))

## [v4](https://github.com/tj-actions/changed-files/tree/v4) (2021-04-23)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v3.3...v4)

**Implemented enhancements:**

- Feature request [\#15](https://github.com/tj-actions/changed-files/issues/15)
- Added support for push events [\#21](https://github.com/tj-actions/changed-files/pull/21) ([jackton1](https://github.com/jackton1))

**Merged pull requests:**

- Upgraded to v3.3 [\#19](https://github.com/tj-actions/changed-files/pull/19) ([jackton1](https://github.com/jackton1))

## [v3.3](https://github.com/tj-actions/changed-files/tree/v3.3) (2021-04-20)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v3.2...v3.3)

**Merged pull requests:**

- Update action.yml [\#18](https://github.com/tj-actions/changed-files/pull/18) ([jackton1](https://github.com/jackton1))
- Upgraded to v3.2 [\#17](https://github.com/tj-actions/changed-files/pull/17) ([jackton1](https://github.com/jackton1))

## [v3.2](https://github.com/tj-actions/changed-files/tree/v3.2) (2021-04-11)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v3.1...v3.2)

**Merged pull requests:**

- Add support for all modified files [\#16](https://github.com/tj-actions/changed-files/pull/16) ([jackton1](https://github.com/jackton1))
- Update test.yml [\#14](https://github.com/tj-actions/changed-files/pull/14) ([jackton1](https://github.com/jackton1))
- Upgraded to v3.1 [\#13](https://github.com/tj-actions/changed-files/pull/13) ([jackton1](https://github.com/jackton1))

## [v3.1](https://github.com/tj-actions/changed-files/tree/v3.1) (2021-04-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v3...v3.1)

**Merged pull requests:**

- Upgraded to v3 [\#12](https://github.com/tj-actions/changed-files/pull/12) ([jackton1](https://github.com/jackton1))

## [v3](https://github.com/tj-actions/changed-files/tree/v3) (2021-04-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v2.1...v3)

**Merged pull requests:**

- Update action.yml [\#11](https://github.com/tj-actions/changed-files/pull/11) ([jackton1](https://github.com/jackton1))
- Update README.md [\#10](https://github.com/tj-actions/changed-files/pull/10) ([jackton1](https://github.com/jackton1))
- Configure Renovate [\#9](https://github.com/tj-actions/changed-files/pull/9) ([renovate[bot]](https://github.com/apps/renovate))
- Update test.yml [\#8](https://github.com/tj-actions/changed-files/pull/8) ([jackton1](https://github.com/jackton1))
- Upgraded to v2.1 [\#6](https://github.com/tj-actions/changed-files/pull/6) ([jackton1](https://github.com/jackton1))

## [v2.1](https://github.com/tj-actions/changed-files/tree/v2.1) (2021-03-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v2...v2.1)

**Merged pull requests:**

- Upgraded to v2 [\#5](https://github.com/tj-actions/changed-files/pull/5) ([jackton1](https://github.com/jackton1))

## [v2](https://github.com/tj-actions/changed-files/tree/v2) (2021-03-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1...v2)

**Merged pull requests:**

- Fixed end of string with separator [\#4](https://github.com/tj-actions/changed-files/pull/4) ([jackton1](https://github.com/jackton1))

## [v1](https://github.com/tj-actions/changed-files/tree/v1) (2021-03-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/7eba13b12c69e63845b6d8bf1d3453edb0549ff9...v1)

**Merged pull requests:**

- Update action.yml [\#2](https://github.com/tj-actions/changed-files/pull/2) ([jackton1](https://github.com/jackton1))



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
