#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

FILES=()

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    IFS=$'\n' read -r UNIQUE_FILES <<< "$(sort -u "$file" | tr "\n" " " | sed "s/.$//")"
    FILES+=( "${UNIQUE_FILES[@]}" )
  done
fi

echo "::set-output name=files::${FILES[*]}"

echo "::endgroup::"
