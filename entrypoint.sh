#!/usr/bin/env bash

set -eu

INPUT_SEPARATOR="${INPUT_SEPARATOR//'%'/'%25'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//'.'/'%2E'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//$'\n'/'%0A'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//$'\r'/'%0D'}"

if [[ $INPUT_QUOTEPATH == "false" ]]; then
  git config --global core.quotepath off
else
  git config --global core.quotepath on
fi

if [[ -n $INPUT_DIFF_RELATIVE ]]; then
  git config --global diff.relative "$INPUT_DIFF_RELATIVE"
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

  if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
    git diff --diff-filter="$filter" --name-only --ignore-submodules=all "$base" "$sha" | xargs -I {} dirname {} | uniq
  else
    git diff --diff-filter="$filter" --name-only --ignore-submodules=all "$base" "$sha"
  fi
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

  if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
    git log --name-status --ignore-submodules=all "$base".."$sha" | grep -E "^R" | awk -F '\t' -v d="$INPUT_OLD_NEW_SEPARATOR" '{print $2d$3}' | xargs -I {} dirname {} | uniq
  else
    git log --name-status --ignore-submodules=all "$base".."$sha" | grep -E "^R" | awk -F '\t' -v d="$INPUT_OLD_NEW_SEPARATOR" '{print $2d$3}'
  fi
}

echo "::group::changed-files"

if [[ -n $INPUT_PATH ]]; then
  REPO_DIR="$GITHUB_WORKSPACE/$INPUT_PATH"

  echo "Resolving repository path: $REPO_DIR"
  if [[ ! -d "$REPO_DIR" ]]; then
    echo "::error::Invalid repository path: $REPO_DIR"
    exit 1
  fi
  cd "$REPO_DIR"
fi

echo "Retrieving changes between $INPUT_PREVIOUS_SHA ($INPUT_TARGET_BRANCH) → $INPUT_CURRENT_SHA ($INPUT_CURRENT_BRANCH)"

echo "Getting diff..."

