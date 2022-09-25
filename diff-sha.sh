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

GIT_VERSION=$(git --version | awk '{print $3}') && exit_status=$? || exit_status=$?

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
  CURRENT_SHA=$(git rev-list -n 1 "HEAD" 2>&1) && exit_status=$? || exit_status=$?
else
  CURRENT_SHA=$INPUT_SHA; exit_status=$?
fi

echo "::debug::Verifying the current commit SHA: $CURRENT_SHA"
git rev-parse --quiet --verify "$CURRENT_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

if [[ $exit_status -ne 0 ]]; then
  echo "::error::Unable to locate the current sha: $CURRENT_SHA"
  echo "::error::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
  exit 1
else
  echo "::debug::Current SHA: $CURRENT_SHA"
fi

if [[ -z $GITHUB_BASE_REF ]]; then
  echo "Running on a push event..."
  TARGET_BRANCH=${GITHUB_REF/refs\/heads\//} && exit_status=$? || exit_status=$?
  CURRENT_BRANCH=$TARGET_BRANCH && exit_status=$? || exit_status=$?

  if [[ -z $INPUT_BASE_SHA ]]; then
    PREVIOUS_SHA=$GITHUB_EVENT_BEFORE

    if [[ -z "$PREVIOUS_SHA" || "$PREVIOUS_SHA" == "0000000000000000000000000000000000000000" ]]; then
      echo "::debug::First commit detected"
      PREVIOUS_SHA=$(git rev-parse "$(git branch -r --sort=-committerdate | head -1 | xargs)")
    fi

    if [[ "$PREVIOUS_SHA" == "$CURRENT_SHA" ]]; then
      PREVIOUS_SHA=$(git rev-parse "$CURRENT_SHA^1")

      if [[ "$PREVIOUS_SHA" == "$CURRENT_SHA" ]]; then
        INITIAL_COMMIT="true"
        echo "::debug::Initial commit detected"
      fi
    fi
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA
    TARGET_BRANCH=$(git name-rev --name-only "$PREVIOUS_SHA" 2>&1) && exit_status=$? || exit_status=$?
    CURRENT_BRANCH=$TARGET_BRANCH
  fi

  echo "::debug::Target branch $TARGET_BRANCH..."
  echo "::debug::Current branch $CURRENT_BRANCH..."

  echo "::debug::Verifying the previous commit SHA: $PREVIOUS_SHA"
  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Unable to locate the previous sha: $PREVIOUS_SHA"
    echo "::error::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    exit 1
  fi
else
  echo "Running on a pull request event..."
  TARGET_BRANCH=$GITHUB_BASE_REF
  CURRENT_BRANCH=$GITHUB_HEAD_REF

  echo "::debug::GITHUB_BASE_REF: $TARGET_BRANCH..."

  if [[ -z $INPUT_BASE_SHA ]]; then
    PREVIOUS_SHA=$GITHUB_PULL_REQUEST_BASE_SHA && exit_status=$? || exit_status=$?
    echo "::debug::Previous SHA: $PREVIOUS_SHA"
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA
    TARGET_BRANCH=$(git name-rev --name-only "$PREVIOUS_SHA" 2>&1) && exit_status=$? || exit_status=$?
    echo "::debug::Previous SHA: $PREVIOUS_SHA"
    echo "::debug::Target branch: $TARGET_BRANCH"
  fi

  echo "::debug::Verifying the previous commit SHA: $PREVIOUS_SHA"
  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

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
