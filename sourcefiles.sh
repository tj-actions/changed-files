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

echo "Input Files:"
echo "${FILES[*]}"

IFS=" " read -r -a ALL_UNIQUE_FILES <<< "$(echo "${FILES[@]}" | tr " " "\n" | sort -u | tr "\n" " ")"

echo "All Unique Input files:"
echo "${ALL_UNIQUE_FILES[*]}"

echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"

echo "::endgroup::"
