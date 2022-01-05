# Changelog

## [v3.0.0](https://github.com/tj-actions/changed-files/tree/v3.0.0) (2022-01-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v13...v3.0.0)

**Merged pull requests:**

- Upgraded to v13 [\#307](https://github.com/tj-actions/changed-files/pull/307) ([jackton1](https://github.com/jackton1))

## [v13](https://github.com/tj-actions/changed-files/tree/v13) (2022-01-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v2.0.1...v13)

**Implemented enhancements:**

- \[Feature\] Make it easier to exclude files [\#265](https://github.com/tj-actions/changed-files/issues/265)
- \[Feature\] Support the same filter syntax as GitHub Workflows [\#264](https://github.com/tj-actions/changed-files/issues/264)

**Closed issues:**

- Dependency Dashboard [\#27](https://github.com/tj-actions/changed-files/issues/27)

**Merged pull requests:**

- Upgraded tj-actions/glob to v3.2 [\#306](https://github.com/tj-actions/changed-files/pull/306) ([jackton1](https://github.com/jackton1))
- Update tj-actions/remark action to v2.3 [\#305](https://github.com/tj-actions/changed-files/pull/305) ([renovate[bot]](https://github.com/apps/renovate))
- Add support for using github's glob pattern syntax [\#304](https://github.com/tj-actions/changed-files/pull/304) ([jackton1](https://github.com/jackton1))
- Update tj-actions/remark action to v2 [\#302](https://github.com/tj-actions/changed-files/pull/302) ([renovate[bot]](https://github.com/apps/renovate))
- Bump tj-actions/github-changelog-generator from 1.10 to 1.11 [\#300](https://github.com/tj-actions/changed-files/pull/300) ([dependabot[bot]](https://github.com/apps/dependabot))
- Update tj-actions/github-changelog-generator action to v1.10 [\#299](https://github.com/tj-actions/changed-files/pull/299) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v2.0.1 [\#298](https://github.com/tj-actions/changed-files/pull/298) ([jackton1](https://github.com/jackton1))
- Upgraded to v12.2 [\#297](https://github.com/tj-actions/changed-files/pull/297) ([jackton1](https://github.com/jackton1))

## [v2.0.1](https://github.com/tj-actions/changed-files/tree/v2.0.1) (2021-12-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v12.2...v2.0.1)

## [v12.2](https://github.com/tj-actions/changed-files/tree/v12.2) (2021-12-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v12.1...v12.2)

**Merged pull requests:**

- Fixed unbound variable warnings [\#296](https://github.com/tj-actions/changed-files/pull/296) ([jackton1](https://github.com/jackton1))
- Upgraded to v12.1 [\#295](https://github.com/tj-actions/changed-files/pull/295) ([jackton1](https://github.com/jackton1))

## [v12.1](https://github.com/tj-actions/changed-files/tree/v12.1) (2021-12-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v2.0.0...v12.1)

**Fixed bugs:**

- \[BUG\] The `other_modified_files` contains all modified files even those that match the file `filter`. [\#293](https://github.com/tj-actions/changed-files/issues/293)
- \[BUG\] The `only_modified` is evaluated to `true` even when `other_modified_files` is not empty. [\#292](https://github.com/tj-actions/changed-files/issues/292)

**Merged pull requests:**

- Fixed regression bug with other\_modified and other\_changed outputs [\#294](https://github.com/tj-actions/changed-files/pull/294) ([jackton1](https://github.com/jackton1))
- Update reviewdog/action-shellcheck action to v1.13 [\#291](https://github.com/tj-actions/changed-files/pull/291) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v2.0.0 [\#290](https://github.com/tj-actions/changed-files/pull/290) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#289](https://github.com/tj-actions/changed-files/pull/289) ([jackton1](https://github.com/jackton1))

## [v2.0.0](https://github.com/tj-actions/changed-files/tree/v2.0.0) (2021-12-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v12...v2.0.0)

**Fixed bugs:**

- \[BUG\] Files input doesn't work when running with `act` [\#251](https://github.com/tj-actions/changed-files/issues/251)

**Closed issues:**

- Breaking changes in patch updates? [\#288](https://github.com/tj-actions/changed-files/issues/288)

**Merged pull requests:**

- Upgraded to v12 [\#287](https://github.com/tj-actions/changed-files/pull/287) ([jackton1](https://github.com/jackton1))

## [v12](https://github.com/tj-actions/changed-files/tree/v12) (2021-12-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.9...v12)

**Implemented enhancements:**

- \[Feature\] Add "any\_modified", "other\_modified\_files" and "all\_modified" outputs containing created, edit, renamed, or deleted files [\#282](https://github.com/tj-actions/changed-files/issues/282)

**Fixed bugs:**

- \[BUG\] Failed to get change files on pull\_request merge event [\#281](https://github.com/tj-actions/changed-files/issues/281)

**Merged pull requests:**

- Upgraded to v1.1.4 [\#286](https://github.com/tj-actions/changed-files/pull/286) ([jackton1](https://github.com/jackton1))
- \[PR 2\]: Added support for listing all\_modified\_files. [\#285](https://github.com/tj-actions/changed-files/pull/285) ([jackton1](https://github.com/jackton1))
- Update peter-evans/create-pull-request action to v3.12.0 [\#284](https://github.com/tj-actions/changed-files/pull/284) ([renovate[bot]](https://github.com/apps/renovate))
- \[PR 1\]: Renamed all\_modified\_files to all\_changed\_files [\#283](https://github.com/tj-actions/changed-files/pull/283) ([jackton1](https://github.com/jackton1))
- Upgraded to v11.9 [\#280](https://github.com/tj-actions/changed-files/pull/280) ([jackton1](https://github.com/jackton1))

## [v11.9](https://github.com/tj-actions/changed-files/tree/v11.9) (2021-12-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.3.1...v11.9)

**Implemented enhancements:**

- Can't get `since_last_remote_commit` to work properly on pull\_request event [\#276](https://github.com/tj-actions/changed-files/issues/276)

**Merged pull requests:**

- Upgraded to v1.3.1 [\#279](https://github.com/tj-actions/changed-files/pull/279) ([jackton1](https://github.com/jackton1))

## [v1.3.1](https://github.com/tj-actions/changed-files/tree/v1.3.1) (2021-12-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.8...v1.3.1)

**Merged pull requests:**

- Fixed regression bug with base\_sha for pull\_request [\#278](https://github.com/tj-actions/changed-files/pull/278) ([jackton1](https://github.com/jackton1))
- Prevent outputting remote not found error message. [\#277](https://github.com/tj-actions/changed-files/pull/277) ([jackton1](https://github.com/jackton1))
- Upgraded to v11.8 [\#275](https://github.com/tj-actions/changed-files/pull/275) ([jackton1](https://github.com/jackton1))

## [v11.8](https://github.com/tj-actions/changed-files/tree/v11.8) (2021-12-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.3.0...v11.8)

**Merged pull requests:**

- Upgraded to v1.3.0 [\#274](https://github.com/tj-actions/changed-files/pull/274) ([jackton1](https://github.com/jackton1))

## [v1.3.0](https://github.com/tj-actions/changed-files/tree/v1.3.0) (2021-12-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.7...v1.3.0)

**Implemented enhancements:**

- \[Feature\] Improve error handling of non local commit reference [\#255](https://github.com/tj-actions/changed-files/issues/255)

**Fixed bugs:**

- \[BUG\] When running in a workflow generated by a dependabot BUMP PR, the action fails [\#268](https://github.com/tj-actions/changed-files/issues/268)

**Closed issues:**

- Fix code scanning alert - Warn when duplicate definitions are found. [\#267](https://github.com/tj-actions/changed-files/issues/267)

**Merged pull requests:**

- Resolve error setting the base sha [\#272](https://github.com/tj-actions/changed-files/pull/272) ([jackton1](https://github.com/jackton1))
- Fixed error with test [\#270](https://github.com/tj-actions/changed-files/pull/270) ([jackton1](https://github.com/jackton1))
- Resolve error adding remote [\#269](https://github.com/tj-actions/changed-files/pull/269) ([jackton1](https://github.com/jackton1))
- Update base sha step [\#266](https://github.com/tj-actions/changed-files/pull/266) ([jackton1](https://github.com/jackton1))
- Improve error handling [\#263](https://github.com/tj-actions/changed-files/pull/263) ([jackton1](https://github.com/jackton1))
- Update README.md [\#262](https://github.com/tj-actions/changed-files/pull/262) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#260](https://github.com/tj-actions/changed-files/pull/260) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#258](https://github.com/tj-actions/changed-files/pull/258) ([jackton1](https://github.com/jackton1))
- Upgraded to v11.7 [\#257](https://github.com/tj-actions/changed-files/pull/257) ([jackton1](https://github.com/jackton1))

## [v11.7](https://github.com/tj-actions/changed-files/tree/v11.7) (2021-11-19)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.2.2...v11.7)

**Merged pull requests:**

- Upgraded to v1.2.2 [\#256](https://github.com/tj-actions/changed-files/pull/256) ([jackton1](https://github.com/jackton1))

## [v1.2.2](https://github.com/tj-actions/changed-files/tree/v1.2.2) (2021-11-19)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.6...v1.2.2)

**Fixed bugs:**

- \[BUG\] pull request with `since_last_remote_commit = true` returns fatal: bad object [\#253](https://github.com/tj-actions/changed-files/issues/253)

**Merged pull requests:**

- Updated git fetch to pull the last remote commit [\#254](https://github.com/tj-actions/changed-files/pull/254) ([jackton1](https://github.com/jackton1))
- Update reviewdog/action-shellcheck action to v1.12 [\#252](https://github.com/tj-actions/changed-files/pull/252) ([renovate[bot]](https://github.com/apps/renovate))
- Update reviewdog/action-shellcheck action to v1.11 [\#250](https://github.com/tj-actions/changed-files/pull/250) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v11.6 [\#249](https://github.com/tj-actions/changed-files/pull/249) ([jackton1](https://github.com/jackton1))

## [v11.6](https://github.com/tj-actions/changed-files/tree/v11.6) (2021-11-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.2.1...v11.6)

**Merged pull requests:**

- Upgraded to v1.2.1 [\#248](https://github.com/tj-actions/changed-files/pull/248) ([jackton1](https://github.com/jackton1))

## [v1.2.1](https://github.com/tj-actions/changed-files/tree/v1.2.1) (2021-11-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.5...v1.2.1)

**Implemented enhancements:**

- \[Feature\] Improve documentation [\#244](https://github.com/tj-actions/changed-files/issues/244)

**Merged pull requests:**

- Updated formatting of all modified debug message [\#247](https://github.com/tj-actions/changed-files/pull/247) ([jackton1](https://github.com/jackton1))
- Update reviewdog/action-shellcheck action to v1.10 [\#246](https://github.com/tj-actions/changed-files/pull/246) ([renovate[bot]](https://github.com/apps/renovate))
- Update peter-evans/create-pull-request action to v3.11.0 [\#245](https://github.com/tj-actions/changed-files/pull/245) ([renovate[bot]](https://github.com/apps/renovate))
- Update actions/checkout action to v2.4.0 [\#243](https://github.com/tj-actions/changed-files/pull/243) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v11.5 [\#241](https://github.com/tj-actions/changed-files/pull/241) ([jackton1](https://github.com/jackton1))

## [v11.5](https://github.com/tj-actions/changed-files/tree/v11.5) (2021-10-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.2.0...v11.5)

## [v1.2.0](https://github.com/tj-actions/changed-files/tree/v1.2.0) (2021-10-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.4...v1.2.0)

**Merged pull requests:**

- Upgraded to v11.4 [\#239](https://github.com/tj-actions/changed-files/pull/239) ([jackton1](https://github.com/jackton1))

## [v11.4](https://github.com/tj-actions/changed-files/tree/v11.4) (2021-10-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.3...v11.4)

**Implemented enhancements:**

- \[Feature\] Get changed files in all commits in push [\#234](https://github.com/tj-actions/changed-files/issues/234)

**Merged pull requests:**

- Updated README.md [\#238](https://github.com/tj-actions/changed-files/pull/238) ([jackton1](https://github.com/jackton1))
- Revert "Update base\_sha to use the last commit on the current branch for push event" [\#237](https://github.com/tj-actions/changed-files/pull/237) ([jackton1](https://github.com/jackton1))
- Support retrieving changed files between the last remote commit and the current HEAD for push events [\#236](https://github.com/tj-actions/changed-files/pull/236) ([jackton1](https://github.com/jackton1))
- Update base\_sha to use the last commit on the current branch for push event [\#235](https://github.com/tj-actions/changed-files/pull/235) ([jackton1](https://github.com/jackton1))
- Upgraded to v11.3 [\#233](https://github.com/tj-actions/changed-files/pull/233) ([jackton1](https://github.com/jackton1))

## [v11.3](https://github.com/tj-actions/changed-files/tree/v11.3) (2021-10-27)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.2...v11.3)

**Fixed bugs:**

- \[BUG\] Changed files not working on self hosted runners [\#227](https://github.com/tj-actions/changed-files/issues/227)

**Merged pull requests:**

- \[Security\]: Prevent persisting the remote when there are errors [\#232](https://github.com/tj-actions/changed-files/pull/232) ([jackton1](https://github.com/jackton1))
- Upgraded to v11.2 [\#231](https://github.com/tj-actions/changed-files/pull/231) ([jackton1](https://github.com/jackton1))

## [v11.2](https://github.com/tj-actions/changed-files/tree/v11.2) (2021-10-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.1...v11.2)

**Implemented enhancements:**

- \[Feature\] fetch HEAD without tags [\#220](https://github.com/tj-actions/changed-files/issues/220)

**Merged pull requests:**

- Resolved bug with already existing remote [\#230](https://github.com/tj-actions/changed-files/pull/230) ([jackton1](https://github.com/jackton1))
- Revert "bug/fix error with already existing remote" [\#229](https://github.com/tj-actions/changed-files/pull/229) ([jackton1](https://github.com/jackton1))
- bug/fix error with already existing remote [\#228](https://github.com/tj-actions/changed-files/pull/228) ([jackton1](https://github.com/jackton1))
- Upgraded to v11.1 [\#226](https://github.com/tj-actions/changed-files/pull/226) ([jackton1](https://github.com/jackton1))

## [v11.1](https://github.com/tj-actions/changed-files/tree/v11.1) (2021-10-25)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11...v11.1)

**Closed issues:**

- \[BUG\] not able to find only python files [\#224](https://github.com/tj-actions/changed-files/issues/224)

**Merged pull requests:**

- Disable automatic tag following [\#225](https://github.com/tj-actions/changed-files/pull/225) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#223](https://github.com/tj-actions/changed-files/pull/223) ([jackton1](https://github.com/jackton1))
- Upgraded to v11 [\#222](https://github.com/tj-actions/changed-files/pull/222) ([jackton1](https://github.com/jackton1))

## [v11](https://github.com/tj-actions/changed-files/tree/v11) (2021-10-23)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v10.1...v11)

**Fixed bugs:**

- \[BUG\] Spaces in file names are not handled correctly [\#216](https://github.com/tj-actions/changed-files/issues/216)
- \[BUG\] Usage of quotes around array items  [\#208](https://github.com/tj-actions/changed-files/issues/208)

**Merged pull requests:**

- Updated README.md [\#221](https://github.com/tj-actions/changed-files/pull/221) ([jackton1](https://github.com/jackton1))
- Miscellaneous code cleanup [\#219](https://github.com/tj-actions/changed-files/pull/219) ([jackton1](https://github.com/jackton1))
- Fixed bug with separator for filenames that contain spaces [\#218](https://github.com/tj-actions/changed-files/pull/218) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#215](https://github.com/tj-actions/changed-files/pull/215) ([jackton1](https://github.com/jackton1))
- Bump tj-actions/sync-release-version from 8.7 to 9 [\#214](https://github.com/tj-actions/changed-files/pull/214) ([dependabot[bot]](https://github.com/apps/dependabot))
- docs: add eltociear as a contributor for doc [\#213](https://github.com/tj-actions/changed-files/pull/213) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Update README.md [\#212](https://github.com/tj-actions/changed-files/pull/212) ([eltociear](https://github.com/eltociear))
- Fixed error with test [\#211](https://github.com/tj-actions/changed-files/pull/211) ([jackton1](https://github.com/jackton1))
- Update actions/checkout action to v2.3.5 [\#210](https://github.com/tj-actions/changed-files/pull/210) ([renovate[bot]](https://github.com/apps/renovate))
- Updated usage of quotes around array items. [\#209](https://github.com/tj-actions/changed-files/pull/209) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#207](https://github.com/tj-actions/changed-files/pull/207) ([jackton1](https://github.com/jackton1))
- Upgraded to v10.1 [\#206](https://github.com/tj-actions/changed-files/pull/206) ([jackton1](https://github.com/jackton1))

## [v10.1](https://github.com/tj-actions/changed-files/tree/v10.1) (2021-10-12)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v10...v10.1)

**Merged pull requests:**

- docs: add talva-tr as a contributor for code [\#205](https://github.com/tj-actions/changed-files/pull/205) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Add support for updating the current HEAD [\#204](https://github.com/tj-actions/changed-files/pull/204) ([talva-tr](https://github.com/talva-tr))
- Update tj-actions/verify-changed-files action to v8 [\#203](https://github.com/tj-actions/changed-files/pull/203) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v10 [\#202](https://github.com/tj-actions/changed-files/pull/202) ([jackton1](https://github.com/jackton1))

## [v10](https://github.com/tj-actions/changed-files/tree/v10) (2021-10-03)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.1.3...v10)

**Fixed bugs:**

- \[BUG\] Glob vs regex in readme and execution when using \* in with: files: [\#200](https://github.com/tj-actions/changed-files/issues/200)
- \[BUG\] in entrypoint is referring to gihub.com repository [\#196](https://github.com/tj-actions/changed-files/issues/196)

**Merged pull requests:**

- Update README.md [\#201](https://github.com/tj-actions/changed-files/pull/201) ([jackton1](https://github.com/jackton1))
- Upgraded to v1.1.3 [\#199](https://github.com/tj-actions/changed-files/pull/199) ([jackton1](https://github.com/jackton1))

## [v1.1.3](https://github.com/tj-actions/changed-files/tree/v1.1.3) (2021-09-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.1.2...v1.1.3)

**Merged pull requests:**

- Fixed bug setting the server URL for github enterprise server [\#198](https://github.com/tj-actions/changed-files/pull/198) ([jackton1](https://github.com/jackton1))
- Update reviewdog/action-shellcheck action to v1.9 [\#197](https://github.com/tj-actions/changed-files/pull/197) ([renovate[bot]](https://github.com/apps/renovate))
- Updated test [\#195](https://github.com/tj-actions/changed-files/pull/195) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#194](https://github.com/tj-actions/changed-files/pull/194) ([jackton1](https://github.com/jackton1))
- Bump tj-actions/branch-names from 4.9 to 5 [\#193](https://github.com/tj-actions/changed-files/pull/193) ([dependabot[bot]](https://github.com/apps/dependabot))
- Updated README.md [\#192](https://github.com/tj-actions/changed-files/pull/192) ([jackton1](https://github.com/jackton1))
- Upgraded to v1.1.2 [\#190](https://github.com/tj-actions/changed-files/pull/190) ([jackton1](https://github.com/jackton1))

## [v1.1.2](https://github.com/tj-actions/changed-files/tree/v1.1.2) (2021-09-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.1.1...v1.1.2)

**Merged pull requests:**

- Upgraded to v1.1.1 [\#189](https://github.com/tj-actions/changed-files/pull/189) ([jackton1](https://github.com/jackton1))

## [v1.1.1](https://github.com/tj-actions/changed-files/tree/v1.1.1) (2021-09-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.1.0...v1.1.1)

**Implemented enhancements:**

- \[Feature\] Rename `all_changed_files` to `all_changed_and_modified_files` [\#179](https://github.com/tj-actions/changed-files/issues/179)
- \[Feature\] Add support for `any_deleted` and `only_deleted` boolean output. [\#166](https://github.com/tj-actions/changed-files/issues/166)

**Merged pull requests:**

- Added support for detecting deleted files. [\#188](https://github.com/tj-actions/changed-files/pull/188) ([jackton1](https://github.com/jackton1))
- Rename all\_changed\_files to all\_changed\_and\_modified\_files. [\#187](https://github.com/tj-actions/changed-files/pull/187) ([jackton1](https://github.com/jackton1))
- Update other\_changed\_files output to also use the separator [\#186](https://github.com/tj-actions/changed-files/pull/186) ([jackton1](https://github.com/jackton1))
- Upgraded to v1.1.0 [\#185](https://github.com/tj-actions/changed-files/pull/185) ([jackton1](https://github.com/jackton1))

## [v1.1.0](https://github.com/tj-actions/changed-files/tree/v1.1.0) (2021-09-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.0.3...v1.1.0)

**Implemented enhancements:**

- \[Feature\] Specify sed delimiter or escaping forward slashes used in separator [\#180](https://github.com/tj-actions/changed-files/issues/180)

**Merged pull requests:**

- Update pascalgn/automerge-action action to v0.14.3 [\#184](https://github.com/tj-actions/changed-files/pull/184) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v1.0.3 [\#183](https://github.com/tj-actions/changed-files/pull/183) ([jackton1](https://github.com/jackton1))
- Update handling separator. [\#181](https://github.com/tj-actions/changed-files/pull/181) ([jackton1](https://github.com/jackton1))

## [v1.0.3](https://github.com/tj-actions/changed-files/tree/v1.0.3) (2021-09-03)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.0.2...v1.0.3)

**Implemented enhancements:**

- \[Feature\] Documentation for difference between all\_changed\_files and all\_modified\_files [\#177](https://github.com/tj-actions/changed-files/issues/177)

**Merged pull requests:**

- Update removing trailing separator [\#182](https://github.com/tj-actions/changed-files/pull/182) ([jackton1](https://github.com/jackton1))
- Update README.md [\#178](https://github.com/tj-actions/changed-files/pull/178) ([jackton1](https://github.com/jackton1))
- Upgraded to v1.0.2 [\#176](https://github.com/tj-actions/changed-files/pull/176) ([jackton1](https://github.com/jackton1))

## [v1.0.2](https://github.com/tj-actions/changed-files/tree/v1.0.2) (2021-08-28)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.0.1...v1.0.2)

**Fixed bugs:**

- \[BUG\] Error: xargs: unmatched single quote [\#169](https://github.com/tj-actions/changed-files/issues/169)

**Merged pull requests:**

- Fixed bug with parsing filenames that contain quotes [\#174](https://github.com/tj-actions/changed-files/pull/174) ([jackton1](https://github.com/jackton1))
- Upgraded to v1.0.1 [\#173](https://github.com/tj-actions/changed-files/pull/173) ([jackton1](https://github.com/jackton1))

## [v1.0.1](https://github.com/tj-actions/changed-files/tree/v1.0.1) (2021-08-28)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.0.0...v1.0.1)

**Implemented enhancements:**

- \[Feature\] Add support for checkout path [\#167](https://github.com/tj-actions/changed-files/issues/167)

**Fixed bugs:**

- \[BUG\] Deleted files not detected [\#165](https://github.com/tj-actions/changed-files/issues/165)
- \[BUG\] changed-files unable to initialize git repository on custom container image [\#164](https://github.com/tj-actions/changed-files/issues/164)

**Merged pull requests:**

- Updated README.md [\#172](https://github.com/tj-actions/changed-files/pull/172) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#171](https://github.com/tj-actions/changed-files/pull/171) ([jackton1](https://github.com/jackton1))
- docs: add IvanPizhenko as a contributor for code, doc [\#170](https://github.com/tj-actions/changed-files/pull/170) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Implement path parameter [\#168](https://github.com/tj-actions/changed-files/pull/168) ([IvanPizhenko](https://github.com/IvanPizhenko))
- Update peter-evans/create-pull-request action to v3.10.1 [\#163](https://github.com/tj-actions/changed-files/pull/163) ([renovate[bot]](https://github.com/apps/renovate))
- Update tj-actions/branch-names action to v4.9 [\#162](https://github.com/tj-actions/changed-files/pull/162) ([renovate[bot]](https://github.com/apps/renovate))
- Update tj-actions/remark action to v1.7 [\#161](https://github.com/tj-actions/changed-files/pull/161) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v1.0.0 [\#160](https://github.com/tj-actions/changed-files/pull/160) ([jackton1](https://github.com/jackton1))

## [v1.0.0](https://github.com/tj-actions/changed-files/tree/v1.0.0) (2021-08-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v9.3...v1.0.0)

**Fixed bugs:**

- Setting remote URL breaks other steps that are using it [\#158](https://github.com/tj-actions/changed-files/issues/158)

**Merged pull requests:**

- Fix persisting origin URL [\#159](https://github.com/tj-actions/changed-files/pull/159) ([jackton1](https://github.com/jackton1))
- Upgraded to v9.3 [\#157](https://github.com/tj-actions/changed-files/pull/157) ([jackton1](https://github.com/jackton1))

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

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v6...v7)

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

## [v6](https://github.com/tj-actions/changed-files/tree/v6) (2021-05-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v6.3...v6)

## [v6.3](https://github.com/tj-actions/changed-files/tree/v6.3) (2021-05-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v6.2...v6.3)

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
