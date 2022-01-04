#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

RAW_FILES=()

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    while read -r fileName; do
      RAW_FILES+=("$fileName")
    done <"$file"
  done
fi

CLEAN_FILES=$(echo "${RAW_FILES}" | sort -u | awk -v d=" " '{s=(NR==1?s:s d)$0}END{print s}')

CLEAN_INPUT_FILES=$(echo "${INPUT_FILES}" | sort -u | awk -v d=" " '{s=(NR==1?s:s d)$0}END{print s}')

FILES=("${CLEAN_FILES[@]}" "${CLEAN_INPUT_FILES[@]}")

echo "Input Files: ${FILES[*]}"

ALL_UNIQUE_FILES=$(echo "${FILES[*]}" | sort -u | awk -v d=" " '{s=(NR==1?s:s d)$0}END{print s}')

echo "All Unique Input files: ${ALL_UNIQUE_FILES[*]}"

echo "::set-output name=files::${ALL_UNIQUE_FILES[*]}"

echo "::endgroup::"
