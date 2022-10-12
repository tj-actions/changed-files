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

if [[ -n "$INPUT_UNTIL" ]]; then
  SHA=$(git log -1 --format="%H" --date=local --until="$INPUT_UNTIL")
  if [[ -z "$SHA" ]]; then
    echo "::warning::The SHA for date '$INPUT_UNTIL' couldn't be determined, falling back to the current sha."
  fi
  echo "sha=$SHA" >>$GITHUB_OUTPUT
else
  echo "sha=$INPUT_SHA" >>$GITHUB_OUTPUT
fi
