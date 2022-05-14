#!/usr/bin/env bash

set -eu

INPUT_SEPARATOR="${INPUT_SEPARATOR//'%'/'%25'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//$'\n'/'%0A'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//$'\r'/'%0D'}"

if [[ $INPUT_QUOTEPATH == "false" ]]; then
  git config --global core.quotepath off
else
  git config --global core.quotepath on
fi

function get_diff() {
  base="$1"
  sha="$2"
  filter="$3"
  while IFS='' read -r sub; do
    sub_commit_pre="$(git diff "$base" "$sha" -- "$sub" | grep '^[-]Subproject commit' | awk '{print $3}')"
    sub_commit_cur="$(git diff "$base" "$sha" -- "$sub" | grep '^[+]Subproject commit' | awk '{print $3}')"
    if [ -n "$sub_commit_cur" ]; then
    (
      cd "$sub" && (
        # the strange magic number is a hardcoded "empty tree" commit sha
        get_diff "${sub_commit_pre:-4b825dc642cb6eb9a060e54bf8d69288fbee4904}" "${sub_commit_cur}" "$filter" | awk -v r="$sub" '{ print "" r "/" $0}'
      )
    )
    fi
  done < <(git submodule | awk '{print $2}')
  git diff --diff-filter="$filter" --name-only --ignore-submodules=all "$base" "$sha"
}

function get_renames() {
  base="$1"
  sha="$2"
  while IFS='' read -r sub; do
    sub_commit_pre="$(git diff "$base" "$sha" -- "$sub" | grep '^[-]Subproject commit' | awk '{print $3}')"
    sub_commit_cur="$(git diff "$base" "$sha" -- "$sub" | grep '^[+]Subproject commit' | awk '{print $3}')"
    if [ -n "$sub_commit_cur" ]; then
    (
      cd "$sub" && (
        # the strange magic number is a hardcoded "empty tree" commit sha
        get_renames "${sub_commit_pre:-4b825dc642cb6eb9a060e54bf8d69288fbee4904}" "${sub_commit_cur}" | awk -v r="$sub" '{ print "" r "/" $0}'
      )
    )
    fi
  done < <(git submodule | awk '{print $2}')
  git log --name-status --ignore-submodules=all "$base".."$sha" | grep -E "^R" | awk -F '\t' -v d="$INPUT_OLD_NEW_SEPARATOR" '{print $2d$3}'
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

if [[ -z "$INPUT_FILES_PATTERN_FILE" ]]; then
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
  ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | grep -x -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

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

  ALL_OTHER_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
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

  ALL_OTHER_DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
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
