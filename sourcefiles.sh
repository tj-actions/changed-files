#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

IFS=$'\n' read -r -a FILES <<< "$INPUT_FILES"

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    while read -r fileName; do
      FILES+=("$fileName")
    done <"$file"
  done
fi

printf 'Input Files: \n%s\n' "${FILES[@]}"

IFS=$'\n' read -r -a ALL_UNIQUE_FILES <<< "$(printf "%s\n" "${FILES[@]}" | sort -u)"

printf 'All Unique Input files: \n%s\n' "${ALL_UNIQUE_FILES[@]}"

echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"

echo "::endgroup::"
