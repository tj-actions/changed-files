#!/usr/bin/env bash

set -euo pipefail

INPUT_SEPARATOR="${INPUT_SEPARATOR//'%'/'%25'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//'.'/'%2E'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//$'\n'/'%0A'}"
INPUT_SEPARATOR="${INPUT_SEPARATOR//$'\r'/'%0D'}"

GITHUB_OUTPUT=${GITHUB_OUTPUT:-""}
DIFF=$INPUT_DIFF

OUTPUTS_EXTENSION="txt"

if [[ "$INPUT_JSON" == "true" ]]; then
  OUTPUTS_EXTENSION="json"
fi

if [[ $INPUT_QUOTEPATH == "false" ]]; then
  git config --global core.quotepath off
else
  git config --global core.quotepath on
fi

if [[ -n $INPUT_DIFF_RELATIVE ]]; then
  git config --global diff.relative "$INPUT_DIFF_RELATIVE"
fi

function get_dirname_max_depth() {
  while IFS='' read -r line; do
    local dir="$line"
    local dirs=()
    IFS='/' read -ra dirs <<<"$dir"

    local max_depth=${#dirs[@]}
    local input_dir_names_max_depth="${INPUT_DIR_NAMES_MAX_DEPTH:-$max_depth}"

    if [[ -n "$input_dir_names_max_depth" && "$input_dir_names_max_depth" -lt "$max_depth" ]]; then
      max_depth="$input_dir_names_max_depth"
    fi

    local output="${dirs[0]}"
    local depth="1"

    while [ "$depth" -lt "$max_depth" ]; do
      output="$output/${dirs[${depth}]}"
      depth=$((depth + 1))
    done

    if [[ "$INPUT_DIR_NAMES_EXCLUDE_ROOT" == "true" && "$output" == "." ]]; then
      continue
    fi

    echo "$output"
  done < <(uniq)
}

function json_output() {
  local jq_args="-sR"
  if [[ "$INPUT_JSON_RAW_FORMAT" == "true" ]]; then
    jq_args="$jq_args -r"
  fi

  # shellcheck disable=SC2086
  jq $jq_args 'split("\n") | map(select(. != "")) | @json' | sed -r 's/^"|"$//g' | tr -s /
}

function get_diff() {
  local base="$1"
  local sha="$2"
  local filter="$3"

  while IFS='' read -r sub; do
    sub_commit_pre="$(git diff "$base" "$sha" -- "$sub" | { grep '^[-]Subproject commit' || true; } | awk '{print $3}')" && exit_status=$? || exit_status=$?
    if [[ $exit_status -ne 0 ]]; then
      echo "::warning::Failed to get previous commit for submodule ($sub) between: $base $sha. Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage" >&2
    fi

    sub_commit_cur="$(git diff "$base" "$sha" -- "$sub" | { grep '^[+]Subproject commit' || true; } | awk '{print $3}')" && exit_status=$? || exit_status=$?
    if [[ $exit_status -ne 0 ]]; then
      echo "::warning::Failed to get current commit for submodule ($sub) between: $base $sha. Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage" >&2
    fi

    if [ -n "$sub_commit_cur" ]; then
      (
        cd "$sub" && (
          # the strange magic number is a hardcoded "empty tree" commit sha
          git diff --diff-filter="$filter" --name-only --ignore-submodules=all "${sub_commit_pre:-4b825dc642cb6eb9a060e54bf8d69288fbee4904}" "${sub_commit_cur}" | awk -v r="$sub" '{ print "" r "/" $0}' 2>/dev/null
        )
      ) || {
        echo "::warning::Failed to get changed files for submodule ($sub) between: ${sub_commit_pre:-4b825dc642cb6eb9a060e54bf8d69288fbee4904} ${sub_commit_cur}. Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage" >&2
      }
    fi
  done < <(git submodule | awk '{print $2}')

  git diff --diff-filter="$filter" --name-only --ignore-submodules=all "$base$DIFF$sha" && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Failed to get changed files between: $base$DIFF$sha" >&2
    return 1
  fi
}

function get_renames() {
  local base="$1"
  local sha="$2"

  while IFS='' read -r sub; do
    sub_commit_pre="$(git diff "$base" "$sha" -- "$sub" | { grep '^[-]Subproject commit' || true; } | awk '{print $3}')" && exit_status=$? || exit_status=$?
    if [[ $exit_status -ne 0 ]]; then
      echo "::warning::Failed to get previous commit for submodule ($sub) between: $base $sha. Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage" >&2
    fi

    sub_commit_cur="$(git diff "$base" "$sha" -- "$sub" | { grep '^[+]Subproject commit' || true; } | awk '{print $3}')" && exit_status=$? || exit_status=$?
    if [[ $exit_status -ne 0 ]]; then
      echo "::warning::Failed to get current commit for submodule ($sub) between: $base $sha. Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage" >&2
    fi

    if [ -n "$sub_commit_cur" ]; then
      (
        cd "$sub" && (
          # the strange magic number is a hardcoded "empty tree" commit sha
          git log --name-status --ignore-submodules=all "${sub_commit_pre:-4b825dc642cb6eb9a060e54bf8d69288fbee4904}" "${sub_commit_cur}" | { grep -E "^R" || true; } | awk -F '\t' -v d="$INPUT_OLD_NEW_SEPARATOR" '{print $2d$3}' | awk -v r="$sub" '{ print "" r "/" $0}'
        )
      ) || {
        echo "::warning::Failed to get renamed files for submodule ($sub) between: ${sub_commit_pre:-4b825dc642cb6eb9a060e54bf8d69288fbee4904} ${sub_commit_cur}. Please ensure that submodules are initialized and up to date. See: https://github.com/actions/checkout#usage" >&2
      }
    fi
  done < <(git submodule | awk '{print $2}')

  git log --name-status --ignore-submodules=all "$base" "$sha" | { grep -E "^R" || true; } | awk -F '\t' -v d="$INPUT_OLD_NEW_SEPARATOR" '{print $2d$3}' && exit_status=$? || exit_status=$?

  if [[ $exit_status -ne 0 ]]; then
    echo "::error::Failed to get renamed files between: $base → $sha" >&2
    return 1
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

if [[ "$INPUT_HAS_CUSTOM_PATTERNS" == "false" || -z "$INPUT_FILES_PATTERN_FILE" ]]; then
  if [[ "$INPUT_JSON" == "false" ]]; then
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    else
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
    fi
    if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
      if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
        ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_OLD_NEW_FILES_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      else
        ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | awk -v d="$INPUT_OLD_NEW_FILES_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      fi
    fi
  else
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
    else
      ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | json_output)
      COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | json_output)
      DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | json_output)
      MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | json_output)
      RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | json_output)
      TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | json_output)
      UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | json_output)
      UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | json_output)
      ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | json_output)
      ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | json_output)
      ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | json_output)
    fi
    if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
      if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
        ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      else
        ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | json_output)
      fi
    fi
  fi
