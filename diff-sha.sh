#!/usr/bin/env bash

set -euo pipefail

INITIAL_COMMIT="false"
GITHUB_OUTPUT=${GITHUB_OUTPUT:-""}
EXTRA_ARGS="--no-tags --prune --recurse-submodules"
PREVIOUS_SHA=""
CURRENT_SHA=""
DIFF="..."
IS_TAG="false"

if [[ "$GITHUB_REF" == "refs/tags/"* ]]; then
  IS_TAG="true"
  EXTRA_ARGS="--prune --no-recurse-submodules"
fi

if [[ -z $GITHUB_EVENT_PULL_REQUEST_BASE_REF || "$GITHUB_EVENT_HEAD_REPO_FORK" == "true" ]]; then
  DIFF=".."
fi

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

function __version() {
  echo "$@" | awk -F. '{ printf("%d%03d%03d%03d\n", $1,$2,$3,$4); }';
}

echo "Verifying git version..."

GIT_VERSION=$(git --version | awk '{print $3}') && exit_status=$? || exit_status=$?

if [[ $exit_status -ne 0 ]]; then
  echo "::error::git not installed"
  exit 1
fi

if [[ $(__version "$GIT_VERSION") -lt $(__version "2.18.0") ]]; then
  echo "::error::Invalid git version. Please upgrade ($GIT_VERSION) to >= (2.18.0)"
  exit 1
else
  echo "Valid git version found: ($GIT_VERSION)"
fi

