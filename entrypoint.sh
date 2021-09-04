#!/usr/bin/env bash

set -e

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

git remote add temp_changed_files "https://${INPUT_TOKEN}@github.com/${GITHUB_REPOSITORY}"

echo "Getting HEAD info..."

if [[ -z $INPUT_SHA ]]; then
  CURRENT_SHA=$(git rev-parse HEAD 2>&1) && exit_status=$? || exit_status=$?
else
  CURRENT_SHA=$INPUT_SHA
fi

if [[ $exit_status -ne 0 ]]; then
  echo "::warning::Unable to determine the current head sha"
  exit 1
fi

if [[ -z $GITHUB_BASE_REF ]]; then
  if [[ -z $INPUT_BASE_SHA ]]; then
    PREVIOUS_SHA=$(git rev-parse HEAD^1 2>&1) && exit_status=$? || exit_status=$?
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA
  fi
  TARGET_BRANCH=${GITHUB_REF/refs\/heads\//}
  CURRENT_BRANCH=$TARGET_BRANCH

  if [[ $exit_status -ne 0 ]]; then
    echo "::warning::Unable to determine the previous commit sha"
    echo "::warning::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    exit 1
  fi
else
  TARGET_BRANCH=$GITHUB_BASE_REF
  CURRENT_BRANCH=$GITHUB_HEAD_REF
  git fetch temp_changed_files "${TARGET_BRANCH}":"${TARGET_BRANCH}"
  if [[ -z $INPUT_BASE_SHA ]]; then
    PREVIOUS_SHA=$(git rev-parse "${TARGET_BRANCH}" 2>&1) && exit_status=$? || exit_status=$?
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA
  fi

  if [[ $exit_status -ne 0 ]]; then
    echo "::warning::Unable to determine the base ref sha for ${TARGET_BRANCH}"
    exit 1
  fi
fi

echo "Retrieving changes between $PREVIOUS_SHA ($TARGET_BRANCH) → $CURRENT_SHA ($CURRENT_BRANCH)"

UNIQUE_FILES=$(echo "$INPUT_FILES" | tr " " "\n" | sort -u | xargs -0)

if [[ -z "${UNIQUE_FILES[*]}" ]]; then
  echo "Getting diff..."
  ADDED=$(git diff --diff-filter=A --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(git diff --diff-filter=C --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(git diff --diff-filter=D --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(git diff --diff-filter=M --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(git diff --diff-filter=R --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(git diff --diff-filter=T --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(git diff --diff-filter=U --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(git diff --diff-filter=X --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED=$(git diff --diff-filter="*ACDMRTUX" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED_FILES=$(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
else
  ADDED_ARRAY=()
  COPIED_ARRAY=()
  DELETED_ARRAY=()
  MODIFIED_ARRAY=()
  RENAMED_ARRAY=()
  TYPE_CHANGED_ARRAY=()
  UNMERGED_ARRAY=()
  UNKNOWN_ARRAY=()
  ALL_CHANGED_ARRAY=()
  ALL_MODIFIED_FILES_ARRAY=()

  for path in ${UNIQUE_FILES}
  do
    echo "Checking for file changes: \"${path}\"..."
    IFS=" "
    # shellcheck disable=SC2207
    ADDED_ARRAY+=($(git diff --diff-filter=A --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    COPIED_ARRAY+=($(git diff --diff-filter=C --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    DELETED_ARRAY+=($(git diff --diff-filter=D --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    MODIFIED_ARRAY+=($(git diff --diff-filter=M --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    RENAMED_ARRAY+=($(git diff --diff-filter=R --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    TYPE_CHANGED_ARRAY+=($(git diff --diff-filter=T --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    UNMERGED_ARRAY+=($(git diff --diff-filter=U --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    UNKNOWN_ARRAY+=($(git diff --diff-filter=X --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    ALL_CHANGED_ARRAY+=($(git diff --diff-filter="*ACDMRTUX" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
    # shellcheck disable=SC2207
    ALL_MODIFIED_FILES_ARRAY+=($(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true))
  done

  ADDED=$(echo "${ADDED_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  COPIED=$(echo "${COPIED_ARRAY[*]}" tr " " "\n" | sort -u | xargs -0)
  DELETED=$(echo "${DELETED_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  MODIFIED=$(echo "${MODIFIED_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  RENAMED=$(echo "${RENAMED_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  TYPE_CHANGED=$(echo "${TYPE_CHANGED_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  UNMERGED=$(echo "${UNMERGED_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  UNKNOWN=$(echo "${UNKNOWN_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  ALL_CHANGED=$(echo "${ALL_CHANGED_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
  ALL_MODIFIED_FILES=$(echo "${ALL_MODIFIED_FILES_ARRAY[*]}" | tr " " "\n" | sort -u | xargs -0)
fi

echo "Added files: $ADDED"
echo "Copied files: $COPIED"
echo "Deleted files: $DELETED"
echo "Modified files: $MODIFIED"
echo "Renamed files: $RENAMED"
echo "Type Changed files: $TYPE_CHANGED"
echo "Unmerged files: $UNMERGED"
echo "Unknown files: $UNKNOWN"
echo "All changed files: $ALL_CHANGED"
echo "All modified files: $ALL_MODIFIED_FILES"

if [[ -n "$UNIQUE_FILES" ]]; then
  ALL_OTHER_CHANGED_FILES=$(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA")

  OTHER_CHANGED_FILES=$(echo "${ALL_OTHER_CHANGED_FILES[@]}" "${ALL_MODIFIED_FILES[@]}" | tr " " "\n" | sort | uniq -u | xargs -0)

  echo "Input files: ${UNIQUE_FILES[*]}"
  echo "Matching modified files: ${ALL_MODIFIED_FILES[*]}"

  if [[ -n "$ALL_MODIFIED_FILES" ]]; then
    echo "::set-output name=any_changed::true"
  else
    echo "::set-output name=any_changed::false"
  fi

  if [[ -n "$OTHER_CHANGED_FILES" ]]; then
    echo "Non Matching modified files: ${OTHER_CHANGED_FILES[*]}"
    echo "::set-output name=only_changed::false"
    echo "::set-output name=other_changed_files::$OTHER_CHANGED_FILES"
  else
    echo "::set-output name=only_changed::true"
  fi

fi

git remote remove temp_changed_files

echo "::set-output name=added_files::$ADDED"
echo "::set-output name=copied_files::$COPIED"
echo "::set-output name=deleted_files::$DELETED"
echo "::set-output name=modified_files::$MODIFIED"
echo "::set-output name=renamed_files::$RENAMED"
echo "::set-output name=type_changed_files::$TYPE_CHANGED"
echo "::set-output name=unmerged_files::$UNMERGED"
echo "::set-output name=unknown_files::$UNKNOWN"
echo "::set-output name=all_changed_files::$ALL_CHANGED"
echo "::set-output name=all_modified_files::$ALL_MODIFIED_FILES"

echo "::endgroup::"
