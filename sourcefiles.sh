#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

FILES=()

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    IFS=$'\n' read -r UNIQUE_FILES <<< "$file"
    FILES+=("${UNIQUE_FILES[@]}")
  done
fi

FILES+=("${INPUT_FILES[@]}")

echo "Input files: ${FILES[*]}"

IFS=$'\n' read -r -a ALL_UNIQUE_FILES <<< "$(sort -u <<<"${FILES[*]}")"

echo "All Unique Input files: ${ALL_UNIQUE_FILES[*]}"

echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"

echo "::endgroup::"
