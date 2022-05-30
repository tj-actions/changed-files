#!/usr/bin/env bash

set -eu

echo "::group::changed-files-diff-sha"

if [[ -n $INPUT_PATH ]]; then
  REPO_DIR="$GITHUB_WORKSPACE/$INPUT_PATH"

  echo "Resolving repository path: $REPO_DIR"
  if [[ ! -d "$REPO_DIR" ]]; then
    echo "::warning::Invalid repository path: $REPO_DIR"
    exit 1
  fi
  cd "$REPO_DIR"
fi

echo "Getting HEAD SHA..."

if [[ -z $INPUT_SHA ]]; then
  CURRENT_SHA=$(git rev-list --no-merges -n 1 HEAD 2>&1) && exit_status=$? || exit_status=$?
else
  CURRENT_SHA=$INPUT_SHA && exit_status=$? || exit_status=$?
fi

git rev-parse --quiet --verify "$CURRENT_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

if [[ $exit_status -ne 0 ]]; then
  echo "::warning::Unable to locate the current sha: $CURRENT_SHA"
  echo "::warning::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
  exit 1
fi

if [[ -z $GITHUB_BASE_REF ]]; then
  TARGET_BRANCH=${GITHUB_REF/refs\/heads\//}
  CURRENT_BRANCH=$TARGET_BRANCH

  if [[ -z $INPUT_BASE_SHA ]]; then
    git fetch --no-tags -u --progress --depth=2 origin "${CURRENT_BRANCH}":"${CURRENT_BRANCH}" &&
    exit_status=$? || exit_status=$?

    if [[ $(git rev-list --count HEAD) -gt 1 ]]; then
      PREVIOUS_SHA=$(git rev-list --no-merges -n 1 HEAD^1 2>&1) && exit_status=$? || exit_status=$?
    else
      PREVIOUS_SHA=$CURRENT_SHA && exit_status=$? || exit_status=$?
      echo "Initial commit detected"
    fi
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA && exit_status=$? || exit_status=$?
    TARGET_BRANCH=$(git name-rev --name-only "$PREVIOUS_SHA" 2>&1) && exit_status=$? || exit_status=$?
  fi

  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::warning::Unable to locate the previous sha: $PREVIOUS_SHA"
    echo "::warning::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    exit 1
  fi
else
  TARGET_BRANCH=$GITHUB_BASE_REF
  CURRENT_BRANCH=$GITHUB_HEAD_REF

  if [[ -z $INPUT_BASE_SHA ]]; then
    if [[ "$INPUT_USE_FORK_POINT" == "true" ]]; then
      echo "Getting fork point..."
      git fetch --no-tags -u --progress origin "${TARGET_BRANCH}":"${TARGET_BRANCH}" && exit_status=$? || exit_status=$?
      PREVIOUS_SHA=$(git merge-base --fork-point "${TARGET_BRANCH}" "$(git name-rev --name-only "$CURRENT_SHA")") && exit_status=$? || exit_status=$?
    else
      git fetch --no-tags -u --progress origin --depth=1 "${TARGET_BRANCH}":"${TARGET_BRANCH}" && exit_status=$? || exit_status=$?
      PREVIOUS_SHA=$(git rev-list --no-merges -n 1 "${TARGET_BRANCH}" 2>&1) && exit_status=$? || exit_status=$?
    fi
  else
    git fetch --no-tags -u --progress origin --depth=1 "$INPUT_BASE_SHA" && exit_status=$? || exit_status=$?
    PREVIOUS_SHA=$INPUT_BASE_SHA
    TARGET_BRANCH=$(git name-rev --name-only "$PREVIOUS_SHA" 2>&1) && exit_status=$? || exit_status=$?
  fi

  echo "Verifying commit SHA..."
  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::warning::Unable to locate the previous sha: $PREVIOUS_SHA"
    echo "::warning::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    exit 1
  fi
fi

echo "::set-output name=target_branch::$TARGET_BRANCH"
echo "::set-output name=current_branch::$CURRENT_BRANCH"
echo "::set-output name=previous_sha::$PREVIOUS_SHA"
echo "::set-output name=current_sha::$CURRENT_SHA"

echo "::endgroup::"