if [[ -z "$INPUT_FILES_PATTERN_FILE" ]]; then
  if [[ "$INPUT_JSON" == "false" ]]; then
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
    if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
      ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | awk -v d="$INPUT_OLD_NEW_FILES_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    fi
  else
    ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
      ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}'| jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    fi
  fi
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
  if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
    ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | grep -w -E -f "$INPUT_FILES_PATTERN_FILE" | awk -v d="$INPUT_OLD_NEW_FILES_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  fi

  ALL_OTHER_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${ALL_CHANGED}" ]]; then
    echo "::debug::Matching changed files: ${ALL_CHANGED}"
    echo "::set-output name=any_changed::true"
  else
    echo "::set-output name=any_changed::false"
  fi

  OTHER_CHANGED=""

  if [[ -n $ALL_OTHER_CHANGED ]]; then
    if [[ -n "$ALL_CHANGED" ]]; then
      OTHER_CHANGED=$(echo "${ALL_OTHER_CHANGED}|${ALL_CHANGED}"  | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_CHANGED=$ALL_OTHER_CHANGED
    fi
  fi

  if [[ "$INPUT_JSON" == "false" ]]; then
    OTHER_CHANGED=$(echo "${OTHER_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  else
    OTHER_CHANGED=$(echo "${OTHER_CHANGED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
  fi

  if [[ -n "${OTHER_CHANGED}" && "${OTHER_CHANGED}" != "[]" ]]; then
    echo "::debug::Non Matching changed files: ${OTHER_CHANGED}"
    echo "::set-output name=only_changed::false"
    echo "::set-output name=other_changed_files::$OTHER_CHANGED"
  elif [[ -n "${ALL_CHANGED}" ]]; then
    echo "::set-output name=only_changed::true"
  fi

  ALL_OTHER_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${ALL_MODIFIED}" ]]; then
    echo "::debug::Matching modified files: ${ALL_MODIFIED}"
    echo "::set-output name=any_modified::true"
  else
    echo "::set-output name=any_modified::false"
  fi

  OTHER_MODIFIED=""

  if [[ -n $ALL_OTHER_MODIFIED ]]; then
    if [[ -n "$ALL_MODIFIED" ]]; then
      OTHER_MODIFIED=$(echo "${ALL_OTHER_MODIFIED}|${ALL_MODIFIED}"  | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_MODIFIED=$ALL_OTHER_MODIFIED
    fi
  fi

  if [[ "$INPUT_JSON" == "false" ]]; then
    OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  else
    OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
  fi

  if [[ -n "${OTHER_MODIFIED}" && "$OTHER_MODIFIED" != "[]" ]]; then
    echo "::debug::Non Matching modified files: ${OTHER_MODIFIED}"
    echo "::set-output name=only_modified::false"
    echo "::set-output name=other_modified_files::$OTHER_MODIFIED"
  elif [[ -n "${ALL_MODIFIED}" ]]; then
    echo "::set-output name=only_modified::true"
  fi

  ALL_OTHER_DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${DELETED}" ]]; then
    echo "::debug::Matching deleted files: ${DELETED}"
    echo "::set-output name=any_deleted::true"
  else
    echo "::set-output name=any_deleted::false"
  fi

  OTHER_DELETED=""

  if [[ -n $ALL_OTHER_DELETED ]]; then
    if [[ -n "$DELETED" ]]; then
      OTHER_DELETED=$(echo "${ALL_OTHER_DELETED}|${DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_DELETED=$ALL_OTHER_DELETED
    fi
  fi

  if [[ "$INPUT_JSON" == "false" ]]; then
    OTHER_DELETED=$(echo "${OTHER_DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  else
    OTHER_DELETED=$(echo "${OTHER_DELETED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
  fi

  if [[ -n "${OTHER_DELETED}" && "${OTHER_DELETED}" != "[]" ]]; then
    echo "::debug::Non Matching deleted files: ${OTHER_DELETED}"
    echo "::set-output name=only_deleted::false"
    echo "::set-output name=other_deleted_files::$OTHER_DELETED"
  elif [[ -n "${DELETED}" ]]; then
    echo "::set-output name=only_deleted::true"
  fi
  if [[ "$INPUT_JSON" == "false" ]]; then
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
  else
    ADDED=$(echo "${ADDED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    COPIED=$(echo "${COPIED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    DELETED=$(echo "${DELETED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    MODIFIED=$(echo "${MODIFIED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    RENAMED=$(echo "${RENAMED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    TYPE_CHANGED=$(echo "${TYPE_CHANGED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    UNMERGED=$(echo "${UNMERGED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    UNKNOWN=$(echo "${UNKNOWN}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    ALL_CHANGED_AND_MODIFIED=$(echo "${ALL_CHANGED_AND_MODIFIED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    ALL_CHANGED=$(echo "${ALL_CHANGED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
    ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | jq -R 'split("|") | @json' | sed -r 's/^"|"$//g' | tr -s /)
  fi
fi

echo "::debug::Added files: $ADDED"
echo "::debug::Copied files: $COPIED"
echo "::debug::Deleted files: $DELETED"
echo "::debug::Modified files: $MODIFIED"
echo "::debug::Renamed files: $RENAMED"
echo "::debug::Type Changed files: $TYPE_CHANGED"
echo "::debug::Unmerged files: $UNMERGED"
echo "::debug::Unknown files: $UNKNOWN"
echo "::debug::All changed and modified files: $ALL_CHANGED_AND_MODIFIED"
echo "::debug::All changed files: $ALL_CHANGED"
echo "::debug::All modified files: $ALL_MODIFIED"
if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
  echo "::debug::All old & new renamed files: $ALL_OLD_NEW_RENAMED"
fi

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
if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
  echo "::set-output name=all_old_new_renamed_files::$ALL_OLD_NEW_RENAMED"
fi

echo "::endgroup::"
