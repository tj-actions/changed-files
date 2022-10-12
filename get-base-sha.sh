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
  echo "base_sha=$BASE_SHA" >> "$GITHUB_OUTPUT"
elif [[ -n "$INPUT_BASE_SHA" ]]; then
  echo "base_sha=$INPUT_BASE_SHA" >> "$GITHUB_OUTPUT"
fi
