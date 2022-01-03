#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

FILES=""

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    while read -r fileName; do
      FILES+=$(printf "%s\n" "$fileName")
    done <"$file"
  done
fi

FILES+=$INPUT_FILES

printf "Input Files: %s" "$FILES"

ALL_UNIQUE_FILES=$(printf "$FILES" | sort -u)

echo "All Unique Input files: $ALL_UNIQUE_FILES"

echo "::set-output name=files::$ALL_UNIQUE_FILES"

echo "::endgroup::"
