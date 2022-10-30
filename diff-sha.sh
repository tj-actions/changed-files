#!/usr/bin/env bash

set -eu

INITIAL_COMMIT="false"
GITHUB_OUTPUT=${GITHUB_OUTPUT:-""}

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

if [[ -n "$INPUT_UNTIL" ]]; then
  echo "::debug::Getting HEAD SHA for '$INPUT_UNTIL'..."
  CURRENT_SHA=$(git log -1 --format="%H" --date=local --until="$INPUT_UNTIL") && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Invalid until date: $INPUT_UNTIL"
    exit 1
  fi
else
  if [[ -z $INPUT_SHA ]]; then
    CURRENT_SHA=$(git rev-list -n 1 "HEAD" 2>&1) && exit_status=$? || exit_status=$?
  else
    CURRENT_SHA=$INPUT_SHA; exit_status=$?
  fi
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

function deepenShallowCloneToFindCommit() {
  local target_branch="$1"
  local ref="$2"
  local depth=20
  local max_depth=$INPUT_MAX_FETCH_DEPTH

  while ! git rev-parse --quiet --verify "$ref^{commit}" &>/dev/null; do
    echo "::debug::Unable to find commit '$ref' in shallow clone. Increasing depth to $((depth * 2))..."

    depth=$((depth * 2))

    if [[ $depth -gt $max_depth ]]; then
      echo "::error::Unable to find commit '$ref' in shallow clone. Maximum depth of $max_depth reached."
      exit 1
    fi

    git fetch --no-tags -u --progress --deepen="$depth" origin "$target_branch":"$target_branch"
  done
}

function deepenShallowCloneToFindCommitPullRequest() {
  local target_branch="$1"
  local current_branch="$2"
  local depth=20
  local max_depth=$INPUT_MAX_FETCH_DEPTH

  while [ -z "$(git merge-base "$target_branch" "$current_branch")" ]; do
    echo "::debug::Unable to find merge-base in shallow clone. Increasing depth to $((depth * 2))..."

    depth=$((depth * 2))

    if [[ $depth -gt $max_depth ]]; then
      echo "::error::Unable to find merge-base in shallow clone. Please increase 'max_fetch_depth' to at least $depth."
      exit 1
    fi

    git fetch --no-tags -u --progress --deepen="$depth" origin "$target_branch":"$target_branch"
  done
}

if [[ -z $GITHUB_BASE_REF ]]; then
  echo "Running on a push event..."
  TARGET_BRANCH=${GITHUB_REF/refs\/heads\//} && exit_status=$? || exit_status=$?
  CURRENT_BRANCH=$TARGET_BRANCH && exit_status=$? || exit_status=$?

  if [[ -z $INPUT_BASE_SHA ]]; then
    if [[ -n "$INPUT_SINCE" ]]; then
      echo "::debug::Getting base SHA for '$INPUT_SINCE'..."
      PREVIOUS_SHA=$(git log --format="%H" --date=local --since="$INPUT_SINCE" | tail -1) && exit_status=$? || exit_status=$?

      if [[ -z "$PREVIOUS_SHA" ]]; then
        echo "::error::Unable to locate a previous commit for the specified date: $INPUT_SINCE"
        exit 1
      fi
    else
      PREVIOUS_SHA=""

      if [[ "$GITHUB_EVENT_FORCED" == "false" ]]; then
        PREVIOUS_SHA=$GITHUB_EVENT_BEFORE
      fi

      if [[ -z "$PREVIOUS_SHA" || "$PREVIOUS_SHA" == "0000000000000000000000000000000000000000" ]]; then
        PREVIOUS_SHA=$(git rev-parse "$(git branch -r --sort=-committerdate | head -1 | xargs)")
      fi

      if [[ "$PREVIOUS_SHA" == "$CURRENT_SHA" ]]; then
        PREVIOUS_SHA=$(git rev-parse "$CURRENT_SHA^1")

        if [[ "$PREVIOUS_SHA" == "$CURRENT_SHA" ]]; then
          INITIAL_COMMIT="true"
          echo "::debug::Initial commit detected"
        fi
      fi

      if [[ -z "$PREVIOUS_SHA" ]]; then
        echo "::error::Unable to locate a previous commit"
        exit 1
      fi
    fi
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA
    TARGET_BRANCH=$(git name-rev --name-only "$PREVIOUS_SHA" 2>&1) && exit_status=$? || exit_status=$?
    CURRENT_BRANCH=$TARGET_BRANCH
  fi

  echo "::debug::Target branch $TARGET_BRANCH..."
  echo "::debug::Current branch $CURRENT_BRANCH..."

  echo "::debug::Fetching previous commit SHA: $PREVIOUS_SHA"
  deepenShallowCloneToFindCommit "$TARGET_BRANCH" "$PREVIOUS_SHA"

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

  if [[ -z $INPUT_BASE_SHA ]]; then
    PREVIOUS_SHA=$GITHUB_EVENT_PULL_REQUEST_BASE_SHA && exit_status=$? || exit_status=$?
    echo "::debug::Previous SHA: $PREVIOUS_SHA"
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA && exit_status=$? || exit_status=$?
  fi

  echo "::debug::Target branch: $TARGET_BRANCH"
  echo "::debug::Current branch: $CURRENT_BRANCH"

  echo "::debug::Fetching previous commit SHA: $PREVIOUS_SHA"
  deepenShallowCloneToFindCommitPullRequest "$TARGET_BRANCH" "$CURRENT_BRANCH"

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

if [[ -z "$GITHUB_OUTPUT" ]]; then
  echo "::set-output name=target_branch::$TARGET_BRANCH"
  echo "::set-output name=current_branch::$CURRENT_BRANCH"
  echo "::set-output name=previous_sha::$PREVIOUS_SHA"
  echo "::set-output name=current_sha::$CURRENT_SHA"
else
  cat <<EOF >> "$GITHUB_OUTPUT"
target_branch=$TARGET_BRANCH
current_branch=$CURRENT_BRANCH
previous_sha=$PREVIOUS_SHA
current_sha=$CURRENT_SHA
EOF
fi

echo "::endgroup::"
