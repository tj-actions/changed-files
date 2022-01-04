#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

IFS=$'\n' read -r -a FILES <<< "${INPUT_FILES[@]}"

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    IFS=$'\n' read -d '' -r -a CURRENT_FILES < "$file"
    FILES=("${FILES[@]}" "${CURRENT_FILES[@]}")
  done
fi

IFS=' '; echo "Input Files: ${FILES[*]}"; unset IFS

IFS=$'\n' read -r -a ALL_UNIQUE_FILES <<< "$(IFS=$'\n'; echo "${FILES[*]}" | sort -u; unset IFS)"

IFS=' '; echo "All Unique Input files: ${ALL_UNIQUE_FILES[*]}"; unset IFS

IFS=' '; echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"; unset IFS

echo "::endgroup::"
