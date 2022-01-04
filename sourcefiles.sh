#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

FILES=$(echo "${INPUT_FILES}" | sort -u | awk -v d=" " '{s=(NR==1?s:s d)$0}END{print s}')

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    while read -r fileName; do
      FILES=("${FILES[@]}" "$fileName")
    done <"$file"
  done
fi

echo "Input Files: ${FILES[*]}"

ALL_UNIQUE_FILES=$(echo "${FILES[*]}" | sort -u | awk -v d=" " '{s=(NR==1?s:s d)$0}END{print s}')

echo "All Unique Input files: ${ALL_UNIQUE_FILES[*]}"

echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"

echo "::endgroup::"
