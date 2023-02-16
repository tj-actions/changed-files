# Changelog

## [v35.5.5](https://github.com/tj-actions/changed-files/tree/v35.5.5) (2023-02-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35...v35.5.5)

## [v35](https://github.com/tj-actions/changed-files/tree/v35) (2023-02-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.5.4...v35)

**Fixed bugs:**

- \[BUG\] Changes are retrieved for everything since initial commit, instead of the current context like the GitHub UI [\#990](https://github.com/tj-actions/changed-files/issues/990)
- \[BUG\] "unknown revision" when using "path" [\#987](https://github.com/tj-actions/changed-files/issues/987)
- \[BUG\] Failing to retrieve master branch if depth isn't 0 [\#988](https://github.com/tj-actions/changed-files/issues/988)

**Merged pull requests:**

- fix: bug with fetching history [\#989](https://github.com/tj-actions/changed-files/pull/989) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.5.4 [\#986](https://github.com/tj-actions/changed-files/pull/986) ([jackton1](https://github.com/jackton1))

## [v35.5.4](https://github.com/tj-actions/changed-files/tree/v35.5.4) (2023-02-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.5.3...v35.5.4)

**Fixed bugs:**

- \[BUG\] action fail with pull request from external branch called master [\#979](https://github.com/tj-actions/changed-files/issues/979)
- \[BUG\] fatal: Invalid revision range X..Y when dealing with submodules [\#978](https://github.com/tj-actions/changed-files/issues/978)

**Closed issues:**

- Is it possible to get unstaged / modified files? [\#983](https://github.com/tj-actions/changed-files/issues/983)

**Merged pull requests:**

- Updated README.md [\#984](https://github.com/tj-actions/changed-files/pull/984) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.5.3 [\#982](https://github.com/tj-actions/changed-files/pull/982) ([jackton1](https://github.com/jackton1))
- fix: bug getting diff for submodules and fetching more history [\#980](https://github.com/tj-actions/changed-files/pull/980) ([jackton1](https://github.com/jackton1))

## [v35.5.3](https://github.com/tj-actions/changed-files/tree/v35.5.3) (2023-02-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.5.2...v35.5.3)

**Fixed bugs:**

- Action fails on empty repo or when the specific file pattern is not found [\#976](https://github.com/tj-actions/changed-files/issues/976)

**Merged pull requests:**

- fix: bug with pr from forks with similar branch names [\#981](https://github.com/tj-actions/changed-files/pull/981) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.5.2 [\#977](https://github.com/tj-actions/changed-files/pull/977) ([jackton1](https://github.com/jackton1))

## [v35.5.2](https://github.com/tj-actions/changed-files/tree/v35.5.2) (2023-02-09)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.5.1...v35.5.2)

**Fixed bugs:**

- \[BUG\] Unsynced target branch changes listed by action in pull requests [\#972](https://github.com/tj-actions/changed-files/issues/972)

**Merged pull requests:**

- chore: update use of tilde to use caret instead [\#975](https://github.com/tj-actions/changed-files/pull/975) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.5.1 [\#974](https://github.com/tj-actions/changed-files/pull/974) ([jackton1](https://github.com/jackton1))

## [v35.5.1](https://github.com/tj-actions/changed-files/tree/v35.5.1) (2023-02-07)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.5.0...v35.5.1)

**Fixed bugs:**

- \[BUG\] Action started failing [\#970](https://github.com/tj-actions/changed-files/issues/970)

**Merged pull requests:**

- fix: including non branch changes in diff output [\#973](https://github.com/tj-actions/changed-files/pull/973) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#971](https://github.com/tj-actions/changed-files/pull/971) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.5.0 [\#969](https://github.com/tj-actions/changed-files/pull/969) ([jackton1](https://github.com/jackton1))

## [v35.5.0](https://github.com/tj-actions/changed-files/tree/v35.5.0) (2023-02-01)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.4.4...v35.5.0)

**Implemented enhancements:**

- \[Feature\] Exclude the top-level/root directory when dir\_names="true" [\#965](https://github.com/tj-actions/changed-files/issues/965)
- \[Feature\] Exclude Files [\#963](https://github.com/tj-actions/changed-files/issues/963)
- \[Feature\] Rename `files` -\> `paths` \[\#tara-label-enhancement\] \[\#tara-label-good first issue\] [\#125](https://github.com/tj-actions/changed-files/issues/125)

**Fixed bugs:**

- \[BUG\] PR between branch and main - unsynced changes appearing in changed files. [\#966](https://github.com/tj-actions/changed-files/issues/966)
- ::error::Failed to get current commit for submodule [\#962](https://github.com/tj-actions/changed-files/issues/962)

**Closed issues:**

- Dependency Dashboard [\#27](https://github.com/tj-actions/changed-files/issues/27)

**Merged pull requests:**

- Updated README.md [\#968](https://github.com/tj-actions/changed-files/pull/968) ([jackton1](https://github.com/jackton1))
- feat: add support for excluding the top level directory [\#967](https://github.com/tj-actions/changed-files/pull/967) ([jackton1](https://github.com/jackton1))
- chore: update docs [\#964](https://github.com/tj-actions/changed-files/pull/964) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update reviewdog/action-shellcheck action to v1.17 [\#961](https://github.com/tj-actions/changed-files/pull/961) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v35.4.4 [\#960](https://github.com/tj-actions/changed-files/pull/960) ([jackton1](https://github.com/jackton1))
- chore: code clean up [\#959](https://github.com/tj-actions/changed-files/pull/959) ([jackton1](https://github.com/jackton1))

## [v35.4.4](https://github.com/tj-actions/changed-files/tree/v35.4.4) (2023-01-19)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.4.3...v35.4.4)

**Fixed bugs:**

- \[BUG\] Action is evaluating branch instead of sha [\#957](https://github.com/tj-actions/changed-files/issues/957)
- \[BUG\] Unable to run on windows self-hosted runner [\#956](https://github.com/tj-actions/changed-files/issues/956)

**Closed issues:**

- Comparing differences between tags/releases [\#949](https://github.com/tj-actions/changed-files/issues/949)

**Merged pull requests:**

- fix: revert change to pull pr branch via the branch name [\#958](https://github.com/tj-actions/changed-files/pull/958) ([jackton1](https://github.com/jackton1))
- feat: add guide for retrieving  changed files for tags [\#955](https://github.com/tj-actions/changed-files/pull/955) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.4.3 [\#954](https://github.com/tj-actions/changed-files/pull/954) ([jackton1](https://github.com/jackton1))

## [v35.4.3](https://github.com/tj-actions/changed-files/tree/v35.4.3) (2023-01-19)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.4.2...v35.4.3)

**Fixed bugs:**

- \[BUG\] Files not found when not last commit on new branch [\#952](https://github.com/tj-actions/changed-files/issues/952)
- \[BUG\] `changed-files` error during run [\#875](https://github.com/tj-actions/changed-files/issues/875)

**Merged pull requests:**

- fix: handling since last remote commits for the first pr branch commit [\#953](https://github.com/tj-actions/changed-files/pull/953) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.4.2 [\#951](https://github.com/tj-actions/changed-files/pull/951) ([jackton1](https://github.com/jackton1))

## [v35.4.2](https://github.com/tj-actions/changed-files/tree/v35.4.2) (2023-01-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.4.1...v35.4.2)

**Fixed bugs:**

- \[BUG\] Unable find a diff between ... [\#944](https://github.com/tj-actions/changed-files/issues/944)

**Merged pull requests:**

- fix: handle case of invalid file patterns [\#950](https://github.com/tj-actions/changed-files/pull/950) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#948](https://github.com/tj-actions/changed-files/pull/948) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.4.1 [\#946](https://github.com/tj-actions/changed-files/pull/946) ([jackton1](https://github.com/jackton1))

## [v35.4.1](https://github.com/tj-actions/changed-files/tree/v35.4.1) (2023-01-11)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.4.0...v35.4.1)

**Implemented enhancements:**

- \[Feature\] Specify base branch, not just base-sha [\#941](https://github.com/tj-actions/changed-files/issues/941)
- \[Feature\] Get contents of deleted file [\#938](https://github.com/tj-actions/changed-files/issues/938)

**Merged pull requests:**

- fix: bug retrieving diff with custom a base sha [\#945](https://github.com/tj-actions/changed-files/pull/945) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#943](https://github.com/tj-actions/changed-files/pull/943) ([jackton1](https://github.com/jackton1))
- chore: make since\_last\_remote\_commit optional [\#942](https://github.com/tj-actions/changed-files/pull/942) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.4.0 [\#937](https://github.com/tj-actions/changed-files/pull/937) ([jackton1](https://github.com/jackton1))

## [v35.4.0](https://github.com/tj-actions/changed-files/tree/v35.4.0) (2023-01-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.3.2...v35.4.0)

**Implemented enhancements:**

- \[Feature\] Skip fetching remote refs for non shallow clones [\#924](https://github.com/tj-actions/changed-files/issues/924)

**Fixed bugs:**

- \[BUG\] v35.3.0 Fails to add \[\] around files when with:json: true [\#926](https://github.com/tj-actions/changed-files/issues/926)

**Merged pull requests:**

- Upgraded to v35.3.2 [\#936](https://github.com/tj-actions/changed-files/pull/936) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#935](https://github.com/tj-actions/changed-files/pull/935) ([jackton1](https://github.com/jackton1))
- feat: skip fetching remote refs for non shallow clones [\#934](https://github.com/tj-actions/changed-files/pull/934) ([jackton1](https://github.com/jackton1))
- fix: error overriding the base sha [\#933](https://github.com/tj-actions/changed-files/pull/933) ([jackton1](https://github.com/jackton1))
- docs: add cfernhout as a contributor for doc [\#932](https://github.com/tj-actions/changed-files/pull/932) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Make example consistent and out of the box usable [\#931](https://github.com/tj-actions/changed-files/pull/931) ([cfernhout](https://github.com/cfernhout))

## [v35.3.2](https://github.com/tj-actions/changed-files/tree/v35.3.2) (2023-01-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.3.1...v35.3.2)

**Merged pull requests:**

- fix\(regression\): invalid json output. [\#930](https://github.com/tj-actions/changed-files/pull/930) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update actions/checkout action to v3.3.0 [\#929](https://github.com/tj-actions/changed-files/pull/929) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v35.3.1 [\#928](https://github.com/tj-actions/changed-files/pull/928) ([jackton1](https://github.com/jackton1))

## [v35.3.1](https://github.com/tj-actions/changed-files/tree/v35.3.1) (2023-01-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.3.0...v35.3.1)

**Fixed bugs:**

- \[BUG\] `files_ignore` used with `files` not ignoring as expected [\#901](https://github.com/tj-actions/changed-files/issues/901)

**Merged pull requests:**

- fix: json output [\#927](https://github.com/tj-actions/changed-files/pull/927) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.3.0 [\#925](https://github.com/tj-actions/changed-files/pull/925) ([jackton1](https://github.com/jackton1))

## [v35.3.0](https://github.com/tj-actions/changed-files/tree/v35.3.0) (2023-01-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.2.1...v35.3.0)

**Merged pull requests:**

- fix: bug dirnames output [\#923](https://github.com/tj-actions/changed-files/pull/923) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/auto-doc action to v1.7.3 [\#922](https://github.com/tj-actions/changed-files/pull/922) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#921](https://github.com/tj-actions/changed-files/pull/921) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#920](https://github.com/tj-actions/changed-files/pull/920) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.2.1 [\#919](https://github.com/tj-actions/changed-files/pull/919) ([jackton1](https://github.com/jackton1))

## [v35.2.1](https://github.com/tj-actions/changed-files/tree/v35.2.1) (2023-01-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.2.0...v35.2.1)

**Fixed bugs:**

- \[BUG\] On pull\_request\_review error [\#906](https://github.com/tj-actions/changed-files/issues/906)

**Merged pull requests:**

- Updated README.md [\#918](https://github.com/tj-actions/changed-files/pull/918) ([jackton1](https://github.com/jackton1))
- Bump tj-actions/auto-doc from 1.7.1 to 1.7.2 [\#917](https://github.com/tj-actions/changed-files/pull/917) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore: update readme [\#916](https://github.com/tj-actions/changed-files/pull/916) ([jackton1](https://github.com/jackton1))
- fix: bug running on pull\_request\_review [\#915](https://github.com/tj-actions/changed-files/pull/915) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#914](https://github.com/tj-actions/changed-files/pull/914) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/auto-doc action to v1.7.2 [\#913](https://github.com/tj-actions/changed-files/pull/913) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#912](https://github.com/tj-actions/changed-files/pull/912) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/auto-doc action to v1.7.1 [\#911](https://github.com/tj-actions/changed-files/pull/911) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v35.2.0 [\#910](https://github.com/tj-actions/changed-files/pull/910) ([jackton1](https://github.com/jackton1))

## [v35.2.0](https://github.com/tj-actions/changed-files/tree/v35.2.0) (2022-12-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.1.2...v35.2.0)

**Merged pull requests:**

- chore: update the test [\#909](https://github.com/tj-actions/changed-files/pull/909) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#908](https://github.com/tj-actions/changed-files/pull/908) ([jackton1](https://github.com/jackton1))
- docs: add adonisgarciac as a contributor for code, and doc [\#907](https://github.com/tj-actions/changed-files/pull/907) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Upgraded to v35.1.2 [\#905](https://github.com/tj-actions/changed-files/pull/905) ([jackton1](https://github.com/jackton1))
- add raw-output option for json output [\#900](https://github.com/tj-actions/changed-files/pull/900) ([adonisgarciac](https://github.com/adonisgarciac))

## [v35.1.2](https://github.com/tj-actions/changed-files/tree/v35.1.2) (2022-12-29)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.1.1...v35.1.2)

**Merged pull requests:**

- Updated README.md [\#904](https://github.com/tj-actions/changed-files/pull/904) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#903](https://github.com/tj-actions/changed-files/pull/903) ([jackton1](https://github.com/jackton1))
- feat: add support for excluding matched directories [\#902](https://github.com/tj-actions/changed-files/pull/902) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/github-changelog-generator action to v1.17 [\#899](https://github.com/tj-actions/changed-files/pull/899) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v35.1.1 [\#898](https://github.com/tj-actions/changed-files/pull/898) ([jackton1](https://github.com/jackton1))

## [v35.1.1](https://github.com/tj-actions/changed-files/tree/v35.1.1) (2022-12-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.1.0...v35.1.1)

**Implemented enhancements:**

- \[Feature\] Output which file changed from files input [\#895](https://github.com/tj-actions/changed-files/issues/895)

**Fixed bugs:**

- pipeline failed in tj-action [\#894](https://github.com/tj-actions/changed-files/issues/894)

**Merged pull requests:**

- Updated README.md [\#897](https://github.com/tj-actions/changed-files/pull/897) ([jackton1](https://github.com/jackton1))
- chore: update the default sha [\#896](https://github.com/tj-actions/changed-files/pull/896) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.1.0 [\#892](https://github.com/tj-actions/changed-files/pull/892) ([jackton1](https://github.com/jackton1))

## [v35.1.0](https://github.com/tj-actions/changed-files/tree/v35.1.0) (2022-12-19)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.0.1...v35.1.0)

**Implemented enhancements:**

- \[Feature\] Output changes to json files in filesystem for processing [\#688](https://github.com/tj-actions/changed-files/issues/688)

**Merged pull requests:**

- Updated README.md [\#891](https://github.com/tj-actions/changed-files/pull/891) ([jackton1](https://github.com/jackton1))
- feat: add support for writing outputs to files [\#890](https://github.com/tj-actions/changed-files/pull/890) ([jackton1](https://github.com/jackton1))
- Upgraded to v35.0.1 [\#889](https://github.com/tj-actions/changed-files/pull/889) ([jackton1](https://github.com/jackton1))

## [v35.0.1](https://github.com/tj-actions/changed-files/tree/v35.0.1) (2022-12-19)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v35.0.0...v35.0.1)

**Implemented enhancements:**

- Changed lines of modified files [\#858](https://github.com/tj-actions/changed-files/issues/858)

**Merged pull requests:**

- chore: update test [\#888](https://github.com/tj-actions/changed-files/pull/888) ([jackton1](https://github.com/jackton1))
- chore: code cleanup [\#887](https://github.com/tj-actions/changed-files/pull/887) ([jackton1](https://github.com/jackton1))
- Upgraded to v35 [\#886](https://github.com/tj-actions/changed-files/pull/886) ([jackton1](https://github.com/jackton1))

## [v35.0.0](https://github.com/tj-actions/changed-files/tree/v35.0.0) (2022-12-19)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.6.2...v35.0.0)

**Fixed bugs:**

- \[BUG\] Process completed with exit code 1 [\#884](https://github.com/tj-actions/changed-files/issues/884)

**Closed issues:**

- How to see the changed files after the PR is merged ? [\#874](https://github.com/tj-actions/changed-files/issues/874)

**Merged pull requests:**

- Updated README.md [\#885](https://github.com/tj-actions/changed-files/pull/885) ([jackton1](https://github.com/jackton1))
- fix: error retrieving changed files [\#882](https://github.com/tj-actions/changed-files/pull/882) ([jackton1](https://github.com/jackton1))
- fix: fail when the merge base is not found [\#879](https://github.com/tj-actions/changed-files/pull/879) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.6.2 [\#878](https://github.com/tj-actions/changed-files/pull/878) ([jackton1](https://github.com/jackton1))

## [v34.6.2](https://github.com/tj-actions/changed-files/tree/v34.6.2) (2022-12-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34...v34.6.2)

## [v34](https://github.com/tj-actions/changed-files/tree/v34) (2022-12-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.6.1...v34)

**Fixed bugs:**

- \[BUG\] github actions has depreciated and will remove a feature used in this action 'set-output' see link  [\#865](https://github.com/tj-actions/changed-files/issues/865)

**Merged pull requests:**

- fix: bug using since\_last\_remote\_commit with force push [\#877](https://github.com/tj-actions/changed-files/pull/877) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#876](https://github.com/tj-actions/changed-files/pull/876) ([jackton1](https://github.com/jackton1))
- chore: update test [\#873](https://github.com/tj-actions/changed-files/pull/873) ([jackton1](https://github.com/jackton1))
- chore: update test dir [\#872](https://github.com/tj-actions/changed-files/pull/872) ([jackton1](https://github.com/jackton1))
- chore: remove ubuntu 18.04 from test [\#871](https://github.com/tj-actions/changed-files/pull/871) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#869](https://github.com/tj-actions/changed-files/pull/869) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/verify-changed-files action to v13 [\#868](https://github.com/tj-actions/changed-files/pull/868) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/auto-doc action to v1.6.0 [\#867](https://github.com/tj-actions/changed-files/pull/867) ([renovate[bot]](https://github.com/apps/renovate))
- feat: fallback to fork-point [\#866](https://github.com/tj-actions/changed-files/pull/866) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.6.1 [\#864](https://github.com/tj-actions/changed-files/pull/864) ([jackton1](https://github.com/jackton1))

## [v34.6.1](https://github.com/tj-actions/changed-files/tree/v34.6.1) (2022-12-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.6.0...v34.6.1)

**Fixed bugs:**

- \[BUG\] Git fails to authenticate when running locally with nektos/act [\#849](https://github.com/tj-actions/changed-files/issues/849)

**Merged pull requests:**

- Updated README.md [\#863](https://github.com/tj-actions/changed-files/pull/863) ([jackton1](https://github.com/jackton1))
- feat: add support for pulling more history [\#862](https://github.com/tj-actions/changed-files/pull/862) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.6.0 [\#861](https://github.com/tj-actions/changed-files/pull/861) ([jackton1](https://github.com/jackton1))

## [v34.6.0](https://github.com/tj-actions/changed-files/tree/v34.6.0) (2022-12-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.5.4...v34.6.0)

**Fixed bugs:**

- \[BUG\] changed-files-diff-sha prints thousands of lines and takes two minutes to run [\#855](https://github.com/tj-actions/changed-files/issues/855)
- \[BUG\] \(v34.5.4\) Input does not meet YAML 1.2 "Core Schema" specification: head-repo-fork [\#853](https://github.com/tj-actions/changed-files/issues/853)

**Merged pull requests:**

- fix: error with retrieving changed files for closed prs [\#860](https://github.com/tj-actions/changed-files/pull/860) ([jackton1](https://github.com/jackton1))
- fix: error detecting changed files for closed PR's [\#859](https://github.com/tj-actions/changed-files/pull/859) ([jackton1](https://github.com/jackton1))
- fix: bug-changed-files-diff-sha-prints-thousands-of-lines-and-takes-two-minutes-to-run [\#857](https://github.com/tj-actions/changed-files/pull/857) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update reviewdog/action-shellcheck action to v1.16 [\#856](https://github.com/tj-actions/changed-files/pull/856) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#854](https://github.com/tj-actions/changed-files/pull/854) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#852](https://github.com/tj-actions/changed-files/pull/852) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.5.4 [\#851](https://github.com/tj-actions/changed-files/pull/851) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update actions/checkout action to v3.2.0 [\#850](https://github.com/tj-actions/changed-files/pull/850) ([renovate[bot]](https://github.com/apps/renovate))

## [v34.5.4](https://github.com/tj-actions/changed-files/tree/v34.5.4) (2022-12-12)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.5.3...v34.5.4)

**Merged pull requests:**

- chore: update readme [\#848](https://github.com/tj-actions/changed-files/pull/848) ([jackton1](https://github.com/jackton1))
- chore: update error handling [\#847](https://github.com/tj-actions/changed-files/pull/847) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.5.3 [\#846](https://github.com/tj-actions/changed-files/pull/846) ([jackton1](https://github.com/jackton1))

## [v34.5.3](https://github.com/tj-actions/changed-files/tree/v34.5.3) (2022-12-10)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.5.2...v34.5.3)

**Fixed bugs:**

- \[BUG\] Error: Unable to locate the previous sha: fatal: ambiguous argument 'main': unknown revision or path not in the working tree [\#840](https://github.com/tj-actions/changed-files/issues/840)

**Merged pull requests:**

- chore: update diff-sha.sh [\#845](https://github.com/tj-actions/changed-files/pull/845) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.5.2 [\#844](https://github.com/tj-actions/changed-files/pull/844) ([jackton1](https://github.com/jackton1))

## [v34.5.2](https://github.com/tj-actions/changed-files/tree/v34.5.2) (2022-12-10)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.5.1...v34.5.2)

**Merged pull requests:**

- fix: error verifying the previous commit sha for push event [\#843](https://github.com/tj-actions/changed-files/pull/843) ([jackton1](https://github.com/jackton1))
- chore: rename env variable [\#841](https://github.com/tj-actions/changed-files/pull/841) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.5.1 [\#839](https://github.com/tj-actions/changed-files/pull/839) ([jackton1](https://github.com/jackton1))

## [v34.5.1](https://github.com/tj-actions/changed-files/tree/v34.5.1) (2022-12-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.5.0...v34.5.1)

**Implemented enhancements:**

- \[Feature\] Deprecate usage of `set-output` command and upgrade to environment variable [\#833](https://github.com/tj-actions/changed-files/issues/833)

**Fixed bugs:**

- \[BUG\] set-output call is deprecated [\#831](https://github.com/tj-actions/changed-files/issues/831)
- Unable to find merge-base between master and HEAD\[BUG\] \<title\> [\#830](https://github.com/tj-actions/changed-files/issues/830)
- \[BUG\] Glob not matching changed files [\#829](https://github.com/tj-actions/changed-files/issues/829)
- \[BUG\] Wrong changed-files returned for forked PRs [\#714](https://github.com/tj-actions/changed-files/issues/714)

**Merged pull requests:**

- Updated README.md [\#838](https://github.com/tj-actions/changed-files/pull/838) ([jackton1](https://github.com/jackton1))
- fix: wrong changed files for forked prs [\#837](https://github.com/tj-actions/changed-files/pull/837) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#836](https://github.com/tj-actions/changed-files/pull/836) ([jackton1](https://github.com/jackton1))
- fix: determining the merge base [\#835](https://github.com/tj-actions/changed-files/pull/835) ([jackton1](https://github.com/jackton1))
- chore: fix typos [\#834](https://github.com/tj-actions/changed-files/pull/834) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/auto-doc action to v1.5.0 [\#832](https://github.com/tj-actions/changed-files/pull/832) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update peter-evans/create-pull-request action to v4.2.3 [\#828](https://github.com/tj-actions/changed-files/pull/828) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v34.5.0 [\#827](https://github.com/tj-actions/changed-files/pull/827) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#826](https://github.com/tj-actions/changed-files/pull/826) ([jackton1](https://github.com/jackton1))

## [v34.5.0](https://github.com/tj-actions/changed-files/tree/v34.5.0) (2022-11-24)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.4.4...v34.5.0)

**Implemented enhancements:**

- \[Feature\] Replace all usage of nrwl/last-successful-commit-action with nrwl/nx-set-shas [\#820](https://github.com/tj-actions/changed-files/issues/820)
- \[Feature\] Unique directories max\_depth option [\#789](https://github.com/tj-actions/changed-files/issues/789)

**Merged pull requests:**

- chore\(deps\): update peter-evans/create-pull-request action to v4.2.2 [\#825](https://github.com/tj-actions/changed-files/pull/825) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#824](https://github.com/tj-actions/changed-files/pull/824) ([jackton1](https://github.com/jackton1))
- feat: add support for dir\_names\_max\_depth [\#823](https://github.com/tj-actions/changed-files/pull/823) ([jackton1](https://github.com/jackton1))
- feat: replace all usage of nrwl/last-successful-commit-action with nrwl/nx-set-shas [\#822](https://github.com/tj-actions/changed-files/pull/822) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update peter-evans/create-pull-request action to v4.2.1 [\#821](https://github.com/tj-actions/changed-files/pull/821) ([renovate[bot]](https://github.com/apps/renovate))
- chore: update renovate.json [\#819](https://github.com/tj-actions/changed-files/pull/819) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.4.4 [\#818](https://github.com/tj-actions/changed-files/pull/818) ([jackton1](https://github.com/jackton1))

## [v34.4.4](https://github.com/tj-actions/changed-files/tree/v34.4.4) (2022-11-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.4.3...v34.4.4)

**Implemented enhancements:**

- \[Feature\] Compare `HEAD` and `unstaged` [\#813](https://github.com/tj-actions/changed-files/issues/813)

**Fixed bugs:**

- `increase the fetch_depth to a number higher than 5000` [\#812](https://github.com/tj-actions/changed-files/issues/812)
- \[BUG\] changed-files v34.4.2 unable to locate a common ancestor [\#809](https://github.com/tj-actions/changed-files/issues/809)

**Merged pull requests:**

- chore: fix error locating last remote commit sha [\#817](https://github.com/tj-actions/changed-files/pull/817) ([jackton1](https://github.com/jackton1))
- Bump hmarr/auto-approve-action from 2 to 3 [\#816](https://github.com/tj-actions/changed-files/pull/816) ([dependabot[bot]](https://github.com/apps/dependabot))
- Upgraded to v34.4.3 [\#815](https://github.com/tj-actions/changed-files/pull/815) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#814](https://github.com/tj-actions/changed-files/pull/814) ([jackton1](https://github.com/jackton1))

## [v34.4.3](https://github.com/tj-actions/changed-files/tree/v34.4.3) (2022-11-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.4.2...v34.4.3)

**Fixed bugs:**

- \[BUG\] diff-sha.sh results in "fatal: ambiguous argument '': unknown revision or path not in the working tree." [\#750](https://github.com/tj-actions/changed-files/issues/750)

**Merged pull requests:**

- Updated README.md [\#811](https://github.com/tj-actions/changed-files/pull/811) ([jackton1](https://github.com/jackton1))
- fix: pulling current branch history [\#810](https://github.com/tj-actions/changed-files/pull/810) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.4.2 [\#808](https://github.com/tj-actions/changed-files/pull/808) ([jackton1](https://github.com/jackton1))

## [v34.4.2](https://github.com/tj-actions/changed-files/tree/v34.4.2) (2022-11-15)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.4.1...v34.4.2)

**Fixed bugs:**

- \[BUG\] Infinite loop on v34.4.0 [\#803](https://github.com/tj-actions/changed-files/issues/803)
- Unable to locate a common ancestor between production\_migration and HEAD [\#802](https://github.com/tj-actions/changed-files/issues/802)

**Merged pull requests:**

- fix: bug with retrieving the last remote commit [\#806](https://github.com/tj-actions/changed-files/pull/806) ([jackton1](https://github.com/jackton1))

## [v34.4.1](https://github.com/tj-actions/changed-files/tree/v34.4.1) (2022-11-15)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.4.0...v34.4.1)

**Fixed bugs:**

- \[BUG\] Very simple branch gives: "Unable to find merge-base between main and HEAD." [\#797](https://github.com/tj-actions/changed-files/issues/797)

**Merged pull requests:**

- chore: update sync-release-version.yml [\#805](https://github.com/tj-actions/changed-files/pull/805) ([jackton1](https://github.com/jackton1))
- fix: finding merge-base [\#804](https://github.com/tj-actions/changed-files/pull/804) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.4.0 [\#800](https://github.com/tj-actions/changed-files/pull/800) ([jackton1](https://github.com/jackton1))

## [v34.4.0](https://github.com/tj-actions/changed-files/tree/v34.4.0) (2022-11-11)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.3.4...v34.4.0)

**Fixed bugs:**

- \[BUG\] Specfic File Bug in v33 / v34 - grep: : No such file or directory [\#795](https://github.com/tj-actions/changed-files/issues/795)
- \[BUG\] Please verify that the previous sha is valid, and increase the fetch\_depth to a number higher than 40. [\#790](https://github.com/tj-actions/changed-files/issues/790)

**Merged pull requests:**

- chore: update test [\#799](https://github.com/tj-actions/changed-files/pull/799) ([jackton1](https://github.com/jackton1))
- feat: skip merge-base check for non shallow clones and fallback to using --fork-point [\#798](https://github.com/tj-actions/changed-files/pull/798) ([jackton1](https://github.com/jackton1))
- chore: update bug issue template [\#796](https://github.com/tj-actions/changed-files/pull/796) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.3.4 [\#794](https://github.com/tj-actions/changed-files/pull/794) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#793](https://github.com/tj-actions/changed-files/pull/793) ([jackton1](https://github.com/jackton1))

## [v34.3.4](https://github.com/tj-actions/changed-files/tree/v34.3.4) (2022-11-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.3.3...v34.3.4)

**Merged pull requests:**

- Updated README.md [\#792](https://github.com/tj-actions/changed-files/pull/792) ([jackton1](https://github.com/jackton1))
- fix: re-add ability to change the max fetch depth [\#791](https://github.com/tj-actions/changed-files/pull/791) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.3.3 [\#788](https://github.com/tj-actions/changed-files/pull/788) ([jackton1](https://github.com/jackton1))

## [v34.3.3](https://github.com/tj-actions/changed-files/tree/v34.3.3) (2022-11-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.3.1...v34.3.3)

**Fixed bugs:**

- \[BUG\] Action compares only two latest commits on push [\#783](https://github.com/tj-actions/changed-files/issues/783)
- Detected dubious ownership in repository error when running the action [\#782](https://github.com/tj-actions/changed-files/issues/782)

**Merged pull requests:**

- fix: bug with force pushing commits to pr branches [\#787](https://github.com/tj-actions/changed-files/pull/787) ([jackton1](https://github.com/jackton1))
- fix: bug with invalid branch name [\#786](https://github.com/tj-actions/changed-files/pull/786) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/glob action to v16 [\#785](https://github.com/tj-actions/changed-files/pull/785) ([renovate[bot]](https://github.com/apps/renovate))
- chore: update readme [\#784](https://github.com/tj-actions/changed-files/pull/784) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.3.2 [\#781](https://github.com/tj-actions/changed-files/pull/781) ([jackton1](https://github.com/jackton1))

## [v34.3.1](https://github.com/tj-actions/changed-files/tree/v34.3.1) (2022-11-07)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.3.2...v34.3.1)

## [v34.3.2](https://github.com/tj-actions/changed-files/tree/v34.3.2) (2022-11-07)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.3.0...v34.3.2)

**Fixed bugs:**

- \[BUG\] Similar commit hashes detected: previous sha: abc123 is equivalent to the current sha: abc123 on PR merge [\#778](https://github.com/tj-actions/changed-files/issues/778)

**Merged pull requests:**

- fix: similar commit hashes [\#780](https://github.com/tj-actions/changed-files/pull/780) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#779](https://github.com/tj-actions/changed-files/pull/779) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.3.0 [\#777](https://github.com/tj-actions/changed-files/pull/777) ([jackton1](https://github.com/jackton1))

## [v34.3.0](https://github.com/tj-actions/changed-files/tree/v34.3.0) (2022-11-07)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.2.2...v34.3.0)

**Closed issues:**

- How can I let the workflow to detect the changes only in the certain micro service? [\#766](https://github.com/tj-actions/changed-files/issues/766)

**Merged pull requests:**

- chore: exclude fetching tags [\#776](https://github.com/tj-actions/changed-files/pull/776) ([jackton1](https://github.com/jackton1))
- chore: update test [\#775](https://github.com/tj-actions/changed-files/pull/775) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#774](https://github.com/tj-actions/changed-files/pull/774) ([jackton1](https://github.com/jackton1))
- feat: add support for using the last remote commit [\#773](https://github.com/tj-actions/changed-files/pull/773) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.2.2 [\#772](https://github.com/tj-actions/changed-files/pull/772) ([jackton1](https://github.com/jackton1))

## [v34.2.2](https://github.com/tj-actions/changed-files/tree/v34.2.2) (2022-11-06)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.2.1...v34.2.2)

**Merged pull requests:**

- Updated README.md [\#771](https://github.com/tj-actions/changed-files/pull/771) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#770](https://github.com/tj-actions/changed-files/pull/770) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#769](https://github.com/tj-actions/changed-files/pull/769) ([jackton1](https://github.com/jackton1))
- docs: add kenji-miyake as a contributor for code [\#768](https://github.com/tj-actions/changed-files/pull/768) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- chore: change `sha` to non-required [\#767](https://github.com/tj-actions/changed-files/pull/767) ([kenji-miyake](https://github.com/kenji-miyake))
- Upgraded to v34.2.1 [\#765](https://github.com/tj-actions/changed-files/pull/765) ([jackton1](https://github.com/jackton1))

## [v34.2.1](https://github.com/tj-actions/changed-files/tree/v34.2.1) (2022-11-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.2.0...v34.2.1)

**Merged pull requests:**

- chore: update debug message [\#764](https://github.com/tj-actions/changed-files/pull/764) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.2.0 [\#763](https://github.com/tj-actions/changed-files/pull/763) ([jackton1](https://github.com/jackton1))

## [v34.2.0](https://github.com/tj-actions/changed-files/tree/v34.2.0) (2022-11-05)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.1.1...v34.2.0)

**Fixed bugs:**

- \[BUG\] dir\_names + files combo ends up in error [\#757](https://github.com/tj-actions/changed-files/issues/757)

**Closed issues:**

- \[BUG\] Action failing on PR with "Unable to find merge-base in shallow clone. Please increase 'max\_fetch\_depth' to at least 340." [\#755](https://github.com/tj-actions/changed-files/issues/755)

**Merged pull requests:**

- Updated README.md [\#762](https://github.com/tj-actions/changed-files/pull/762) ([jackton1](https://github.com/jackton1))
- chore: fixed test [\#761](https://github.com/tj-actions/changed-files/pull/761) ([jackton1](https://github.com/jackton1))
- chore: update env [\#760](https://github.com/tj-actions/changed-files/pull/760) ([jackton1](https://github.com/jackton1))
- fix: error finding merge-base [\#759](https://github.com/tj-actions/changed-files/pull/759) ([jackton1](https://github.com/jackton1))
- chore: improve test coverage [\#758](https://github.com/tj-actions/changed-files/pull/758) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#756](https://github.com/tj-actions/changed-files/pull/756) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.1.1 [\#754](https://github.com/tj-actions/changed-files/pull/754) ([jackton1](https://github.com/jackton1))

## [v34.1.1](https://github.com/tj-actions/changed-files/tree/v34.1.1) (2022-11-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.1.0...v34.1.1)

**Merged pull requests:**

- Upgraded to v34.1.0 [\#753](https://github.com/tj-actions/changed-files/pull/753) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.1.0 [\#752](https://github.com/tj-actions/changed-files/pull/752) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#751](https://github.com/tj-actions/changed-files/pull/751) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.0.5 [\#749](https://github.com/tj-actions/changed-files/pull/749) ([jackton1](https://github.com/jackton1))
- chore: update test [\#746](https://github.com/tj-actions/changed-files/pull/746) ([jackton1](https://github.com/jackton1))
- fix: including changed files from merge commits, no merge-base found [\#736](https://github.com/tj-actions/changed-files/pull/736) ([jackton1](https://github.com/jackton1))

## [v34.1.0](https://github.com/tj-actions/changed-files/tree/v34.1.0) (2022-11-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.0.5...v34.1.0)

**Fixed bugs:**

- \[BUG\] Action failing on PR with "Unable to find merge-base in shallow clone" [\#737](https://github.com/tj-actions/changed-files/issues/737)

**Closed issues:**

- Logical Issue in deepenShallowCloneToFindCommit  [\#747](https://github.com/tj-actions/changed-files/issues/747)

## [v34.0.5](https://github.com/tj-actions/changed-files/tree/v34.0.5) (2022-11-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.0.4...v34.0.5)

**Merged pull requests:**

- fix: error finding merge-base [\#748](https://github.com/tj-actions/changed-files/pull/748) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.0.4 [\#745](https://github.com/tj-actions/changed-files/pull/745) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.0.3 [\#744](https://github.com/tj-actions/changed-files/pull/744) ([jackton1](https://github.com/jackton1))

## [v34.0.4](https://github.com/tj-actions/changed-files/tree/v34.0.4) (2022-11-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.0.3...v34.0.4)

**Merged pull requests:**

- Updated README.md [\#743](https://github.com/tj-actions/changed-files/pull/743) ([jackton1](https://github.com/jackton1))
- feat: increase the default max\_fetch\_depth [\#742](https://github.com/tj-actions/changed-files/pull/742) ([jackton1](https://github.com/jackton1))

## [v34.0.3](https://github.com/tj-actions/changed-files/tree/v34.0.3) (2022-11-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.0.2...v34.0.3)

**Implemented enhancements:**

- Retrieve all changed files and directories relative to the last completed run of a GitHub Actions check [\#735](https://github.com/tj-actions/changed-files/issues/735)

**Merged pull requests:**

- chore: update test increase max-parallel [\#741](https://github.com/tj-actions/changed-files/pull/741) ([jackton1](https://github.com/jackton1))
- feat: pull initial history when using the default fetch-depth [\#740](https://github.com/tj-actions/changed-files/pull/740) ([jackton1](https://github.com/jackton1))
- chore: fixed typo. [\#739](https://github.com/tj-actions/changed-files/pull/739) ([jackton1](https://github.com/jackton1))
- chore: update test [\#738](https://github.com/tj-actions/changed-files/pull/738) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.0.2 [\#734](https://github.com/tj-actions/changed-files/pull/734) ([jackton1](https://github.com/jackton1))

## [v34.0.2](https://github.com/tj-actions/changed-files/tree/v34.0.2) (2022-10-31)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.0.1...v34.0.2)

**Fixed bugs:**

- \[BUG\] Action fails on initial commit [\#715](https://github.com/tj-actions/changed-files/issues/715)

**Merged pull requests:**

- chore: update docs [\#733](https://github.com/tj-actions/changed-files/pull/733) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#732](https://github.com/tj-actions/changed-files/pull/732) ([jackton1](https://github.com/jackton1))
- chore: fix detecting changes with the first PR commit [\#731](https://github.com/tj-actions/changed-files/pull/731) ([jackton1](https://github.com/jackton1))
- chore: update docs [\#730](https://github.com/tj-actions/changed-files/pull/730) ([jackton1](https://github.com/jackton1))
- chore: update debug message [\#729](https://github.com/tj-actions/changed-files/pull/729) ([jackton1](https://github.com/jackton1))
- fix: bug detecting initial commits [\#728](https://github.com/tj-actions/changed-files/pull/728) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.0.1 [\#727](https://github.com/tj-actions/changed-files/pull/727) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#726](https://github.com/tj-actions/changed-files/pull/726) ([jackton1](https://github.com/jackton1))

## [v34.0.1](https://github.com/tj-actions/changed-files/tree/v34.0.1) (2022-10-31)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v34.0.0...v34.0.1)

**Fixed bugs:**

- \[BUG\] Auto-Merge not working properly on Change-Detection for PRs [\#713](https://github.com/tj-actions/changed-files/issues/713)

**Merged pull requests:**

- Updated README.md [\#725](https://github.com/tj-actions/changed-files/pull/725) ([jackton1](https://github.com/jackton1))
- chore: increase the default max\_fetch\_depth [\#724](https://github.com/tj-actions/changed-files/pull/724) ([jackton1](https://github.com/jackton1))
- fix: bug detecting changes in initial commit. [\#723](https://github.com/tj-actions/changed-files/pull/723) ([jackton1](https://github.com/jackton1))
- fix: bug with finding merge-base [\#722](https://github.com/tj-actions/changed-files/pull/722) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/auto-doc action to v1.4.3 [\#721](https://github.com/tj-actions/changed-files/pull/721) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#720](https://github.com/tj-actions/changed-files/pull/720) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#719](https://github.com/tj-actions/changed-files/pull/719) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/auto-doc action to v1.4.2 [\#718](https://github.com/tj-actions/changed-files/pull/718) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#717](https://github.com/tj-actions/changed-files/pull/717) ([jackton1](https://github.com/jackton1))
- chore: update docs [\#716](https://github.com/tj-actions/changed-files/pull/716) ([jackton1](https://github.com/jackton1))
- chore: remove comment [\#712](https://github.com/tj-actions/changed-files/pull/712) ([jackton1](https://github.com/jackton1))
- Upgraded to v34.0.0 [\#711](https://github.com/tj-actions/changed-files/pull/711) ([jackton1](https://github.com/jackton1))

## [v34.0.0](https://github.com/tj-actions/changed-files/tree/v34.0.0) (2022-10-25)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v33.0.0...v34.0.0)

**Fixed bugs:**

- \[BUG\] Fatal: $HOME not set [\#708](https://github.com/tj-actions/changed-files/issues/708)
- \[BUG\] Locate the merge-base of a PR branch instead of a relying on the fetch-depth. [\#704](https://github.com/tj-actions/changed-files/issues/704)

**Merged pull requests:**

- chore: use local scoped variables [\#710](https://github.com/tj-actions/changed-files/pull/710) ([jackton1](https://github.com/jackton1))
- feat: add support for fetching more history [\#709](https://github.com/tj-actions/changed-files/pull/709) ([jackton1](https://github.com/jackton1))
- Upgraded to v33.0.0 [\#707](https://github.com/tj-actions/changed-files/pull/707) ([jackton1](https://github.com/jackton1))

## [v33.0.0](https://github.com/tj-actions/changed-files/tree/v33.0.0) (2022-10-21)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v33...v33.0.0)

## [v33](https://github.com/tj-actions/changed-files/tree/v33) (2022-10-21)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v32.1.2...v33)

**Closed issues:**

- Ability to do a three dots diff [\#702](https://github.com/tj-actions/changed-files/issues/702)

**Merged pull requests:**

- chore: update readme [\#706](https://github.com/tj-actions/changed-files/pull/706) ([jackton1](https://github.com/jackton1))
- chore: clean up test [\#705](https://github.com/tj-actions/changed-files/pull/705) ([jackton1](https://github.com/jackton1))
- feat: switch to three dot diff [\#703](https://github.com/tj-actions/changed-files/pull/703) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#701](https://github.com/tj-actions/changed-files/pull/701) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#700](https://github.com/tj-actions/changed-files/pull/700) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update peter-evans/create-pull-request action to v4.2.0 [\#699](https://github.com/tj-actions/changed-files/pull/699) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update pascalgn/automerge-action action to v0.15.5 [\#698](https://github.com/tj-actions/changed-files/pull/698) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update peter-evans/create-pull-request action to v4.1.4 [\#697](https://github.com/tj-actions/changed-files/pull/697) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/verify-changed-files action to v12 [\#696](https://github.com/tj-actions/changed-files/pull/696) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v32.1.2 [\#695](https://github.com/tj-actions/changed-files/pull/695) ([jackton1](https://github.com/jackton1))

## [v32.1.2](https://github.com/tj-actions/changed-files/tree/v32.1.2) (2022-10-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v32...v32.1.2)

## [v32](https://github.com/tj-actions/changed-files/tree/v32) (2022-10-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v32.1.1...v32)

**Fixed bugs:**

- \[BUG\] Random GITHUB\_OUTPUT: unbound variable in get-sha.sh [\#690](https://github.com/tj-actions/changed-files/issues/690)

**Merged pull requests:**

- chore: clean up test [\#694](https://github.com/tj-actions/changed-files/pull/694) ([jackton1](https://github.com/jackton1))
- fix: bug setting until and since inputs. [\#693](https://github.com/tj-actions/changed-files/pull/693) ([jackton1](https://github.com/jackton1))
- Upgraded to v32.1.1 [\#692](https://github.com/tj-actions/changed-files/pull/692) ([jackton1](https://github.com/jackton1))

## [v32.1.1](https://github.com/tj-actions/changed-files/tree/v32.1.1) (2022-10-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v32.1.0...v32.1.1)

**Merged pull requests:**

- feat: remove duplicate files add back support for deprecated set-output [\#691](https://github.com/tj-actions/changed-files/pull/691) ([jackton1](https://github.com/jackton1))
- Upgraded to v32.1.0 [\#687](https://github.com/tj-actions/changed-files/pull/687) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#686](https://github.com/tj-actions/changed-files/pull/686) ([jackton1](https://github.com/jackton1))

## [v32.1.0](https://github.com/tj-actions/changed-files/tree/v32.1.0) (2022-10-12)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v32.0.1...v32.1.0)

**Fixed bugs:**

- \[BUG\] runner is reporting old Node.js version. [\#678](https://github.com/tj-actions/changed-files/issues/678)
- \[BUG\] New commits pushed to the base branch results in errors when shallow history is used. [\#668](https://github.com/tj-actions/changed-files/issues/668)

**Merged pull requests:**

- docs: add lpulley as a contributor for code [\#685](https://github.com/tj-actions/changed-files/pull/685) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Updated README.md [\#684](https://github.com/tj-actions/changed-files/pull/684) ([jackton1](https://github.com/jackton1))
- chore: update test [\#683](https://github.com/tj-actions/changed-files/pull/683) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#682](https://github.com/tj-actions/changed-files/pull/682) ([jackton1](https://github.com/jackton1))
- fix: bug with new commits pushed to the base branch that result in errors when shallow history is used [\#681](https://github.com/tj-actions/changed-files/pull/681) ([jackton1](https://github.com/jackton1))
- Upgraded to v32.0.1 [\#680](https://github.com/tj-actions/changed-files/pull/680) ([jackton1](https://github.com/jackton1))
- Use `>>$GITHUB_OUTPUT` instead of `::set-output` [\#679](https://github.com/tj-actions/changed-files/pull/679) ([lpulley](https://github.com/lpulley))

## [v32.0.1](https://github.com/tj-actions/changed-files/tree/v32.0.1) (2022-10-11)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v32.0.0...v32.0.1)

**Fixed bugs:**

- \[BUG\] file not ignored with files\_ignore option [\#675](https://github.com/tj-actions/changed-files/issues/675)

**Merged pull requests:**

- chore\(deps\): update tj-actions/glob action to v15 [\#677](https://github.com/tj-actions/changed-files/pull/677) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v32.0.0 [\#676](https://github.com/tj-actions/changed-files/pull/676) ([jackton1](https://github.com/jackton1))

## [v32.0.0](https://github.com/tj-actions/changed-files/tree/v32.0.0) (2022-10-06)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v31...v32.0.0)

**Merged pull requests:**

- Updated README.md [\#674](https://github.com/tj-actions/changed-files/pull/674) ([jackton1](https://github.com/jackton1))
- add kostiantyn-korniienko-aurea as a contributor for doc [\#673](https://github.com/tj-actions/changed-files/pull/673) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- TYPO fix [\#671](https://github.com/tj-actions/changed-files/pull/671) ([kostiantyn-korniienko](https://github.com/kostiantyn-korniienko))
- chore\(deps\): update tj-actions/glob action to v14 [\#670](https://github.com/tj-actions/changed-files/pull/670) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update actions/checkout action to v3.1.0 [\#669](https://github.com/tj-actions/changed-files/pull/669) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v31.0.3 [\#667](https://github.com/tj-actions/changed-files/pull/667) ([jackton1](https://github.com/jackton1))

## [v31](https://github.com/tj-actions/changed-files/tree/v31) (2022-10-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v31.0.3...v31)

## [v31.0.3](https://github.com/tj-actions/changed-files/tree/v31.0.3) (2022-10-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v31.0.2...v31.0.3)

**Fixed bugs:**

- \[BUG\] I'd like to use file name consisting of Korean, not English [\#658](https://github.com/tj-actions/changed-files/issues/658)
- Relative path from a working directory [\#657](https://github.com/tj-actions/changed-files/issues/657)
- Similar commit hash detected. You seem to be missing fetch-depth:0 [\#656](https://github.com/tj-actions/changed-files/issues/656)

**Merged pull requests:**

- chore: remove redundant since last remote commit input [\#666](https://github.com/tj-actions/changed-files/pull/666) ([jackton1](https://github.com/jackton1))
- chore: fixed test [\#665](https://github.com/tj-actions/changed-files/pull/665) ([jackton1](https://github.com/jackton1))
- chore: update docs [\#664](https://github.com/tj-actions/changed-files/pull/664) ([jackton1](https://github.com/jackton1))
- chore: fix bug with base sha [\#663](https://github.com/tj-actions/changed-files/pull/663) ([jackton1](https://github.com/jackton1))
- chore: dump github context [\#662](https://github.com/tj-actions/changed-files/pull/662) ([jackton1](https://github.com/jackton1))
- fix: error retrieving the base sha [\#661](https://github.com/tj-actions/changed-files/pull/661) ([jackton1](https://github.com/jackton1))
- chore: test using non ascii characters in files input [\#659](https://github.com/tj-actions/changed-files/pull/659) ([jackton1](https://github.com/jackton1))
- Upgraded to v31.0.2 [\#655](https://github.com/tj-actions/changed-files/pull/655) ([jackton1](https://github.com/jackton1))

## [v31.0.2](https://github.com/tj-actions/changed-files/tree/v31.0.2) (2022-09-29)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v31.0.1...v31.0.2)

**Merged pull requests:**

- chore: add back ability to fetch target branch history [\#654](https://github.com/tj-actions/changed-files/pull/654) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update peter-evans/create-pull-request action to v4.1.3 [\#653](https://github.com/tj-actions/changed-files/pull/653) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v31.0.1 [\#652](https://github.com/tj-actions/changed-files/pull/652) ([jackton1](https://github.com/jackton1))

## [v31.0.1](https://github.com/tj-actions/changed-files/tree/v31.0.1) (2022-09-25)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v31.0.0...v31.0.1)

**Merged pull requests:**

- fix: bug with force pushed commits [\#651](https://github.com/tj-actions/changed-files/pull/651) ([jackton1](https://github.com/jackton1))
- Upgraded to v31.0.0 [\#650](https://github.com/tj-actions/changed-files/pull/650) ([jackton1](https://github.com/jackton1))

## [v31.0.0](https://github.com/tj-actions/changed-files/tree/v31.0.0) (2022-09-25)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v30...v31.0.0)

**Merged pull requests:**

- chore: updated test [\#649](https://github.com/tj-actions/changed-files/pull/649) ([jackton1](https://github.com/jackton1))
- chore: update docs [\#648](https://github.com/tj-actions/changed-files/pull/648) ([jackton1](https://github.com/jackton1))
- chore: remove logging the github context [\#647](https://github.com/tj-actions/changed-files/pull/647) ([jackton1](https://github.com/jackton1))
- chore: improve debug message. [\#646](https://github.com/tj-actions/changed-files/pull/646) ([jackton1](https://github.com/jackton1))
- feat: use the last remote commit sha by default for push events [\#644](https://github.com/tj-actions/changed-files/pull/644) ([jackton1](https://github.com/jackton1))
- chore: update test [\#643](https://github.com/tj-actions/changed-files/pull/643) ([jackton1](https://github.com/jackton1))
- chore: update broken link [\#642](https://github.com/tj-actions/changed-files/pull/642) ([jackton1](https://github.com/jackton1))
- Upgraded to v30.0.0 [\#641](https://github.com/tj-actions/changed-files/pull/641) ([jackton1](https://github.com/jackton1))

## [v30](https://github.com/tj-actions/changed-files/tree/v30) (2022-09-24)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v30.0.0...v30)

## [v30.0.0](https://github.com/tj-actions/changed-files/tree/v30.0.0) (2022-09-24)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.9...v30.0.0)

**Fixed bugs:**

- \[BUG\] Can't get all changed files after pushing new commit [\#639](https://github.com/tj-actions/changed-files/issues/639)
- \[BUG\] Add support for pull request close event with merge set to true [\#635](https://github.com/tj-actions/changed-files/issues/635)

**Merged pull requests:**

- feat: add support for closed pull requests with merge true [\#640](https://github.com/tj-actions/changed-files/pull/640) ([jackton1](https://github.com/jackton1))
- chore: log the github context in the test [\#638](https://github.com/tj-actions/changed-files/pull/638) ([jackton1](https://github.com/jackton1))
- chore: update test to run workflow on pull request close event [\#637](https://github.com/tj-actions/changed-files/pull/637) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update peter-evans/create-pull-request action to v4.1.2 [\#636](https://github.com/tj-actions/changed-files/pull/636) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update codacy/codacy-analysis-cli-action action to v4.2.0 [\#634](https://github.com/tj-actions/changed-files/pull/634) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v29.0.9 [\#633](https://github.com/tj-actions/changed-files/pull/633) ([jackton1](https://github.com/jackton1))

## [v29.0.9](https://github.com/tj-actions/changed-files/tree/v29.0.9) (2022-09-20)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29...v29.0.9)

## [v29](https://github.com/tj-actions/changed-files/tree/v29) (2022-09-20)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.8...v29)

**Implemented enhancements:**

- \[Feature\] Publish `v29` release that redirects to the latest version within the major version [\#612](https://github.com/tj-actions/changed-files/issues/612)

**Merged pull requests:**

- Upgraded to v29.0.8 [\#632](https://github.com/tj-actions/changed-files/pull/632) ([jackton1](https://github.com/jackton1))

## [v29.0.8](https://github.com/tj-actions/changed-files/tree/v29.0.8) (2022-09-20)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.7...v29.0.8)

**Implemented enhancements:**

- \[Feature\] Improve docs related to "files" [\#629](https://github.com/tj-actions/changed-files/issues/629)

**Merged pull requests:**

- chore\(deps\): update tj-actions/sync-release-version action to v13 [\#631](https://github.com/tj-actions/changed-files/pull/631) ([renovate[bot]](https://github.com/apps/renovate))
- chore: update docs to include notice about using quotes in multiline patterns [\#630](https://github.com/tj-actions/changed-files/pull/630) ([jackton1](https://github.com/jackton1))
- Upgraded to v29.0.7 [\#628](https://github.com/tj-actions/changed-files/pull/628) ([jackton1](https://github.com/jackton1))

## [v29.0.7](https://github.com/tj-actions/changed-files/tree/v29.0.7) (2022-09-13)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.6...v29.0.7)

**Merged pull requests:**

- fix: bug with setting the LAST\_REMOTE\_COMMIT [\#627](https://github.com/tj-actions/changed-files/pull/627) ([jackton1](https://github.com/jackton1))
- Upgraded to v29.0.6 [\#626](https://github.com/tj-actions/changed-files/pull/626) ([jackton1](https://github.com/jackton1))

## [v29.0.6](https://github.com/tj-actions/changed-files/tree/v29.0.6) (2022-09-13)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.5...v29.0.6)

**Fixed bugs:**

- \[BUG\] since\_last\_remote\_commit does not work in v29.0.4 [\#623](https://github.com/tj-actions/changed-files/issues/623)

**Merged pull requests:**

- Upgraded to v29.0.5 [\#625](https://github.com/tj-actions/changed-files/pull/625) ([jackton1](https://github.com/jackton1))

## [v29.0.5](https://github.com/tj-actions/changed-files/tree/v29.0.5) (2022-09-13)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.4...v29.0.5)

**Fixed bugs:**

- \[BUG\] Unable to fetch file changes on merge event [\#615](https://github.com/tj-actions/changed-files/issues/615)

**Merged pull requests:**

- fix: bug with last remote commit sha [\#624](https://github.com/tj-actions/changed-files/pull/624) ([jackton1](https://github.com/jackton1))
- chore: update README.md [\#622](https://github.com/tj-actions/changed-files/pull/622) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/github-changelog-generator action to v1.15 [\#621](https://github.com/tj-actions/changed-files/pull/621) ([renovate[bot]](https://github.com/apps/renovate))
- feat: warn when since/until inputs are set but not corresponding sha is found [\#620](https://github.com/tj-actions/changed-files/pull/620) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#619](https://github.com/tj-actions/changed-files/pull/619) ([jackton1](https://github.com/jackton1))
- Upgraded to v29.0.4 [\#618](https://github.com/tj-actions/changed-files/pull/618) ([jackton1](https://github.com/jackton1))

## [v29.0.4](https://github.com/tj-actions/changed-files/tree/v29.0.4) (2022-09-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.3...v29.0.4)

**Fixed bugs:**

- \[BUG\] Changed files are always missed on macOS [\#614](https://github.com/tj-actions/changed-files/issues/614)

**Closed issues:**

- Looping over files with spaces. [\#609](https://github.com/tj-actions/changed-files/issues/609)
- stale github.community reference [\#608](https://github.com/tj-actions/changed-files/issues/608)

**Merged pull requests:**

- fix: bug with similar commits when github.event.before is empty [\#617](https://github.com/tj-actions/changed-files/pull/617) ([jackton1](https://github.com/jackton1))
- chore: set defaults for until and since inputs [\#616](https://github.com/tj-actions/changed-files/pull/616) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#613](https://github.com/tj-actions/changed-files/pull/613) ([jackton1](https://github.com/jackton1))
- chore: test using for loop with output [\#611](https://github.com/tj-actions/changed-files/pull/611) ([jackton1](https://github.com/jackton1))
- docs: update reference to setting input env variables [\#610](https://github.com/tj-actions/changed-files/pull/610) ([jackton1](https://github.com/jackton1))
- Upgraded to v29.0.3 [\#607](https://github.com/tj-actions/changed-files/pull/607) ([jackton1](https://github.com/jackton1))

## [v29.0.3](https://github.com/tj-actions/changed-files/tree/v29.0.3) (2022-09-03)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.2...v29.0.3)

**Merged pull requests:**

- fix: bug using invalid fetch-depth [\#606](https://github.com/tj-actions/changed-files/pull/606) ([jackton1](https://github.com/jackton1))
- Upgraded to v29.0.2 [\#604](https://github.com/tj-actions/changed-files/pull/604) ([jackton1](https://github.com/jackton1))

## [v29.0.2](https://github.com/tj-actions/changed-files/tree/v29.0.2) (2022-08-29)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.1...v29.0.2)

**Implemented enhancements:**

- \[Feature\] Get all changes on current branch against a base\_sha [\#599](https://github.com/tj-actions/changed-files/issues/599)

**Fixed bugs:**

- \[BUG\] dir\_names = true not returning directories with changed files [\#598](https://github.com/tj-actions/changed-files/issues/598)

**Merged pull requests:**

- chore: remove unused input [\#603](https://github.com/tj-actions/changed-files/pull/603) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/branch-names action to v6 [\#602](https://github.com/tj-actions/changed-files/pull/602) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v29.0.1 [\#601](https://github.com/tj-actions/changed-files/pull/601) ([jackton1](https://github.com/jackton1))

## [v29.0.1](https://github.com/tj-actions/changed-files/tree/v29.0.1) (2022-08-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v29.0.0...v29.0.1)

**Merged pull requests:**

- fix: bug with dir name [\#600](https://github.com/tj-actions/changed-files/pull/600) ([jackton1](https://github.com/jackton1))
- Upgraded to v29.0.0 [\#597](https://github.com/tj-actions/changed-files/pull/597) ([jackton1](https://github.com/jackton1))

## [v29.0.0](https://github.com/tj-actions/changed-files/tree/v29.0.0) (2022-08-23)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v28.0.0...v29.0.0)

**Merged pull requests:**

- chore\(deps\): update tj-actions/glob to v12 [\#596](https://github.com/tj-actions/changed-files/pull/596) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/verify-changed-files action to v11 [\#595](https://github.com/tj-actions/changed-files/pull/595) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): Update tj-actions/glob to v11.1 [\#594](https://github.com/tj-actions/changed-files/pull/594) ([jackton1](https://github.com/jackton1))
- Upgraded to v28.0.0 [\#592](https://github.com/tj-actions/changed-files/pull/592) ([jackton1](https://github.com/jackton1))

## [v28.0.0](https://github.com/tj-actions/changed-files/tree/v28.0.0) (2022-08-21)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v28...v28.0.0)

**Merged pull requests:**

- chore: update readme [\#591](https://github.com/tj-actions/changed-files/pull/591) ([jackton1](https://github.com/jackton1))
- Upgraded to v28 [\#589](https://github.com/tj-actions/changed-files/pull/589) ([jackton1](https://github.com/jackton1))

## [v28](https://github.com/tj-actions/changed-files/tree/v28) (2022-08-21)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v27...v28)

**Implemented enhancements:**

- \[Feature\] An option to include old names of renamed files in deleted\_files array [\#578](https://github.com/tj-actions/changed-files/issues/578)
- \[Feature\] List files changed/modified/... by commits pushed in passed hours/days/weeks [\#452](https://github.com/tj-actions/changed-files/issues/452)

**Fixed bugs:**

- \[BUG\] changes based on last remote commit fail after rebasing [\#546](https://github.com/tj-actions/changed-files/issues/546)

**Merged pull requests:**

- feat: add support for using time based filtering. [\#588](https://github.com/tj-actions/changed-files/pull/588) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#587](https://github.com/tj-actions/changed-files/pull/587) ([jackton1](https://github.com/jackton1))
- chore: remove skip for forks [\#586](https://github.com/tj-actions/changed-files/pull/586) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update peter-evans/create-pull-request action to v4.1.1 [\#585](https://github.com/tj-actions/changed-files/pull/585) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v27 [\#584](https://github.com/tj-actions/changed-files/pull/584) ([jackton1](https://github.com/jackton1))

## [v27](https://github.com/tj-actions/changed-files/tree/v27) (2022-08-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v26.1...v27)

**Merged pull requests:**

- fix: bug force pushing commits after a rebase [\#583](https://github.com/tj-actions/changed-files/pull/583) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#582](https://github.com/tj-actions/changed-files/pull/582) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update peter-evans/create-pull-request action to v4.1.0 [\#581](https://github.com/tj-actions/changed-files/pull/581) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v26.1 [\#580](https://github.com/tj-actions/changed-files/pull/580) ([jackton1](https://github.com/jackton1))

## [v26.1](https://github.com/tj-actions/changed-files/tree/v26.1) (2022-08-15)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v26...v26.1)

**Merged pull requests:**

- fix: error retrieving base sha. [\#579](https://github.com/tj-actions/changed-files/pull/579) ([jackton1](https://github.com/jackton1))
- Upgraded to v26 [\#577](https://github.com/tj-actions/changed-files/pull/577) ([jackton1](https://github.com/jackton1))

## [v26](https://github.com/tj-actions/changed-files/tree/v26) (2022-08-15)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v25...v26)

**Implemented enhancements:**

- \[Feature\] Git version dependency [\#564](https://github.com/tj-actions/changed-files/issues/564)

**Fixed bugs:**

- \[BUG\] Will output all changed files if not file matches the `**/*.sql` pattern [\#565](https://github.com/tj-actions/changed-files/issues/565)

**Merged pull requests:**

- chore: remove extra space. [\#576](https://github.com/tj-actions/changed-files/pull/576) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#575](https://github.com/tj-actions/changed-files/pull/575) ([jackton1](https://github.com/jackton1))
- docs: add thyarles as a contributor for code [\#574](https://github.com/tj-actions/changed-files/pull/574) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- chore: restrict rename test to non forks [\#573](https://github.com/tj-actions/changed-files/pull/573) ([jackton1](https://github.com/jackton1))
- feat: validate the minimum required git version [\#572](https://github.com/tj-actions/changed-files/pull/572) ([jackton1](https://github.com/jackton1))
- chore: remove unused code [\#571](https://github.com/tj-actions/changed-files/pull/571) ([jackton1](https://github.com/jackton1))
- improvement: Simplify checks [\#570](https://github.com/tj-actions/changed-files/pull/570) ([thyarles](https://github.com/thyarles))
- Upgraded to v25 [\#567](https://github.com/tj-actions/changed-files/pull/567) ([jackton1](https://github.com/jackton1))

## [v25](https://github.com/tj-actions/changed-files/tree/v25) (2022-08-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v24.1...v25)

**Fixed bugs:**

- \[BUG\] missing opening '\(' then stop with windows-latest [\#562](https://github.com/tj-actions/changed-files/issues/562)

**Merged pull requests:**

- chore\(deps\): upgrade tj-actions/glob v9.2 to v10 [\#566](https://github.com/tj-actions/changed-files/pull/566) ([jackton1](https://github.com/jackton1))
- Upgraded to v24.1 [\#561](https://github.com/tj-actions/changed-files/pull/561) ([jackton1](https://github.com/jackton1))

## [v24.1](https://github.com/tj-actions/changed-files/tree/v24.1) (2022-08-03)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v24...v24.1)

**Implemented enhancements:**

- \[Feature\] Execute against master [\#556](https://github.com/tj-actions/changed-files/issues/556)
- \[Feature\]  implement an outputs for matrix compatible jobs [\#530](https://github.com/tj-actions/changed-files/issues/530)

**Fixed bugs:**

- \[BUG\] Separator removing double-quotes [\#545](https://github.com/tj-actions/changed-files/issues/545)

**Merged pull requests:**

- fix: bug with matrix job [\#560](https://github.com/tj-actions/changed-files/pull/560) ([jackton1](https://github.com/jackton1))
- fix: bug with matrix job [\#559](https://github.com/tj-actions/changed-files/pull/559) ([jackton1](https://github.com/jackton1))
- chore: update action name [\#558](https://github.com/tj-actions/changed-files/pull/558) ([jackton1](https://github.com/jackton1))
- feat: add support for json formatted output. [\#557](https://github.com/tj-actions/changed-files/pull/557) ([jackton1](https://github.com/jackton1))
- Upgraded to v24 [\#555](https://github.com/tj-actions/changed-files/pull/555) ([jackton1](https://github.com/jackton1))

## [v24](https://github.com/tj-actions/changed-files/tree/v24) (2022-07-22)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v23.2...v24)

**Fixed bugs:**

- \[BUG\] PREVIOUS\_SHA & CURRENT\_SHA is the same when re-running a workflow, causing changed-files to be empty [\#547](https://github.com/tj-actions/changed-files/issues/547)
- \[BUG\] Keep the same commit SHA between workflows [\#543](https://github.com/tj-actions/changed-files/issues/543)

**Merged pull requests:**

- fix: error raised for the first repo commit [\#554](https://github.com/tj-actions/changed-files/pull/554) ([jackton1](https://github.com/jackton1))
- chore: Update README.md [\#553](https://github.com/tj-actions/changed-files/pull/553) ([jackton1](https://github.com/jackton1))
- chore: update README.md [\#552](https://github.com/tj-actions/changed-files/pull/552) ([jackton1](https://github.com/jackton1))
- Upgraded to v23.2 [\#551](https://github.com/tj-actions/changed-files/pull/551) ([jackton1](https://github.com/jackton1))

## [v23.2](https://github.com/tj-actions/changed-files/tree/v23.2) (2022-07-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v23.1...v23.2)

**Fixed bugs:**

- \[BUG\] Repo name changed, workflows are broken [\#542](https://github.com/tj-actions/changed-files/issues/542)

**Merged pull requests:**

- feat: fix bug with similar commit hashes. [\#549](https://github.com/tj-actions/changed-files/pull/549) ([jackton1](https://github.com/jackton1))
- chore: update readme [\#544](https://github.com/tj-actions/changed-files/pull/544) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/github-changelog-generator action to v1.14 [\#541](https://github.com/tj-actions/changed-files/pull/541) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#540](https://github.com/tj-actions/changed-files/pull/540) ([jackton1](https://github.com/jackton1))
- chore: update test [\#539](https://github.com/tj-actions/changed-files/pull/539) ([jackton1](https://github.com/jackton1))
- chore: update README.md [\#538](https://github.com/tj-actions/changed-files/pull/538) ([jackton1](https://github.com/jackton1))
- docs: add JoeOvo as a contributor for doc [\#537](https://github.com/tj-actions/changed-files/pull/537) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Update README.md [\#536](https://github.com/tj-actions/changed-files/pull/536) ([JoeOvo](https://github.com/JoeOvo))
- Upgraded to v23.1 [\#535](https://github.com/tj-actions/changed-files/pull/535) ([jackton1](https://github.com/jackton1))

## [v23.1](https://github.com/tj-actions/changed-files/tree/v23.1) (2022-06-24)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v23...v23.1)

**Fixed bugs:**

- \[BUG\] Misleading error if git command is missing [\#532](https://github.com/tj-actions/changed-files/issues/532)

**Merged pull requests:**

- chore: removed unused code [\#534](https://github.com/tj-actions/changed-files/pull/534) ([jackton1](https://github.com/jackton1))
- chore: improve error handling [\#533](https://github.com/tj-actions/changed-files/pull/533) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/verify-changed-files action to v10 [\#531](https://github.com/tj-actions/changed-files/pull/531) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#528](https://github.com/tj-actions/changed-files/pull/528) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update codacy/codacy-analysis-cli-action action to v4.1.0 [\#527](https://github.com/tj-actions/changed-files/pull/527) ([renovate[bot]](https://github.com/apps/renovate))
- docs: add deronnax as a contributor for doc [\#526](https://github.com/tj-actions/changed-files/pull/526) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- fix mispellings [\#525](https://github.com/tj-actions/changed-files/pull/525) ([deronnax](https://github.com/deronnax))
- chore: reformat manual-test.yml [\#524](https://github.com/tj-actions/changed-files/pull/524) ([jackton1](https://github.com/jackton1))
- Upgraded to v23 [\#523](https://github.com/tj-actions/changed-files/pull/523) ([jackton1](https://github.com/jackton1))

## [v23](https://github.com/tj-actions/changed-files/tree/v23) (2022-06-12)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v22.2...v23)

**Implemented enhancements:**

- \[Feature\] Get distinct changed folders [\#504](https://github.com/tj-actions/changed-files/issues/504)

**Fixed bugs:**

- \[BUG\] Action does not work when running with `act` anymore [\#518](https://github.com/tj-actions/changed-files/issues/518)

**Merged pull requests:**

- feat: add support for returning directory names [\#522](https://github.com/tj-actions/changed-files/pull/522) ([jackton1](https://github.com/jackton1))
- feat: use debug messages for log outputs [\#521](https://github.com/tj-actions/changed-files/pull/521) ([jackton1](https://github.com/jackton1))
- chore: clean up internal variables. [\#520](https://github.com/tj-actions/changed-files/pull/520) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update peter-evans/create-pull-request action to v4.0.4 [\#519](https://github.com/tj-actions/changed-files/pull/519) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v22.2 [\#517](https://github.com/tj-actions/changed-files/pull/517) ([jackton1](https://github.com/jackton1))

## [v22.2](https://github.com/tj-actions/changed-files/tree/v22.2) (2022-06-02)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v22.1...v22.2)

**Fixed bugs:**

- \[BUG\] "Unable to locate the current sha" when using `use_fork_point ` [\#506](https://github.com/tj-actions/changed-files/issues/506)

**Merged pull requests:**

- Updated README.md [\#516](https://github.com/tj-actions/changed-files/pull/516) ([jackton1](https://github.com/jackton1))
- feat: add support for configuring diff.relative [\#515](https://github.com/tj-actions/changed-files/pull/515) ([jackton1](https://github.com/jackton1))
- Upgraded to v22.1 [\#514](https://github.com/tj-actions/changed-files/pull/514) ([jackton1](https://github.com/jackton1))

## [v22.1](https://github.com/tj-actions/changed-files/tree/v22.1) (2022-05-31)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v22...v22.1)

**Merged pull requests:**

- chore: upgrade tj-actions/glob from v9 to v9.2 [\#513](https://github.com/tj-actions/changed-files/pull/513) ([jackton1](https://github.com/jackton1))
- Upgraded to v22 [\#512](https://github.com/tj-actions/changed-files/pull/512) ([jackton1](https://github.com/jackton1))

## [v22](https://github.com/tj-actions/changed-files/tree/v22) (2022-05-31)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v21...v22)

**Implemented enhancements:**

- \[Feature\] since\_last\_passing\_remote\_commit  [\#507](https://github.com/tj-actions/changed-files/issues/507)

**Merged pull requests:**

- Updated README.md [\#511](https://github.com/tj-actions/changed-files/pull/511) ([jackton1](https://github.com/jackton1))
- chore: Update README.md [\#510](https://github.com/tj-actions/changed-files/pull/510) ([jackton1](https://github.com/jackton1))
- Bump tj-actions/glob from 7.20 to 9 [\#509](https://github.com/tj-actions/changed-files/pull/509) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore: explicitly set the GITHUB\_WORKSPACE environment variable [\#505](https://github.com/tj-actions/changed-files/pull/505) ([jackton1](https://github.com/jackton1))
- Upgraded to v21 [\#503](https://github.com/tj-actions/changed-files/pull/503) ([jackton1](https://github.com/jackton1))

## [v21](https://github.com/tj-actions/changed-files/tree/v21) (2022-05-25)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v20.2...v21)

**Implemented enhancements:**

- \[Feature\] Handle Pipeline Error [\#500](https://github.com/tj-actions/changed-files/issues/500)

**Fixed bugs:**

- \[BUG\] System.InvalidOperationException: Maximum object size exceeded [\#501](https://github.com/tj-actions/changed-files/issues/501)

**Merged pull requests:**

- fix: large output generated by all\_old\_new\_renamed\_files output [\#502](https://github.com/tj-actions/changed-files/pull/502) ([jackton1](https://github.com/jackton1))
- Upgraded to v20.2 [\#499](https://github.com/tj-actions/changed-files/pull/499) ([jackton1](https://github.com/jackton1))

## [v20.2](https://github.com/tj-actions/changed-files/tree/v20.2) (2022-05-24)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v20.1...v20.2)

**Fixed bugs:**

- \[BUG\] all\_old\_new\_renamed\_files is empty when providing a glob pattern. [\#467](https://github.com/tj-actions/changed-files/issues/467)

**Merged pull requests:**

- fix: matching renamed files with glob patterns [\#498](https://github.com/tj-actions/changed-files/pull/498) ([jackton1](https://github.com/jackton1))
- chore: Improve test coverage [\#497](https://github.com/tj-actions/changed-files/pull/497) ([jackton1](https://github.com/jackton1))
- Upgraded to v20.1 [\#496](https://github.com/tj-actions/changed-files/pull/496) ([jackton1](https://github.com/jackton1))

## [v20.1](https://github.com/tj-actions/changed-files/tree/v20.1) (2022-05-22)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v20...v20.1)

**Fixed bugs:**

- \[BUG\] Glob pattern doesn't work for markdown files  [\#492](https://github.com/tj-actions/changed-files/issues/492)
- \[BUG\] Using the fork point to detect file changes. [\#355](https://github.com/tj-actions/changed-files/issues/355)

**Merged pull requests:**

- chore: test rename [\#495](https://github.com/tj-actions/changed-files/pull/495) ([jackton1](https://github.com/jackton1))
- chore: Update README.md [\#494](https://github.com/tj-actions/changed-files/pull/494) ([jackton1](https://github.com/jackton1))
- Upgraded to v20 [\#491](https://github.com/tj-actions/changed-files/pull/491) ([jackton1](https://github.com/jackton1))

## [v20](https://github.com/tj-actions/changed-files/tree/v20) (2022-05-15)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v19.3...v20)

**Merged pull requests:**

- fix: bug finding fork point commit and removed unused temp\_changed\_files remote. [\#490](https://github.com/tj-actions/changed-files/pull/490) ([jackton1](https://github.com/jackton1))
- Upgraded to v19.3 [\#489](https://github.com/tj-actions/changed-files/pull/489) ([jackton1](https://github.com/jackton1))

## [v19.3](https://github.com/tj-actions/changed-files/tree/v19.3) (2022-05-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v19.2...v19.3)

**Merged pull requests:**

- fix: bug with renames [\#488](https://github.com/tj-actions/changed-files/pull/488) ([jackton1](https://github.com/jackton1))
- Upgraded to v19.2 [\#487](https://github.com/tj-actions/changed-files/pull/487) ([jackton1](https://github.com/jackton1))

## [v19.2](https://github.com/tj-actions/changed-files/tree/v19.2) (2022-05-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v19.1...v19.2)

**Merged pull requests:**

- feat/add support for retrieving old and new names of renamed files [\#486](https://github.com/tj-actions/changed-files/pull/486) ([jackton1](https://github.com/jackton1))
- Revert "feat: Added support for returning old and new names of renamed files" [\#485](https://github.com/tj-actions/changed-files/pull/485) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#484](https://github.com/tj-actions/changed-files/pull/484) ([jackton1](https://github.com/jackton1))
- feat: Added support for returning old and new names of renamed files [\#483](https://github.com/tj-actions/changed-files/pull/483) ([jackton1](https://github.com/jackton1))
- Upgraded to v19.1 [\#482](https://github.com/tj-actions/changed-files/pull/482) ([jackton1](https://github.com/jackton1))

## [v19.1](https://github.com/tj-actions/changed-files/tree/v19.1) (2022-05-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v19...v19.1)

**Fixed bugs:**

- \[BUG\] Glob pattern for markdown files doesn't work properly [\#479](https://github.com/tj-actions/changed-files/issues/479)
- \[BUG\] Fails in Self-Hosted Runner [\#477](https://github.com/tj-actions/changed-files/issues/477)
- \[BUG\] File names with non ascii characters results in octal escape sequence output [\#437](https://github.com/tj-actions/changed-files/issues/437)

**Merged pull requests:**

- chore\(deps\): update tj-actions/glob action to v7.20 [\#481](https://github.com/tj-actions/changed-files/pull/481) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/glob action to v7.18 [\#480](https://github.com/tj-actions/changed-files/pull/480) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update pascalgn/automerge-action action to v0.15.3 [\#478](https://github.com/tj-actions/changed-files/pull/478) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update peter-evans/create-pull-request action to v4.0.3 [\#476](https://github.com/tj-actions/changed-files/pull/476) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/glob action to v7.17 [\#475](https://github.com/tj-actions/changed-files/pull/475) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v19 [\#474](https://github.com/tj-actions/changed-files/pull/474) ([jackton1](https://github.com/jackton1))

## [v19](https://github.com/tj-actions/changed-files/tree/v19) (2022-04-28)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18.7...v19)

**Implemented enhancements:**

- \[Feature\] List previous paths of renamed files as deleted files [\#468](https://github.com/tj-actions/changed-files/issues/468)

**Closed issues:**

- Not listing renamed file with previous path in deleted\_files list [\#466](https://github.com/tj-actions/changed-files/issues/466)

**Merged pull requests:**

- feat: Add support for non ascii filenames [\#473](https://github.com/tj-actions/changed-files/pull/473) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update github/codeql-action action to v2 [\#472](https://github.com/tj-actions/changed-files/pull/472) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update reviewdog/action-shellcheck action to v1.15 [\#471](https://github.com/tj-actions/changed-files/pull/471) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update actions/checkout action to v3.0.2 [\#470](https://github.com/tj-actions/changed-files/pull/470) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update actions/checkout action to v3.0.1 [\#465](https://github.com/tj-actions/changed-files/pull/465) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/glob action to v7.16 [\#464](https://github.com/tj-actions/changed-files/pull/464) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update peter-evans/create-pull-request action to v4.0.2 [\#463](https://github.com/tj-actions/changed-files/pull/463) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v18.7 [\#462](https://github.com/tj-actions/changed-files/pull/462) ([jackton1](https://github.com/jackton1))

## [v18.7](https://github.com/tj-actions/changed-files/tree/v18.7) (2022-04-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18.6...v18.7)

**Fixed bugs:**

- \[BUG\] Modified files treated as `Non Matching modified files` [\#450](https://github.com/tj-actions/changed-files/issues/450)

**Merged pull requests:**

- chore\(deps\): update peter-evans/create-pull-request action to v4.0.1 [\#461](https://github.com/tj-actions/changed-files/pull/461) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v18.6 [\#460](https://github.com/tj-actions/changed-files/pull/460) ([jackton1](https://github.com/jackton1))

## [v18.6](https://github.com/tj-actions/changed-files/tree/v18.6) (2022-03-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18.5...v18.6)

**Fixed bugs:**

- \[BUG\] Intermittent "Unable to locate the current sha" [\#458](https://github.com/tj-actions/changed-files/issues/458)

**Merged pull requests:**

- fix: resolved error with escaping unicode unsafe characters [\#459](https://github.com/tj-actions/changed-files/pull/459) ([jackton1](https://github.com/jackton1))
- chore: remove unused code [\#457](https://github.com/tj-actions/changed-files/pull/457) ([jackton1](https://github.com/jackton1))
- chore: test changes to .github workflows files [\#456](https://github.com/tj-actions/changed-files/pull/456) ([jackton1](https://github.com/jackton1))
- chore: test filenames that should be escaped [\#455](https://github.com/tj-actions/changed-files/pull/455) ([jackton1](https://github.com/jackton1))
- Upgraded to v18.5 [\#454](https://github.com/tj-actions/changed-files/pull/454) ([jackton1](https://github.com/jackton1))

## [v18.5](https://github.com/tj-actions/changed-files/tree/v18.5) (2022-03-29)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18.4...v18.5)

**Implemented enhancements:**

- \[Feature\] Get changes from all commits from a single push [\#447](https://github.com/tj-actions/changed-files/issues/447)

**Fixed bugs:**

- \[BUG\] Not able to compare current commit with the specific commit of a branch\(in the Pull request event\) [\#441](https://github.com/tj-actions/changed-files/issues/441)

**Merged pull requests:**

- fix: bug passing invalid patterns to grep [\#453](https://github.com/tj-actions/changed-files/pull/453) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/glob action to v7.12 [\#451](https://github.com/tj-actions/changed-files/pull/451) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update pascalgn/automerge-action action to v0.15.2 [\#449](https://github.com/tj-actions/changed-files/pull/449) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update pascalgn/automerge-action action to v0.14.4 [\#448](https://github.com/tj-actions/changed-files/pull/448) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update peter-evans/create-pull-request action to v4 [\#446](https://github.com/tj-actions/changed-files/pull/446) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/glob action to v7.11 [\#445](https://github.com/tj-actions/changed-files/pull/445) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#444](https://github.com/tj-actions/changed-files/pull/444) ([jackton1](https://github.com/jackton1))
- Upgraded to v18.4 [\#443](https://github.com/tj-actions/changed-files/pull/443) ([jackton1](https://github.com/jackton1))

## [v18.4](https://github.com/tj-actions/changed-files/tree/v18.4) (2022-03-21)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18.3...v18.4)

**Merged pull requests:**

- Bump tj-actions/remark from 2.3 to 3 [\#442](https://github.com/tj-actions/changed-files/pull/442) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): update tj-actions/glob action to v7.10 [\#440](https://github.com/tj-actions/changed-files/pull/440) ([renovate[bot]](https://github.com/apps/renovate))
- Update README.md [\#439](https://github.com/tj-actions/changed-files/pull/439) ([jackton1](https://github.com/jackton1))
- Upgraded to v18.3 [\#438](https://github.com/tj-actions/changed-files/pull/438) ([jackton1](https://github.com/jackton1))

## [v18.3](https://github.com/tj-actions/changed-files/tree/v18.3) (2022-03-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18.2...v18.3)

**Merged pull requests:**

- chore\(deps\): update tj-actions/glob action to v7.9 [\#436](https://github.com/tj-actions/changed-files/pull/436) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v18.2 [\#435](https://github.com/tj-actions/changed-files/pull/435) ([jackton1](https://github.com/jackton1))

## [v18.2](https://github.com/tj-actions/changed-files/tree/v18.2) (2022-03-16)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18.1...v18.2)

**Fixed bugs:**

- \[BUG\] Glob Pattern Incorrect? [\#433](https://github.com/tj-actions/changed-files/issues/433)
- \[BUG\] Providing files\_ignore without using files input doesn't exclude ignored files [\#429](https://github.com/tj-actions/changed-files/issues/429)

**Merged pull requests:**

- fix: bug omitting the fetch-depth for push based events [\#434](https://github.com/tj-actions/changed-files/pull/434) ([jackton1](https://github.com/jackton1))
- Upgraded to v18.1 [\#432](https://github.com/tj-actions/changed-files/pull/432) ([jackton1](https://github.com/jackton1))

## [v18.1](https://github.com/tj-actions/changed-files/tree/v18.1) (2022-03-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v18...v18.1)

**Merged pull requests:**

- fix: bug providing files\_ignore without files input [\#431](https://github.com/tj-actions/changed-files/pull/431) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/glob action to v7.7 [\#430](https://github.com/tj-actions/changed-files/pull/430) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/glob action to v7.6 [\#428](https://github.com/tj-actions/changed-files/pull/428) ([renovate[bot]](https://github.com/apps/renovate))
- chore\(deps\): update tj-actions/github-changelog-generator action to v1.13 [\#427](https://github.com/tj-actions/changed-files/pull/427) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v18 [\#426](https://github.com/tj-actions/changed-files/pull/426) ([jackton1](https://github.com/jackton1))

## [v18](https://github.com/tj-actions/changed-files/tree/v18) (2022-03-14)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v17.3...v18)

**Fixed bugs:**

- \[BUG\] Separator `\n` only outputs first changed file [\#417](https://github.com/tj-actions/changed-files/issues/417)
- \[BUG\] Argument list too long with files input [\#367](https://github.com/tj-actions/changed-files/issues/367)

**Merged pull requests:**

- feat: Add support for using file patterns on disk [\#425](https://github.com/tj-actions/changed-files/pull/425) ([jackton1](https://github.com/jackton1))
- chore\(deps\): update tj-actions/glob action to v7.5 [\#424](https://github.com/tj-actions/changed-files/pull/424) ([renovate[bot]](https://github.com/apps/renovate))
- Update tj-actions/verify-changed-files action to v9 [\#423](https://github.com/tj-actions/changed-files/pull/423) ([renovate[bot]](https://github.com/apps/renovate))
- chore: Upgrade tj-actions/glob to v7.4 [\#422](https://github.com/tj-actions/changed-files/pull/422) ([jackton1](https://github.com/jackton1))
- Update codacy/codacy-analysis-cli-action action to v4.0.2 [\#421](https://github.com/tj-actions/changed-files/pull/421) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v17.3 [\#420](https://github.com/tj-actions/changed-files/pull/420) ([jackton1](https://github.com/jackton1))

## [v17.3](https://github.com/tj-actions/changed-files/tree/v17.3) (2022-03-08)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v17.2...v17.3)

**Fixed bugs:**

- \[BUG\] Argument too long [\#419](https://github.com/tj-actions/changed-files/issues/419)
- failed to  Get list of files on pull request merge [\#414](https://github.com/tj-actions/changed-files/issues/414)
- \[BUG\] Get all modified/deleted/added files from a Pull Request [\#410](https://github.com/tj-actions/changed-files/issues/410)

**Closed issues:**

- \[BUG\] Unexpected result [\#412](https://github.com/tj-actions/changed-files/issues/412)

**Merged pull requests:**

- fix: bug using newline separator [\#418](https://github.com/tj-actions/changed-files/pull/418) ([jackton1](https://github.com/jackton1))
- Revert "chore: test pull\_requests events" [\#416](https://github.com/tj-actions/changed-files/pull/416) ([jackton1](https://github.com/jackton1))
- chore: test pull\_requests events [\#415](https://github.com/tj-actions/changed-files/pull/415) ([jackton1](https://github.com/jackton1))
- Update codacy/codacy-analysis-cli-action action to v4.0.1 [\#413](https://github.com/tj-actions/changed-files/pull/413) ([renovate[bot]](https://github.com/apps/renovate))
- Update actions/checkout action [\#411](https://github.com/tj-actions/changed-files/pull/411) ([renovate[bot]](https://github.com/apps/renovate))
- Update peter-evans/create-pull-request action to v3.14.0 [\#409](https://github.com/tj-actions/changed-files/pull/409) ([renovate[bot]](https://github.com/apps/renovate))
- Update peter-evans/create-pull-request action to v3.13.0 [\#408](https://github.com/tj-actions/changed-files/pull/408) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v17.2 [\#407](https://github.com/tj-actions/changed-files/pull/407) ([jackton1](https://github.com/jackton1))

## [v17.2](https://github.com/tj-actions/changed-files/tree/v17.2) (2022-02-27)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v17.1...v17.2)

**Fixed bugs:**

- \[BUG\] Gracefully handle errors for repositories without any previous commits [\#365](https://github.com/tj-actions/changed-files/issues/365)

**Merged pull requests:**

- fix: bug detecting other deleted and modified [\#406](https://github.com/tj-actions/changed-files/pull/406) ([jackton1](https://github.com/jackton1))
- Upgraded to v17.1 [\#405](https://github.com/tj-actions/changed-files/pull/405) ([jackton1](https://github.com/jackton1))

## [v17.1](https://github.com/tj-actions/changed-files/tree/v17.1) (2022-02-26)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v17...v17.1)

**Closed issues:**

- How can I set the action to review all commits since the last workflow run? [\#400](https://github.com/tj-actions/changed-files/issues/400)

**Merged pull requests:**

- fix: handle errors for repositories without any previous commit history [\#404](https://github.com/tj-actions/changed-files/pull/404) ([jackton1](https://github.com/jackton1))
- Updated submodule [\#403](https://github.com/tj-actions/changed-files/pull/403) ([jackton1](https://github.com/jackton1))
- Update tj-actions/github-changelog-generator action to v1.12 [\#402](https://github.com/tj-actions/changed-files/pull/402) ([renovate[bot]](https://github.com/apps/renovate))
- chore: switch sed for awk [\#401](https://github.com/tj-actions/changed-files/pull/401) ([jackton1](https://github.com/jackton1))
- Upgraded to v17 [\#399](https://github.com/tj-actions/changed-files/pull/399) ([jackton1](https://github.com/jackton1))

## [v17](https://github.com/tj-actions/changed-files/tree/v17) (2022-02-23)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v16...v17)

**Implemented enhancements:**

- \[Feature\] Add support for detecting changes in submodules [\#349](https://github.com/tj-actions/changed-files/issues/349)

**Fixed bugs:**

- \[BUG\] It looks like no value such as any\_changed has been written. [\#393](https://github.com/tj-actions/changed-files/issues/393)

**Merged pull requests:**

- Updated README.md [\#398](https://github.com/tj-actions/changed-files/pull/398) ([jackton1](https://github.com/jackton1))
- docs: add pkit as a contributor for code [\#397](https://github.com/tj-actions/changed-files/pull/397) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- feat: Add support for detecting submodules changes [\#394](https://github.com/tj-actions/changed-files/pull/394) ([pkit](https://github.com/pkit))
- Updated README.md [\#392](https://github.com/tj-actions/changed-files/pull/392) ([jackton1](https://github.com/jackton1))
- docs: add fagai as a contributor for doc [\#391](https://github.com/tj-actions/changed-files/pull/391) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- fix README [\#390](https://github.com/tj-actions/changed-files/pull/390) ([fagai](https://github.com/fagai))
- Upgraded to v16 [\#389](https://github.com/tj-actions/changed-files/pull/389) ([jackton1](https://github.com/jackton1))

## [v16](https://github.com/tj-actions/changed-files/tree/v16) (2022-02-18)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v15...v16)

**Implemented enhancements:**

- \[Feature\] `since_last_remote_commit` incorrect `on: push` of new branch [\#387](https://github.com/tj-actions/changed-files/issues/387)

**Merged pull requests:**

- feat: Use previous commit when since\_last\_remote\_commit is set to true [\#388](https://github.com/tj-actions/changed-files/pull/388) ([jackton1](https://github.com/jackton1))
- Upgraded to v15.1 [\#386](https://github.com/tj-actions/changed-files/pull/386) ([jackton1](https://github.com/jackton1))

## [v15](https://github.com/tj-actions/changed-files/tree/v15) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v15.1...v15)

## [v15.1](https://github.com/tj-actions/changed-files/tree/v15.1) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.0.1...v15.1)

**Merged pull requests:**

- Updated README.md [\#385](https://github.com/tj-actions/changed-files/pull/385) ([jackton1](https://github.com/jackton1))
- feat: Added support for using fork point to detect file changes. [\#384](https://github.com/tj-actions/changed-files/pull/384) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#383](https://github.com/tj-actions/changed-files/pull/383) ([jackton1](https://github.com/jackton1))
- Update README.md [\#381](https://github.com/tj-actions/changed-files/pull/381) ([jackton1](https://github.com/jackton1))
- Update README.md [\#380](https://github.com/tj-actions/changed-files/pull/380) ([jackton1](https://github.com/jackton1))
- Update diff-sha.sh [\#379](https://github.com/tj-actions/changed-files/pull/379) ([jackton1](https://github.com/jackton1))
- Test pull request diff [\#378](https://github.com/tj-actions/changed-files/pull/378) ([jackton1](https://github.com/jackton1))
- Upgraded to v15 [\#377](https://github.com/tj-actions/changed-files/pull/377) ([jackton1](https://github.com/jackton1))
- Upgraded to v5.0.0 [\#375](https://github.com/tj-actions/changed-files/pull/375) ([jackton1](https://github.com/jackton1))
- Update tj-actions/sync-release-version action to v11 [\#374](https://github.com/tj-actions/changed-files/pull/374) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#373](https://github.com/tj-actions/changed-files/pull/373) ([jackton1](https://github.com/jackton1))
- Upgraded to v14.7 [\#371](https://github.com/tj-actions/changed-files/pull/371) ([jackton1](https://github.com/jackton1))
- chore: Cleanup duplicate action runs [\#370](https://github.com/tj-actions/changed-files/pull/370) ([jackton1](https://github.com/jackton1))
- feat: Add support for excluding files via files-ignore input [\#369](https://github.com/tj-actions/changed-files/pull/369) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.7 [\#368](https://github.com/tj-actions/changed-files/pull/368) ([jackton1](https://github.com/jackton1))
- fix: Bug detecting deleted files. [\#364](https://github.com/tj-actions/changed-files/pull/364) ([jackton1](https://github.com/jackton1))
- chore: Update glob action inputs [\#363](https://github.com/tj-actions/changed-files/pull/363) ([jackton1](https://github.com/jackton1))
- Upgraded to v14.6 [\#362](https://github.com/tj-actions/changed-files/pull/362) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.6 [\#361](https://github.com/tj-actions/changed-files/pull/361) ([jackton1](https://github.com/jackton1))
- Update README.md [\#360](https://github.com/tj-actions/changed-files/pull/360) ([jackton1](https://github.com/jackton1))
- Update README.md [\#359](https://github.com/tj-actions/changed-files/pull/359) ([jackton1](https://github.com/jackton1))
- fix: Error with multiple changed files from merge commits [\#358](https://github.com/tj-actions/changed-files/pull/358) ([jackton1](https://github.com/jackton1))
- Update tj-actions/glob action to v7 [\#357](https://github.com/tj-actions/changed-files/pull/357) ([renovate[bot]](https://github.com/apps/renovate))
- Update reviewdog/action-shellcheck action to v1.14 [\#356](https://github.com/tj-actions/changed-files/pull/356) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v14.5 [\#352](https://github.com/tj-actions/changed-files/pull/352) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.5 [\#351](https://github.com/tj-actions/changed-files/pull/351) ([jackton1](https://github.com/jackton1))
- feat: Add support for detecting submodules changes [\#350](https://github.com/tj-actions/changed-files/pull/350) ([jackton1](https://github.com/jackton1))
- Upgraded to v14.4 [\#348](https://github.com/tj-actions/changed-files/pull/348) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.4 [\#347](https://github.com/tj-actions/changed-files/pull/347) ([jackton1](https://github.com/jackton1))
- chore: expose internal files-separator input [\#346](https://github.com/tj-actions/changed-files/pull/346) ([jackton1](https://github.com/jackton1))
- Upgraded to v14.3 [\#343](https://github.com/tj-actions/changed-files/pull/343) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.3 [\#342](https://github.com/tj-actions/changed-files/pull/342) ([jackton1](https://github.com/jackton1))
- fix: resolve bug with pattern matching on windows [\#341](https://github.com/tj-actions/changed-files/pull/341) ([jackton1](https://github.com/jackton1))
- Upgraded to v14.2 [\#339](https://github.com/tj-actions/changed-files/pull/339) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.2 [\#338](https://github.com/tj-actions/changed-files/pull/338) ([jackton1](https://github.com/jackton1))
- bug: resolve issue with excluding files via glob pattern [\#337](https://github.com/tj-actions/changed-files/pull/337) ([jackton1](https://github.com/jackton1))
- Bump peter-evans/create-pull-request from 3.12.0 to 3.12.1 [\#334](https://github.com/tj-actions/changed-files/pull/334) ([dependabot[bot]](https://github.com/apps/dependabot))
- Upgraded to v14.1 [\#332](https://github.com/tj-actions/changed-files/pull/332) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.1 [\#331](https://github.com/tj-actions/changed-files/pull/331) ([jackton1](https://github.com/jackton1))
- bug: Fix command to narrow down target files [\#330](https://github.com/tj-actions/changed-files/pull/330) ([massongit](https://github.com/massongit))
- Upgraded to v14 [\#329](https://github.com/tj-actions/changed-files/pull/329) ([jackton1](https://github.com/jackton1))
- Upgraded to v4.0.0 [\#328](https://github.com/tj-actions/changed-files/pull/328) ([jackton1](https://github.com/jackton1))
- Clean up variable name to reflect usage. [\#327](https://github.com/tj-actions/changed-files/pull/327) ([jackton1](https://github.com/jackton1))
- Narrow down target files by exact match of INPUT\_FILES [\#326](https://github.com/tj-actions/changed-files/pull/326) ([massongit](https://github.com/massongit))
- Upgraded to v13.2 [\#325](https://github.com/tj-actions/changed-files/pull/325) ([jackton1](https://github.com/jackton1))
- Upgraded to v3.0.2 [\#324](https://github.com/tj-actions/changed-files/pull/324) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#323](https://github.com/tj-actions/changed-files/pull/323) ([jackton1](https://github.com/jackton1))
- docs: add massongit as a contributor for code [\#322](https://github.com/tj-actions/changed-files/pull/322) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Deduplicate from files parameter without sorting [\#321](https://github.com/tj-actions/changed-files/pull/321) ([massongit](https://github.com/massongit))
- docs: add wushujames as a contributor for doc [\#320](https://github.com/tj-actions/changed-files/pull/320) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- String literals need to be inside single-quotes [\#319](https://github.com/tj-actions/changed-files/pull/319) ([wushujames](https://github.com/wushujames))
- Remove redundant debug line [\#318](https://github.com/tj-actions/changed-files/pull/318) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#317](https://github.com/tj-actions/changed-files/pull/317) ([jackton1](https://github.com/jackton1))
- Upgraded to v13.1 [\#316](https://github.com/tj-actions/changed-files/pull/316) ([jackton1](https://github.com/jackton1))
- Upgraded to v3.0.1 [\#315](https://github.com/tj-actions/changed-files/pull/315) ([jackton1](https://github.com/jackton1))
- Update tj-actions/glob action to v3.3 [\#313](https://github.com/tj-actions/changed-files/pull/313) ([renovate[bot]](https://github.com/apps/renovate))
- Updated README.md [\#312](https://github.com/tj-actions/changed-files/pull/312) ([jackton1](https://github.com/jackton1))
- Clean up unused code [\#311](https://github.com/tj-actions/changed-files/pull/311) ([jackton1](https://github.com/jackton1))
- doc: add Zamiell as a contributor for doc [\#310](https://github.com/tj-actions/changed-files/pull/310) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- spelling/grammar [\#309](https://github.com/tj-actions/changed-files/pull/309) ([Zamiell](https://github.com/Zamiell))
- Upgraded to v3.0.0 [\#308](https://github.com/tj-actions/changed-files/pull/308) ([jackton1](https://github.com/jackton1))
- Upgraded to v13 [\#307](https://github.com/tj-actions/changed-files/pull/307) ([jackton1](https://github.com/jackton1))
- Upgraded tj-actions/glob to v3.2 [\#306](https://github.com/tj-actions/changed-files/pull/306) ([jackton1](https://github.com/jackton1))
- Update tj-actions/remark action to v2.3 [\#305](https://github.com/tj-actions/changed-files/pull/305) ([renovate[bot]](https://github.com/apps/renovate))
- Add support for using github's glob pattern syntax [\#304](https://github.com/tj-actions/changed-files/pull/304) ([jackton1](https://github.com/jackton1))
- Update tj-actions/remark action to v2 [\#302](https://github.com/tj-actions/changed-files/pull/302) ([renovate[bot]](https://github.com/apps/renovate))
- Bump tj-actions/github-changelog-generator from 1.10 to 1.11 [\#300](https://github.com/tj-actions/changed-files/pull/300) ([dependabot[bot]](https://github.com/apps/dependabot))
- Update tj-actions/github-changelog-generator action to v1.10 [\#299](https://github.com/tj-actions/changed-files/pull/299) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v2.0.1 [\#298](https://github.com/tj-actions/changed-files/pull/298) ([jackton1](https://github.com/jackton1))
- Upgraded to v12.2 [\#297](https://github.com/tj-actions/changed-files/pull/297) ([jackton1](https://github.com/jackton1))

## [v1.0.1](https://github.com/tj-actions/changed-files/tree/v1.0.1) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.0.0...v1.0.1)

## [v1.0.0](https://github.com/tj-actions/changed-files/tree/v1.0.0) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v5.0.0...v1.0.0)

**Fixed bugs:**

- \[BUG\] Project versions are mutated without warning [\#382](https://github.com/tj-actions/changed-files/issues/382)

## [v5.0.0](https://github.com/tj-actions/changed-files/tree/v5.0.0) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14.7...v5.0.0)

## [v14.7](https://github.com/tj-actions/changed-files/tree/v14.7) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14.6...v14.7)

## [v14.6](https://github.com/tj-actions/changed-files/tree/v14.6) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14.5...v14.6)

## [v14.5](https://github.com/tj-actions/changed-files/tree/v14.5) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14.4...v14.5)

## [v14.4](https://github.com/tj-actions/changed-files/tree/v14.4) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14.3...v14.4)

## [v14.3](https://github.com/tj-actions/changed-files/tree/v14.3) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14.2...v14.3)

## [v14.2](https://github.com/tj-actions/changed-files/tree/v14.2) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14.1...v14.2)

## [v14.1](https://github.com/tj-actions/changed-files/tree/v14.1) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v14...v14.1)

## [v14](https://github.com/tj-actions/changed-files/tree/v14) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.7...v14)

## [v4.0.7](https://github.com/tj-actions/changed-files/tree/v4.0.7) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.6...v4.0.7)

## [v4.0.6](https://github.com/tj-actions/changed-files/tree/v4.0.6) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.5...v4.0.6)

## [v4.0.5](https://github.com/tj-actions/changed-files/tree/v4.0.5) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.4...v4.0.5)

## [v4.0.4](https://github.com/tj-actions/changed-files/tree/v4.0.4) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.3...v4.0.4)

## [v4.0.3](https://github.com/tj-actions/changed-files/tree/v4.0.3) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.2...v4.0.3)

## [v4.0.2](https://github.com/tj-actions/changed-files/tree/v4.0.2) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.1...v4.0.2)

## [v4.0.1](https://github.com/tj-actions/changed-files/tree/v4.0.1) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v4.0.0...v4.0.1)

## [v4.0.0](https://github.com/tj-actions/changed-files/tree/v4.0.0) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v3.0.2...v4.0.0)

## [v3.0.2](https://github.com/tj-actions/changed-files/tree/v3.0.2) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v3.0.1...v3.0.2)

## [v3.0.1](https://github.com/tj-actions/changed-files/tree/v3.0.1) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v3.0.0...v3.0.1)

## [v3.0.0](https://github.com/tj-actions/changed-files/tree/v3.0.0) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v13.2...v3.0.0)

## [v13.2](https://github.com/tj-actions/changed-files/tree/v13.2) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v13.1...v13.2)

## [v13.1](https://github.com/tj-actions/changed-files/tree/v13.1) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v13...v13.1)

## [v13](https://github.com/tj-actions/changed-files/tree/v13) (2022-02-17)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v12.2...v13)

**Implemented enhancements:**

- \[Feature\] files-ignore [\#366](https://github.com/tj-actions/changed-files/issues/366)
- \[Feature\] Make it easier to exclude files [\#265](https://github.com/tj-actions/changed-files/issues/265)
- \[Feature\] Support the same filter syntax as GitHub Workflows [\#264](https://github.com/tj-actions/changed-files/issues/264)

**Fixed bugs:**

- \[BUG\] not patterns is not working in files [\#372](https://github.com/tj-actions/changed-files/issues/372)
- \[BUG\] "delete" does not work [\#353](https://github.com/tj-actions/changed-files/issues/353)
- \[BUG\] Files detected as changed that are not part of PR [\#345](https://github.com/tj-actions/changed-files/issues/345)
- \[BUG\] Action flips forward slash into backslash resulting in match failure.  [\#340](https://github.com/tj-actions/changed-files/issues/340)
- \[BUG\] Negating filter doesn't work [\#335](https://github.com/tj-actions/changed-files/issues/335)
- \[BUG\] Getting Error: `uses:` keyword is not currently supported when using above 12.2 version [\#333](https://github.com/tj-actions/changed-files/issues/333)
- \[BUG\] wrong result of any\_change output [\#314](https://github.com/tj-actions/changed-files/issues/314)
- \[BUG\] Investigate possible bug using since\_last\_remote\_commit when force pushing changes. [\#303](https://github.com/tj-actions/changed-files/issues/303)

## [v12.2](https://github.com/tj-actions/changed-files/tree/v12.2) (2021-12-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v2.0.1...v12.2)

## [v2.0.1](https://github.com/tj-actions/changed-files/tree/v2.0.1) (2021-12-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v12.1...v2.0.1)

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

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11...v12)

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

## [v11](https://github.com/tj-actions/changed-files/tree/v11) (2021-12-04)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.9...v11)

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

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v1.2.0...v1.2.1)

**Implemented enhancements:**

- \[Feature\] Improve documentation [\#244](https://github.com/tj-actions/changed-files/issues/244)

**Merged pull requests:**

- Updated formatting of all modified debug message [\#247](https://github.com/tj-actions/changed-files/pull/247) ([jackton1](https://github.com/jackton1))
- Update reviewdog/action-shellcheck action to v1.10 [\#246](https://github.com/tj-actions/changed-files/pull/246) ([renovate[bot]](https://github.com/apps/renovate))
- Update peter-evans/create-pull-request action to v3.11.0 [\#245](https://github.com/tj-actions/changed-files/pull/245) ([renovate[bot]](https://github.com/apps/renovate))
- Update actions/checkout action to v2.4.0 [\#243](https://github.com/tj-actions/changed-files/pull/243) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v11.5 [\#241](https://github.com/tj-actions/changed-files/pull/241) ([jackton1](https://github.com/jackton1))

## [v1.2.0](https://github.com/tj-actions/changed-files/tree/v1.2.0) (2021-10-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.5...v1.2.0)

## [v11.5](https://github.com/tj-actions/changed-files/tree/v11.5) (2021-10-30)

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v11.4...v11.5)

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

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v10.1...v11.1)

**Fixed bugs:**

- \[BUG\] Spaces in file names are not handled correctly [\#216](https://github.com/tj-actions/changed-files/issues/216)
- \[BUG\] Usage of quotes around array items  [\#208](https://github.com/tj-actions/changed-files/issues/208)

**Closed issues:**

- \[BUG\] not able to find only python files [\#224](https://github.com/tj-actions/changed-files/issues/224)

**Merged pull requests:**

- Disable automatic tag following [\#225](https://github.com/tj-actions/changed-files/pull/225) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#223](https://github.com/tj-actions/changed-files/pull/223) ([jackton1](https://github.com/jackton1))
- Upgraded to v11 [\#222](https://github.com/tj-actions/changed-files/pull/222) ([jackton1](https://github.com/jackton1))
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

[Full Changelog](https://github.com/tj-actions/changed-files/compare/v9.3...v1.0.2)

**Implemented enhancements:**

- \[Feature\] Add support for checkout path [\#167](https://github.com/tj-actions/changed-files/issues/167)

**Fixed bugs:**

- \[BUG\] Error: xargs: unmatched single quote [\#169](https://github.com/tj-actions/changed-files/issues/169)
- \[BUG\] Deleted files not detected [\#165](https://github.com/tj-actions/changed-files/issues/165)
- \[BUG\] changed-files unable to initialize git repository on custom container image [\#164](https://github.com/tj-actions/changed-files/issues/164)
- Setting remote URL breaks other steps that are using it [\#158](https://github.com/tj-actions/changed-files/issues/158)

**Merged pull requests:**

- Fixed bug with parsing filenames that contain quotes [\#174](https://github.com/tj-actions/changed-files/pull/174) ([jackton1](https://github.com/jackton1))
- Upgraded to v1.0.1 [\#173](https://github.com/tj-actions/changed-files/pull/173) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#172](https://github.com/tj-actions/changed-files/pull/172) ([jackton1](https://github.com/jackton1))
- Updated README.md [\#171](https://github.com/tj-actions/changed-files/pull/171) ([jackton1](https://github.com/jackton1))
- docs: add IvanPizhenko as a contributor for code, doc [\#170](https://github.com/tj-actions/changed-files/pull/170) ([allcontributors[bot]](https://github.com/apps/allcontributors))
- Implement path parameter [\#168](https://github.com/tj-actions/changed-files/pull/168) ([IvanPizhenko](https://github.com/IvanPizhenko))
- Update peter-evans/create-pull-request action to v3.10.1 [\#163](https://github.com/tj-actions/changed-files/pull/163) ([renovate[bot]](https://github.com/apps/renovate))
- Update tj-actions/branch-names action to v4.9 [\#162](https://github.com/tj-actions/changed-files/pull/162) ([renovate[bot]](https://github.com/apps/renovate))
- Update tj-actions/remark action to v1.7 [\#161](https://github.com/tj-actions/changed-files/pull/161) ([renovate[bot]](https://github.com/apps/renovate))
- Upgraded to v1.0.0 [\#160](https://github.com/tj-actions/changed-files/pull/160) ([jackton1](https://github.com/jackton1))
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
