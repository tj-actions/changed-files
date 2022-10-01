#!/usr/bin/env bash

set -eu

if [[ -n $INPUT_PATH ]]; then
  REPO_DIR="$GITHUB_WORKSPACE/$INPUT_PATH"

  echo "Resolving repository path: $REPO_DIR"
  if [[ ! -d "$REPO_DIR" ]]; then
    echo "::error::Invalid repository path: $REPO_DIR"
    exit 1
  fi
  cd "$REPO_DIR"
fi

if [[ -n "$INPUT_SINCE" ]]; then
  BASE_SHA=$(git log --format="%H" --date=local --since="$INPUT_SINCE" --reverse | head -n 1)
  if [[ -z "$BASE_SHA" ]]; then
    echo "::warning::The BASE_SHA for date '$INPUT_SINCE' couldn't be determined."
  fi
  echo "::set-output name=base_sha::$BASE_SHA"
elif [[ -n "$INPUT_BASE_SHA" ]]; then
  echo "::set-output name=base_sha::$INPUT_BASE_SHA"
elif [[ "$INPUT_SINCE_LAST_REMOTE_COMMIT" == "true" ]]; then
  LAST_REMOTE_COMMIT=""

  if [[ "$GITHUB_EVENT_FORCED" == "false" ]]; then
    LAST_REMOTE_COMMIT=$GITHUB_EVENT_BEFORE
  fi

  if [[ -z "$LAST_REMOTE_COMMIT" || "$LAST_REMOTE_COMMIT" == "0000000000000000000000000000000000000000" ]]; then
    LAST_REMOTE_COMMIT=$(git rev-parse "$(git branch -r --sort=-committerdate | head -1 | xargs)")
  fi
  if [[ "$INPUT_SHA" == "$LAST_REMOTE_COMMIT" ]]; then
    LAST_REMOTE_COMMIT=$(git rev-parse $INPUT_SHA^1)
  fi
  echo "::set-output name=base_sha::$LAST_REMOTE_COMMIT"
fi
