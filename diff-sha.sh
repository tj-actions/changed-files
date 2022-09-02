#!/usr/bin/env bash

set -eu

INITIAL_COMMIT="false"

echo "::group::changed-files-diff-sha"

if [[ -n $INPUT_PATH ]]; then
  REPO_DIR="$GITHUB_WORKSPACE/$INPUT_PATH"

  echo "::debug::Resolving repository path: $REPO_DIR"
  if [[ ! -d "$REPO_DIR" ]]; then
    echo "::error::Invalid repository path: $REPO_DIR"
    exit 1
  fi
  cd "$REPO_DIR"
fi

echo "Verifying git version..."

function __version() {
  echo "$@" | awk -F. '{ printf("%d%03d%03d%03d\n", $1,$2,$3,$4); }';
}

GIT_VERSION=$(git --version | awk '{print $3}'); exit_status=$?

if [[ $exit_status -ne 0 ]]; then
  echo "::error::git not installed"
  exit 1
fi

if [[ $(__version "$GIT_VERSION") -lt $(__version "2.18.0") ]]; then
  echo "::error::Invalid git version. Please upgrade git ($GIT_VERSION) to >= (2.18.0)"
  exit 1
else
  echo "Valid git version found: ($GIT_VERSION)"
fi

echo "::debug::Getting HEAD SHA..."

if [[ -z $INPUT_SHA ]]; then
  CURRENT_SHA=$(git rev-list -n 1 "HEAD" 2>&1); exit_status=$?
else
  CURRENT_SHA=$INPUT_SHA; exit_status=$?
fi

git rev-parse --quiet --verify "$CURRENT_SHA^{commit}" 1>/dev/null 2>&1; exit_status=$?

if [[ $exit_status -ne 0 ]]; then
  echo "::error::Unable to locate the current sha: $CURRENT_SHA"
  echo "::error::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
  exit 1
else
  echo "::debug::Current SHA: $CURRENT_SHA"
fi

if [[ -z $GITHUB_BASE_REF ]]; then
  TARGET_BRANCH=${GITHUB_REF/refs\/heads\//}
  CURRENT_BRANCH=$TARGET_BRANCH

  echo "::debug::GITHUB_BASE_REF unset using $TARGET_BRANCH..."

  if [[ -z $INPUT_BASE_SHA ]]; then
    git fetch --no-tags -u --progress origin --depth=2 "${TARGET_BRANCH}":"${TARGET_BRANCH}"; exit_status=$?

    if [[ $(git rev-list --count "HEAD") -gt 1 ]]; then
      PREVIOUS_SHA=$(git rev-parse "@~1" 2>&1); exit_status=$?
      echo "::debug::Previous SHA: $PREVIOUS_SHA"
    else
      PREVIOUS_SHA=$CURRENT_SHA; exit_status=$?
      INITIAL_COMMIT="true"
      echo "::debug::Initial commit detected"
      echo "::debug::Previous SHA: $PREVIOUS_SHA"
    fi
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA; exit_status=$?
    TARGET_BRANCH=$(git name-rev --name-only "$PREVIOUS_SHA" 2>&1); exit_status=$?
    echo "::debug::Previous SHA: $PREVIOUS_SHA"
    echo "::debug::Target branch: $TARGET_BRANCH"
  fi

  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1; exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Unable to locate the previous sha: $PREVIOUS_SHA"
    echo "::error::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    exit 1
  fi
else
  TARGET_BRANCH=$GITHUB_BASE_REF
  CURRENT_BRANCH=$GITHUB_HEAD_REF

  echo "::debug::GITHUB_BASE_REF: $TARGET_BRANCH..."

  if [[ -z $INPUT_BASE_SHA ]]; then
    if [[ "$INPUT_USE_FORK_POINT" == "true" ]]; then
      echo "::debug::Getting fork point..."
      git fetch --no-tags -u --progress origin "${TARGET_BRANCH}":"${TARGET_BRANCH}"; exit_status=$?
      PREVIOUS_SHA=$(git merge-base --fork-point "${TARGET_BRANCH}" "$(git name-rev --name-only "$CURRENT_SHA")"); exit_status=$?
      echo "::debug::Previous SHA: $PREVIOUS_SHA"
    else
      git fetch --no-tags -u --progress origin --depth=1 "${TARGET_BRANCH}":"${TARGET_BRANCH}"; exit_status=$?
      PREVIOUS_SHA=$(git rev-list -n 1 "${TARGET_BRANCH}" 2>&1); exit_status=$?
      echo "::debug::Previous SHA: $PREVIOUS_SHA"
    fi
  else
    git fetch --no-tags -u --progress origin --depth=1 "$(git rev-parse --verify "$INPUT_BASE_SHA")"; exit_status=$?
    PREVIOUS_SHA=$INPUT_BASE_SHA
    TARGET_BRANCH=$(git name-rev --name-only "$PREVIOUS_SHA" 2>&1); exit_status=$?
    echo "::debug::Previous SHA: $PREVIOUS_SHA"
    echo "::debug::Target branch: $TARGET_BRANCH"
  fi

  echo "::debug::Verifying commit SHA..."
  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1; exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Unable to locate the previous sha: $PREVIOUS_SHA"
    echo "::error::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    exit 1
  fi
fi

if [[ -n "$PREVIOUS_SHA" && -n "$CURRENT_SHA" && "$PREVIOUS_SHA" == "$CURRENT_SHA" && "$INITIAL_COMMIT" == "false" ]]; then
  echo "::error::Similar commit hashes detected: previous sha: $PREVIOUS_SHA is equivalent to the current sha: $CURRENT_SHA"
  echo "::error::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
  exit 1
fi

echo "::set-output name=target_branch::$TARGET_BRANCH"
echo "::set-output name=current_branch::$CURRENT_BRANCH"
echo "::set-output name=previous_sha::$PREVIOUS_SHA"
echo "::set-output name=current_sha::$CURRENT_SHA"

echo "::endgroup::"