if [[ -z $GITHUB_EVENT_PULL_REQUEST_BASE_REF ]]; then
  echo "Running on a push event..."
  TARGET_BRANCH=$GITHUB_REFNAME
  CURRENT_BRANCH=$TARGET_BRANCH

  if $(git rev-parse --is-shallow-repository); then
    echo "Fetching remote refs..."
    # shellcheck disable=SC2086
    git fetch $EXTRA_ARGS -u --progress --deepen="$INPUT_FETCH_DEPTH" origin +refs/heads/"$CURRENT_BRANCH":refs/remotes/origin/"$CURRENT_BRANCH" 1>/dev/null
    # shellcheck disable=SC2086
    git submodule foreach git fetch $EXTRA_ARGS -u --progress --deepen="$INPUT_FETCH_DEPTH" || true
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
      CURRENT_SHA=$(git rev-list -n 1 HEAD) && exit_status=$? || exit_status=$?
    else
      CURRENT_SHA=$INPUT_SHA; exit_status=$?
    fi
  fi

  echo "::debug::Verifying the current commit SHA: $CURRENT_SHA"
  git rev-parse --quiet --verify "$CURRENT_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Unable to locate the current sha: $CURRENT_SHA"
    echo "::error::Please verify that current sha is valid, and increase the fetch_depth to a number higher than $INPUT_FETCH_DEPTH."
    exit 1
  else
    echo "::debug::Current SHA: $CURRENT_SHA"
  fi

  if [[ -z $INPUT_BASE_SHA ]]; then
    if [[ -n "$INPUT_SINCE" ]]; then
      echo "::debug::Getting base SHA for '$INPUT_SINCE'..."
      PREVIOUS_SHA=$(git log --format="%H" --date=local --since="$INPUT_SINCE" | tail -1) && exit_status=$? || exit_status=$?

      if [[ -z "$PREVIOUS_SHA" ]]; then
        echo "::error::Unable to locate a previous commit for the specified date: $INPUT_SINCE"
        exit 1
      fi
    else
      if [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" == "true" ]]; then
        PREVIOUS_SHA=""

        if [[ "$GITHUB_EVENT_FORCED" == "false" || -z "$GITHUB_EVENT_FORCED" ]]; then
          PREVIOUS_SHA=$GITHUB_EVENT_BEFORE && exit_status=$? || exit_status=$?
        else
          PREVIOUS_SHA=$(git rev-list -n 1 "HEAD^") && exit_status=$? || exit_status=$?
        fi
      else
        PREVIOUS_SHA=$(git rev-list -n 1 "HEAD^") && exit_status=$? || exit_status=$?
      fi

      if [[ -z "$PREVIOUS_SHA" || "$PREVIOUS_SHA" == "0000000000000000000000000000000000000000" ]]; then
        PREVIOUS_SHA=$(git rev-list -n 1 "HEAD^") && exit_status=$? || exit_status=$?
      fi

      if [[ "$PREVIOUS_SHA" == "$CURRENT_SHA" ]]; then
        if ! git rev-parse "$PREVIOUS_SHA^1" &>/dev/null; then
          INITIAL_COMMIT="true"
          PREVIOUS_SHA=$(git rev-parse "$CURRENT_SHA")
          echo "::warning::Initial commit detected no previous commit found."
        else
          PREVIOUS_SHA=$(git rev-parse "$PREVIOUS_SHA^1")
        fi
      else
        if [[ -z "$PREVIOUS_SHA" ]]; then
          echo "::error::Unable to locate a previous commit."
          exit 1
        fi
      fi
    fi
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA

    if [[ "$IS_TAG" == "true" ]]; then
      TARGET_BRANCH=$(git describe --tags "$PREVIOUS_SHA")
    fi
  fi

  echo "::debug::Target branch $TARGET_BRANCH..."
  echo "::debug::Current branch $CURRENT_BRANCH..."

  echo "::debug::Verifying the previous commit SHA: $PREVIOUS_SHA"
  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Unable to locate the previous sha: $PREVIOUS_SHA"
    echo "::error::Please verify that the previous sha commit is valid, and increase the fetch_depth to a number higher than $INPUT_FETCH_DEPTH."
    exit 1
  fi
else
  echo "Running on a pull request event..."
  TARGET_BRANCH=$GITHUB_EVENT_PULL_REQUEST_BASE_REF
  CURRENT_BRANCH=$GITHUB_EVENT_PULL_REQUEST_HEAD_REF
  
  if [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" == "true" ]]; then
    TARGET_BRANCH=$CURRENT_BRANCH
  fi

  if $(git rev-parse --is-shallow-repository); then
    echo "Fetching remote refs..."
    # shellcheck disable=SC2086
    git fetch $EXTRA_ARGS -u --progress origin pull/"$GITHUB_EVENT_PULL_REQUEST_NUMBER"/head:"$CURRENT_BRANCH" 1>/dev/null
    
    if [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" != "true" ]]; then
      echo "::debug::Fetching remote target branch..."
      # shellcheck disable=SC2086
      git fetch $EXTRA_ARGS -u --progress --deepen="$INPUT_FETCH_DEPTH" origin +refs/heads/"$TARGET_BRANCH":refs/remotes/origin/"$TARGET_BRANCH" 1>/dev/null
      git branch --track "$TARGET_BRANCH" origin/"$TARGET_BRANCH" 1>/dev/null || true
    fi
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
      CURRENT_SHA=$(git rev-list -n 1 HEAD) && exit_status=$? || exit_status=$?
    else
      CURRENT_SHA=$INPUT_SHA; exit_status=$?
    fi
  fi

  echo "::debug::Verifying the current commit SHA: $CURRENT_SHA"
  git rev-parse --quiet --verify "$CURRENT_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Unable to locate the current sha: $CURRENT_SHA"
    echo "::error::Please verify that current sha is valid, and increase the fetch_depth to a number higher than $INPUT_FETCH_DEPTH."
    exit 1
  else
    echo "::debug::Current SHA: $CURRENT_SHA"
  fi

  if [[ -z $INPUT_BASE_SHA ]]; then
    if [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" == "true" ]]; then
      PREVIOUS_SHA=$GITHUB_EVENT_BEFORE

      if ! git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1; then
        PREVIOUS_SHA=$GITHUB_EVENT_PULL_REQUEST_BASE_SHA
      fi
    else
      PREVIOUS_SHA=$(git rev-parse origin/"$TARGET_BRANCH") && exit_status=$? || exit_status=$?

      if $(git rev-parse --is-shallow-repository); then
        # check if the merge base is in the local history
        if ! git merge-base "$PREVIOUS_SHA" "$CURRENT_SHA" 1>/dev/null 2>&1; then
          echo "::debug::Merge base is not in the local history, fetching remote target branch..."
          # Fetch more of the target branch history until the merge base is found
          for i in {1..10}; do
            # shellcheck disable=SC2086
            git fetch $EXTRA_ARGS -u --progress --deepen="$INPUT_FETCH_DEPTH" origin +refs/heads/"$TARGET_BRANCH":refs/remotes/origin/"$TARGET_BRANCH" 1>/dev/null
            if git merge-base "$PREVIOUS_SHA" "$CURRENT_SHA" 1>/dev/null 2>&1; then
              break
            fi
            echo "::debug::Merge base is not in the local history, fetching remote target branch again..."
            echo "::debug::Attempt $i/10"
          done
        fi
      fi
    fi

    if [[ -z "$PREVIOUS_SHA" || "$PREVIOUS_SHA" == "$CURRENT_SHA" ]]; then
      PREVIOUS_SHA=$GITHUB_EVENT_PULL_REQUEST_BASE_SHA && exit_status=$? || exit_status=$?
    fi

    echo "::debug::Previous SHA: $PREVIOUS_SHA"
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA && exit_status=$? || exit_status=$?
  fi

  if ! git diff --name-only --ignore-submodules=all "$PREVIOUS_SHA$DIFF$CURRENT_SHA" 1>/dev/null 2>&1; then
    DIFF=".."
  fi

  echo "::debug::Target branch: $TARGET_BRANCH"
  echo "::debug::Current branch: $CURRENT_BRANCH"

  echo "::debug::Verifying the previous commit SHA: $PREVIOUS_SHA"
  git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Unable to locate the previous sha: $PREVIOUS_SHA"
    echo "::error::Please verify that the previous sha is valid, and increase the fetch_depth to a number higher than $INPUT_FETCH_DEPTH."
    exit 1
  fi

  if ! git diff --name-only --ignore-submodules=all "$PREVIOUS_SHA$DIFF$CURRENT_SHA" 1>/dev/null 2>&1; then
    echo "::error::Unable to determine a difference between $PREVIOUS_SHA$DIFF$CURRENT_SHA"
    exit 1
  fi
fi

if [[ "$PREVIOUS_SHA" == "$CURRENT_SHA" && "$INITIAL_COMMIT" == "false" ]]; then
  echo "::error::Similar commit hashes detected: previous sha: $PREVIOUS_SHA is equivalent to the current sha: $CURRENT_SHA."
  echo "::error::Please verify that both commits are valid, and increase the fetch_depth to a number higher than $INPUT_FETCH_DEPTH."
  exit 1
fi

if [[ -z "$GITHUB_OUTPUT" ]]; then
  echo "::set-output name=target_branch::$TARGET_BRANCH"
  echo "::set-output name=current_branch::$CURRENT_BRANCH"
  echo "::set-output name=previous_sha::$PREVIOUS_SHA"
  echo "::set-output name=current_sha::$CURRENT_SHA"
  echo "::set-output name=diff::$DIFF"
else
  cat <<EOF >> "$GITHUB_OUTPUT"
target_branch=$TARGET_BRANCH
current_branch=$CURRENT_BRANCH
previous_sha=$PREVIOUS_SHA
current_sha=$CURRENT_SHA
diff=$DIFF
EOF
fi

echo "::endgroup::"
