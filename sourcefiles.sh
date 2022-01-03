#!/usr/bin/env bash

set -e

echo "::group::changed-files-from-source-file"

IFS="\n" read -r -a FILES <<< "$(echo "${INPUT_FILES[@]}" | sort -u)"

if [[ -n $INPUT_FILES_FROM_SOURCE_FILE ]]; then
  for file in $INPUT_FILES_FROM_SOURCE_FILE
  do
    while read -r fileName; do
      FILES+=("$fileName")
    done <"$file"
  done
fi

echo "Input Files: ${FILES[*]}"

IFS=" " read -r -a ALL_UNIQUE_FILES <<< "$(echo "${FILES[@]}" | tr " " "\n" | sort -u)"

echo "Unique Input files: $(printf '%\n' "${ALL_UNIQUE_FILES[@]}"

echo "::set-output name=files::$(printf '%\n' "${ALL_UNIQUE_FILES[@]}")"

echo "::endgroup::"