else
  ADDED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" A | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" C | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" M | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" R | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" T | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" U | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" X | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "*ACDMRTUX" | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | { grep -x -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
    ALL_OLD_NEW_RENAMED=$(get_renames "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" | { grep -w -E -f "$INPUT_FILES_PATTERN_FILE" || true; } | awk -v d="$INPUT_OLD_NEW_FILES_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  fi

  ALL_OTHER_CHANGED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMR" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${ALL_CHANGED}" ]]; then
    echo "::debug::Matching changed files: ${ALL_CHANGED}"
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=any_changed::true"
    else
      echo "any_changed=true" >>"$GITHUB_OUTPUT"
    fi
  else
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=any_changed::false"
    else
      echo "any_changed=false" >>"$GITHUB_OUTPUT"
    fi
  fi

  OTHER_CHANGED=""

  if [[ -n $ALL_OTHER_CHANGED ]]; then
    if [[ -n "$ALL_CHANGED" ]]; then
      OTHER_CHANGED=$(echo "${ALL_OTHER_CHANGED}|${ALL_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_CHANGED=$ALL_OTHER_CHANGED
    fi
  fi

  if [[ "$INPUT_JSON" == "false" ]]; then
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      OTHER_CHANGED=$(echo "${OTHER_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_CHANGED=$(echo "${OTHER_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    fi
  else
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      OTHER_CHANGED=$(echo "${OTHER_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
    else
      OTHER_CHANGED=$(echo "${OTHER_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
    fi
  fi

  if [[ -n "${OTHER_CHANGED}" && "${OTHER_CHANGED}" != "[]" ]]; then
    echo "::debug::Non Matching changed files: ${OTHER_CHANGED}"

    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=only_changed::false"
      echo "::set-output name=other_changed_files::$OTHER_CHANGED"
    else
      echo "only_changed=false" >>"$GITHUB_OUTPUT"
      echo "other_changed_files=$OTHER_CHANGED" >>"$GITHUB_OUTPUT"
    fi

  elif [[ -n "${ALL_CHANGED}" ]]; then
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=only_changed::true"
    else
      echo "only_changed=true" >>"$GITHUB_OUTPUT"
    fi
  fi

  ALL_OTHER_MODIFIED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" "ACMRD" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${ALL_MODIFIED}" ]]; then
    echo "::debug::Matching modified files: ${ALL_MODIFIED}"
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=any_modified::true"
    else
      echo "any_modified=true" >>"$GITHUB_OUTPUT"
    fi
  else
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=any_modified::false"
    else
      echo "any_modified=false" >>"$GITHUB_OUTPUT"
    fi
  fi

  OTHER_MODIFIED=""

  if [[ -n $ALL_OTHER_MODIFIED ]]; then
    if [[ -n "$ALL_MODIFIED" ]]; then
      OTHER_MODIFIED=$(echo "${ALL_OTHER_MODIFIED}|${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_MODIFIED=$ALL_OTHER_MODIFIED
    fi
  fi

  if [[ "$INPUT_JSON" == "false" ]]; then
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    fi
  else
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
    else
      OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
    fi
  fi

  if [[ -n "${OTHER_MODIFIED}" && "$OTHER_MODIFIED" != "[]" ]]; then
    echo "::debug::Non Matching modified files: ${OTHER_MODIFIED}"

    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=only_modified::false"
      echo "::set-output name=other_modified_files::$OTHER_MODIFIED"
    else
      echo "only_modified=false" >>"$GITHUB_OUTPUT"
      echo "other_modified_files=$OTHER_MODIFIED" >>"$GITHUB_OUTPUT"
    fi
  elif [[ -n "${ALL_MODIFIED}" ]]; then
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=only_modified::true"
    else
      echo "only_modified=true" >>"$GITHUB_OUTPUT"
    fi
  fi

  ALL_OTHER_DELETED=$(get_diff "$INPUT_PREVIOUS_SHA" "$INPUT_CURRENT_SHA" D | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${DELETED}" ]]; then
    echo "::debug::Matching deleted files: ${DELETED}"
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=any_deleted::true"
    else
      echo "any_deleted=true" >>"$GITHUB_OUTPUT"
    fi
  else
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=any_deleted::false"
    else
      echo "any_deleted=false" >>"$GITHUB_OUTPUT"
    fi
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
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      OTHER_DELETED=$(echo "${OTHER_DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_DELETED=$(echo "${OTHER_DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    fi
  else
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      OTHER_DELETED=$(echo "${OTHER_DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
    else
      OTHER_DELETED=$(echo "${OTHER_DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
    fi
  fi

  if [[ -n "${OTHER_DELETED}" && "${OTHER_DELETED}" != "[]" ]]; then
    echo "::debug::Non Matching deleted files: ${OTHER_DELETED}"
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=only_deleted::false"
      echo "::set-output name=other_deleted_files::$OTHER_DELETED"
    else
      echo "only_deleted=false" >>"$GITHUB_OUTPUT"
      echo "other_deleted_files=$OTHER_DELETED" >>"$GITHUB_OUTPUT"
    fi
  elif [[ -n "${DELETED}" ]]; then
    if [[ -z "$GITHUB_OUTPUT" ]]; then
      echo "::set-output name=only_deleted::true"
    else
      echo "only_deleted=true" >>"$GITHUB_OUTPUT"
    fi
  fi
  if [[ "$INPUT_JSON" == "false" ]]; then
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      ADDED=$(echo "${ADDED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      COPIED=$(echo "${COPIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      DELETED=$(echo "${DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      MODIFIED=$(echo "${MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      RENAMED=$(echo "${RENAMED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      TYPE_CHANGED=$(echo "${TYPE_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      UNMERGED=$(echo "${UNMERGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      UNKNOWN=$(echo "${UNKNOWN}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      ALL_CHANGED_AND_MODIFIED=$(echo "${ALL_CHANGED_AND_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      ALL_CHANGED=$(echo "${ALL_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
      ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
    else
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
  else
    if [[ "$INPUT_DIR_NAMES" == "true" ]]; then
      ADDED=$(echo "${ADDED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      COPIED=$(echo "${COPIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      DELETED=$(echo "${DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      MODIFIED=$(echo "${MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      RENAMED=$(echo "${RENAMED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      TYPE_CHANGED=$(echo "${TYPE_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      UNMERGED=$(echo "${UNMERGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      UNKNOWN=$(echo "${UNKNOWN}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      ALL_CHANGED_AND_MODIFIED=$(echo "${ALL_CHANGED_AND_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      ALL_CHANGED=$(echo "${ALL_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
      ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | xargs -I {} dirname {} | get_dirname_max_depth | uniq | json_output)
    else
      ADDED=$(echo "${ADDED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      COPIED=$(echo "${COPIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      DELETED=$(echo "${DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      MODIFIED=$(echo "${MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      RENAMED=$(echo "${RENAMED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      TYPE_CHANGED=$(echo "${TYPE_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      UNMERGED=$(echo "${UNMERGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      UNKNOWN=$(echo "${UNKNOWN}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      ALL_CHANGED_AND_MODIFIED=$(echo "${ALL_CHANGED_AND_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      ALL_CHANGED=$(echo "${ALL_CHANGED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
      ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | json_output)
    fi
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

if [[ -z "$GITHUB_OUTPUT" ]]; then
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
  echo "::set-output name=outputs_extension::$OUTPUTS_EXTENSION"
else
  cat <<EOF >>"$GITHUB_OUTPUT"
added_files=$ADDED
copied_files=$COPIED
deleted_files=$DELETED
modified_files=$MODIFIED
renamed_files=$RENAMED
type_changed_files=$TYPE_CHANGED
unmerged_files=$UNMERGED
unknown_files=$UNKNOWN
all_changed_and_modified_files=$ALL_CHANGED_AND_MODIFIED
all_changed_files=$ALL_CHANGED
all_modified_files=$ALL_MODIFIED
outputs_extension=$OUTPUTS_EXTENSION
EOF
fi

if [[ $INPUT_INCLUDE_ALL_OLD_NEW_RENAMED_FILES == "true" ]]; then
  if [[ -z "$GITHUB_OUTPUT" ]]; then
    echo "::set-output name=all_old_new_renamed_files::$ALL_OLD_NEW_RENAMED"
  else
    echo "all_old_new_renamed_files=$ALL_OLD_NEW_RENAMED" >>"$GITHUB_OUTPUT"
  fi
fi

echo "::endgroup::"
