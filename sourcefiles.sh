#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

FILES=()

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    while read -r fileName; do
      FILES+=("$fileName")
    done <"$file"
  done
fi

if [[ -n $INPUT_FILES ]]; then
  for fileName in $INPUT_FILES
  do
    FILES+=("$fileName")
  done
fi


IFS=' '; echo "Input Files: ${FILES[*]}"; unset IFS

read -r -a ALL_UNIQUE_FILES <<< "$(IFS=$'\n'; echo "${FILES[*]}" | sort -u | tr "\n" " "; unset IFS)"

IFS=' '; echo "All Unique Input files: ${ALL_UNIQUE_FILES[*]}"; unset IFS

IFS=' '; echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"; unset IFS

echo "::endgroup::"
