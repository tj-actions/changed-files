#!/usr/bin/env bash

set -eu

function get_diff() {
  base="$1"
  sha="$2"
  filter="$3"
  IFS=$'\n' read -r -d '' -a SUBMODULES <<< "$(git submodule | awk '{print $2}')"

  for submodule in "${SUBMODULES[@]}"; do
    previous=$(git ls-tree "$1" "$submodule" | awk '{print $3}')
    current=$(git ls-tree "$2" "$submodule" | awk '{print $3}')

    if [[ -n "$previous" && -n "$current" ]]; then
      (cd "$submodule"; get_diff "$previous" "$current" "$filter" | awk -v r="$submodule" '{ print "" r "/" $0}')
    fi
  done

  git diff --diff-filter="$filter" --name-only --ignore-submodules=all "$base" "$sha"
}

echo "::group::changed-files"

echo "Resolving repository path..."

if [[ -n $INPUT_PATH ]]; then
  REPO_DIR="$GITHUB_WORKSPACE/$INPUT_PATH"
  if [[ ! -d "$REPO_DIR" ]]; then
    echo "::warning::Invalid repository path"
    exit 1
  fi
  cd "$REPO_DIR"
fi

echo "Retrieving changes between $INPUT_PREVIOUS_SHA ($INPUT_TARGET_BRANCH) → $INPUT_CURRENT_SHA ($INPUT_CURRENT_BRANCH)"

echo "Getting diff..."

if [[ -z "$INPUT_FILES_PATTERN" ]]; then
  ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
else
  echo "Input files pattern: $INPUT_FILES_PATTERN"
  FILES_PATTERN="^($INPUT_FILES_PATTERN)$"

  ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | grep -E "$FILES_PATTERN" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  ALL_OTHER_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNIQUE_ALL_CHANGED=$(echo "${ALL_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk '!a[$0]++' | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${UNIQUE_ALL_CHANGED}" ]]; then
    echo "Matching changed files: ${UNIQUE_ALL_CHANGED}"
    echo "::set-output name=any_changed::true"
  else
    echo "::set-output name=any_changed::false"
  fi
  
  OTHER_CHANGED=""

  if [[ -n $ALL_OTHER_CHANGED ]]; then
    if [[ -n "$UNIQUE_ALL_CHANGED" ]]; then
      OTHER_CHANGED=$(echo "${ALL_OTHER_CHANGED}|${UNIQUE_ALL_CHANGED}"  | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_CHANGED=$ALL_OTHER_CHANGED
    fi
  fi

  OTHER_CHANGED=$(echo "${OTHER_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${OTHER_CHANGED}" ]]; then
    echo "Non Matching changed files: ${OTHER_CHANGED}"
    echo "::set-output name=only_changed::false"
    echo "::set-output name=other_changed_files::$OTHER_CHANGED"
  elif [[ -n "${UNIQUE_ALL_CHANGED}" ]]; then
    echo "::set-output name=only_changed::true"
  fi

  ALL_OTHER_MODIFIED=$(git diff --diff-filter="ACMRD" --name-only "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNIQUE_ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk '!a[$0]++' | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${UNIQUE_ALL_MODIFIED}" ]]; then
    echo "Matching modified files: ${UNIQUE_ALL_MODIFIED}"
    echo "::set-output name=any_modified::true"
  else
    echo "::set-output name=any_modified::false"
  fi
  
  OTHER_MODIFIED=""

  if [[ -n $ALL_OTHER_MODIFIED ]]; then
    if [[ -n "$UNIQUE_ALL_MODIFIED" ]]; then
      OTHER_MODIFIED=$(echo "${ALL_OTHER_MODIFIED}|${UNIQUE_ALL_MODIFIED}"  | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_MODIFIED=$ALL_OTHER_MODIFIED
    fi
  fi

  OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${OTHER_MODIFIED}" ]]; then
    echo "Non Matching modified files: ${OTHER_MODIFIED}"
    echo "::set-output name=only_modified::false"
    echo "::set-output name=other_modified_files::$OTHER_MODIFIED"
  elif [[ -n "${UNIQUE_ALL_MODIFIED}" ]]; then
    echo "::set-output name=only_modified::true"
  fi

  ALL_OTHER_DELETED=$(git diff --diff-filter=D --name-only "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNIQUE_ALL_DELETED=$(echo "${DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk '!a[$0]++' | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${UNIQUE_ALL_DELETED}" ]]; then
    echo "Matching deleted files: ${UNIQUE_ALL_DELETED}"
    echo "::set-output name=any_deleted::true"
  else
    echo "::set-output name=any_deleted::false"
  fi
  
  OTHER_DELETED=""

  if [[ -n $ALL_OTHER_DELETED ]]; then
    if [[ -n "$UNIQUE_ALL_DELETED" ]]; then
      OTHER_DELETED=$(echo "${ALL_OTHER_DELETED}|${UNIQUE_ALL_DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_DELETED=$ALL_OTHER_DELETED
    fi
  fi

  OTHER_DELETED=$(echo "${OTHER_DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${OTHER_DELETED}" ]]; then
    echo "Non Matching deleted files: ${OTHER_DELETED}"
    echo "::set-output name=only_deleted::false"
    echo "::set-output name=other_deleted_files::$OTHER_DELETED"
  elif [[ -n "${UNIQUE_ALL_DELETED}" ]]; then
    echo "::set-output name=only_deleted::true"
  fi

  ADDED=$(echo "${ADDED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(echo "${COPIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(echo "${DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(echo "${MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(echo "${RENAMED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(echo "${TYPE_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(echo "${UNMERGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(echo "${UNKNOWN}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(echo "${ALL_CHANGED_AND_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED=$(echo "${ALL_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
fi

git remote remove temp_changed_files

echo "Added files: $ADDED"
echo "Copied files: $COPIED"
echo "Deleted files: $DELETED"
echo "Modified files: $MODIFIED"
echo "Renamed files: $RENAMED"
echo "Type Changed files: $TYPE_CHANGED"
echo "Unmerged files: $UNMERGED"
echo "Unknown files: $UNKNOWN"
echo "All changed and modified files: $ALL_CHANGED_AND_MODIFIED"
echo "All changed files: $ALL_CHANGED"
echo "All modified files: $ALL_MODIFIED"

echo "::set-output name=added_files::$ADDED"
echo "::set-output name=copied_files::$COPIED"
echo "::set-output name=deleted_files::$DELETED"
echo "::set-output name=modified_files::$MODIFIED"
echo "::set-output name=renamed_files::$RENAMED"
echo "::set-output name=type_changed_files::$TYPE_CHANGED"
echo "::set-output name=unmerged_files::$UNMERGED"
echo "::set-output name=unknown_files::$UNKNOWN"
echo "::set-output name=all_changed_and_modified_files::$ALL_CHANGED_AND_MODIFIED"
echo "::set-output name=all_changed_files::$ALL_CHANGED"
echo "::set-output name=all_modified_files::$ALL_MODIFIED"

echo "::endgroup::"
