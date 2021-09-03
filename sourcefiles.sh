#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

IFS=$'\n' read -r -a FILES <<<"${INPUT_FILES[*]}"

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    IFS=$'\n' read -d '' -r -a ALL_FILES < "$file"
    for fileName in "${ALL_FILES[@]}"
    do
         FILES+=("$fileName")
    done
  done
fi

echo "Input Files: ${FILES[*]}"

IFS=" " read -r -a ALL_UNIQUE_FILES <<< "$(echo "${FILES[*]}" | tr " " "\n" | sort -u | tr "\n" " ")"

echo "All Unique Input files: ${ALL_UNIQUE_FILES[*]}"

echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"

echo "::endgroup::"
