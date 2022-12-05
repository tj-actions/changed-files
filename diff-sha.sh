#!/usr/bin/env bash

set -euo pipefail

INITIAL_COMMIT="false"
GITHUB_OUTPUT=${GITHUB_OUTPUT:-""}
EXTRA_ARGS="--no-tags"
PREVIOUS_SHA=""
CURRENT_SHA=""
MERGE_BASE_EXRTRA_ARGS=""

if [[ "$GITHUB_REF" == "refs/tags/"* ]]; then
  EXTRA_ARGS=""
fi

if [[ "$GITHUB_HEAD_REPO_FORK" == "true" ]]; then
  MERGE_BASE_EXRTRA_ARGS="--fork-point"
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

if [[ -z $GITHUB_BASE_REF ]]; then
  echo "Running on a push event..."

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
      CURRENT_SHA=$(git rev-list -n 1 HEAD 2>&1) && exit_status=$? || exit_status=$?
    else
      CURRENT_SHA=$INPUT_SHA; exit_status=$?
      # shellcheck disable=SC2086
      git fetch $EXTRA_ARGS -u --progress --deepen="$INPUT_FETCH_DEPTH" 2>&1 && exit_status=$? || exit_status=$?
    fi
  fi

  TARGET_BRANCH=$(git name-rev --name-only "$CURRENT_SHA" 2>&1) && exit_status=$? || exit_status=$?
  CURRENT_BRANCH=$TARGET_BRANCH && exit_status=$? || exit_status=$?

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
          PREVIOUS_SHA=$GITHUB_EVENT_BEFORE
        fi
      else
        PREVIOUS_SHA=$(git rev-list -n 1 "$TARGET_BRANCH" 2>&1) && exit_status=$? || exit_status=$?

        if [[ -z "$PREVIOUS_SHA" ]]; then
          if [[ "$GITHUB_EVENT_FORCED" == "false" || -z "$GITHUB_EVENT_FORCED" ]]; then
            PREVIOUS_SHA=$GITHUB_EVENT_BEFORE
          fi
        fi
      fi

      if [[ -z "$PREVIOUS_SHA" || "$PREVIOUS_SHA" == "0000000000000000000000000000000000000000" ]]; then
        PREVIOUS_SHA=$(git rev-parse "$(git branch -r --sort=-committerdate | head -1 | xargs)")
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
    # shellcheck disable=SC2086
    git fetch $EXTRA_ARGS -u --progress --deepen="$INPUT_FETCH_DEPTH" 2>&1 && exit_status=$? || exit_status=$?
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
  TARGET_BRANCH=$GITHUB_BASE_REF
  CURRENT_BRANCH=$GITHUB_HEAD_REF
  
  if [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" == "true" ]]; then
    TARGET_BRANCH=$CURRENT_BRANCH
  fi

  echo "Fetching remote refs..."

  if [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" == "false" ]]; then
    # shellcheck disable=SC2086
    git fetch -u --progress $EXTRA_ARGS --depth="$INPUT_FETCH_DEPTH" origin +refs/heads/"$TARGET_BRANCH":refs/remotes/origin/"$TARGET_BRANCH"
    git branch --track "$TARGET_BRANCH" origin/"$TARGET_BRANCH" 2>/dev/null || true
  else
    # shellcheck disable=SC2086
    git fetch $EXTRA_ARGS -u --progress --depth="$INPUT_FETCH_DEPTH" origin +"$GITHUB_REF":refs/remotes/origin/"$CURRENT_BRANCH"
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
      CURRENT_SHA=$(git rev-list --no-merges -n 1 HEAD 2>&1) && exit_status=$? || exit_status=$?
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
        # shellcheck disable=SC2046
        PREVIOUS_SHA=$(git rev-parse origin/"$CURRENT_BRANCH" 2>&1) && exit_status=$? || exit_status=$?
      fi
    else
      PREVIOUS_SHA=$(git merge-base $MERGE_BASE_EXRTRA_ARGS "$TARGET_BRANCH" "$CURRENT_SHA" 2>&1) && exit_status=$? || exit_status=$?

      if [[ -z "$PREVIOUS_SHA" ]]; then
        PREVIOUS_SHA=$GITHUB_EVENT_PULL_REQUEST_BASE_SHA && exit_status=$? || exit_status=$?
      fi

      if ! git diff --name-only --ignore-submodules=all "$PREVIOUS_SHA"..."$CURRENT_SHA" 1>/dev/null 2>&1; then
        PREVIOUS_SHA=$(git rev-parse origin/"$TARGET_BRANCH" 2>&1) && exit_status=$? || exit_status=$?
      fi
    fi

    if [[ -z "$PREVIOUS_SHA" || "$PREVIOUS_SHA" == "$CURRENT_SHA" ]]; then
      PREVIOUS_SHA=$GITHUB_EVENT_PULL_REQUEST_BASE_SHA && exit_status=$? || exit_status=$?
    fi

    if [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" == "false" ]]; then
      if [[ -f .git/shallow ]]; then
        depth=$INPUT_FETCH_DEPTH
        max_depth=$INPUT_MAX_FETCH_DEPTH

        while ! git diff --name-only --ignore-submodules=all "$PREVIOUS_SHA"..."$CURRENT_SHA" 1>/dev/null 2>&1; do
          echo "Fetching $depth commits..."

          # shellcheck disable=SC2086
          git fetch $EXTRA_ARGS -u --progress --deepen="$depth" origin +"$GITHUB_REF":refs/remotes/origin/"$CURRENT_BRANCH"

          PREVIOUS_SHA=$(git merge-base $MERGE_BASE_EXRTRA_ARGS "$TARGET_BRANCH" "$CURRENT_SHA" 2>&1) && exit_status=$? || exit_status=$?

          if [[ $depth -gt $max_depth ]]; then
            echo "::error::Unable to locate a common ancestor between $TARGET_BRANCH and $CURRENT_SHA"
            exit 1
          fi

          depth=$((depth + 300))
        done
      else
        echo "::debug::Not a shallow clone, skipping merge-base check."
      fi
    fi

    echo "::debug::Previous SHA: $PREVIOUS_SHA"
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA && exit_status=$? || exit_status=$?
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
else
  cat <<EOF >> "$GITHUB_OUTPUT"
target_branch=$TARGET_BRANCH
current_branch=$CURRENT_BRANCH
previous_sha=$PREVIOUS_SHA
current_sha=$CURRENT_SHA
EOF
fi

echo "::endgroup::"
