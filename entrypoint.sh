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

SERVER_URL=$(echo "$GITHUB_SERVER_URL" | awk -F/ '{print $3}')

git remote add temp_changed_files "https://${INPUT_TOKEN}@${SERVER_URL}/${GITHUB_REPOSITORY}"

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
  git fetch temp_changed_files -u "${TARGET_BRANCH}":"${TARGET_BRANCH}"
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

if [[ -z "${INPUT_FILES[*]}" ]]; then
  echo "Getting diff..."
  ADDED=$(git diff --diff-filter=A --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(git diff --diff-filter=C --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(git diff --diff-filter=D --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(git diff --diff-filter=M --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(git diff --diff-filter=R --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(git diff --diff-filter=T --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(git diff --diff-filter=U --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(git diff --diff-filter=X --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(git diff --diff-filter="*ACDMRTUX" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
else
  ADDED_ARRAY=()
  COPIED_ARRAY=()
  DELETED_ARRAY=()
  MODIFIED_ARRAY=()
  RENAMED_ARRAY=()
  TYPE_CHANGED_ARRAY=()
  UNMERGED_ARRAY=()
  UNKNOWN_ARRAY=()
  ALL_CHANGED_AND_MODIFIED_ARRAY=()
  ALL_MODIFIED_ARRAY=()

  echo "Input files: ${INPUT_FILES[*]}"

  for path in ${INPUT_FILES}
  do
    echo "Checking for file changes: \"${path}\"..."
    IFS=" " read -r -a ADDED_CURRENT_ARRAY <<< "$(git diff --diff-filter=A --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    ADDED_ARRAY=("${ADDED_ARRAY[@]}" "${ADDED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a COPIED_CURRENT_ARRAY <<< "$(git diff --diff-filter=C --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    COPIED_ARRAY=("${COPIED_ARRAY[@]}" "${COPIED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a DELETED_CURRENT_ARRAY <<< "$(git diff --diff-filter=D --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    DELETED_ARRAY=("${DELETED_ARRAY[@]}" "${DELETED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a MODIFIED_CURRENT_ARRAY <<< "$(git diff --diff-filter=M --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    MODIFIED_ARRAY=("${MODIFIED_ARRAY[@]}" "${MODIFIED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a RENAMED_CURRENT_ARRAY <<< "$(git diff --diff-filter=R --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    RENAMED_ARRAY=("${RENAMED_ARRAY[@]}" "${RENAMED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a TYPE_CHANGED_CURRENT_ARRAY <<< "$(git diff --diff-filter=T --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    TYPE_CHANGED_ARRAY=("${TYPE_CHANGED_ARRAY[@]}" "${TYPE_CHANGED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a UNMERGED_CURRENT_ARRAY <<< "$(git diff --diff-filter=U --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    UNMERGED_ARRAY=("${UNMERGED_ARRAY[@]}" "${UNMERGED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a UNKNOWN_CURRENT_ARRAY <<< "$(git diff --diff-filter=X --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    UNKNOWN_ARRAY=("${UNKNOWN_ARRAY[@]}" "${UNKNOWN_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a ALL_CHANGED_AND_MODIFIED_CURRENT_ARRAY <<< "$(git diff --diff-filter="*ACDMRTUX" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    ALL_CHANGED_AND_MODIFIED_ARRAY=("${ALL_CHANGED_AND_MODIFIED_ARRAY[@]}" "${ALL_CHANGED_AND_MODIFIED_CURRENT_ARRAY[@]}")

    IFS=" " read -r -a ALL_MODIFIED_CURRENT_ARRAY <<< "$(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${path})" | xargs -0 || true)"
    ALL_MODIFIED_ARRAY=("${ALL_MODIFIED_ARRAY[@]}" "${ALL_MODIFIED_CURRENT_ARRAY[@]}")
  done

  ADDED=$(printf "%s\n" "${ADDED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(printf "%s\n" "${COPIED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(printf "%s\n" "${DELETED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(printf "%s\n" "${MODIFIED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(printf "%s\n" "${RENAMED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(printf "%s\n" "${TYPE_CHANGED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(printf "%s\n" "${UNMERGED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(printf "%s\n" "${UNKNOWN_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(printf "%s\n" "${ALL_CHANGED_AND_MODIFIED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(printf "%s\n" "${ALL_MODIFIED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  ALL_OTHER_MODIFIED=$(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA")

  echo "ADDED: $ADDED"
  echo "COPIED: $COPIED"
  echo "DELETED: $DELETED"
  echo "MODIFIED: $MODIFIED"
  echo "TYPE_CHANGED: $TYPE_CHANGED"
  echo "UNMERGED: $UNMERGED"
  echo "UNKNOWN: $UNKNOWN"
  echo "ALL_CHANGED_AND_MODIFIED: $ALL_CHANGED_AND_MODIFIED"
  echo "ALL_MODIFIED: $ALL_MODIFIED"
  echo "ALL_OTHER_MODIFIED: $ALL_OTHER_MODIFIED"

  IFS=$'\n' read -r -a UNIQUE_ALL_MODIFIED_ARRAY <<< "$(printf "%s\n" "${ALL_MODIFIED_ARRAY[@]}" | sort -u)"
  IFS=$'\n' read -r -a OTHER_MODIFIED_ARRAY <<< "$(printf "%s\n" "${ALL_OTHER_MODIFIED[@]}" "${UNIQUE_ALL_MODIFIED_ARRAY[@]}" | sort | uniq -u)"

  OTHER_MODIFIED=$(printf "%s\n" "${OTHER_MODIFIED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  echo "Matching modified files: ${UNIQUE_ALL_MODIFIED_ARRAY[*]}"

  if [[ -n "${UNIQUE_ALL_MODIFIED_ARRAY[*]}" ]]; then
    echo "::set-output name=any_changed::true"
  else
    echo "::set-output name=any_changed::false"
  fi

  if [[ -n "${OTHER_MODIFIED_ARRAY[*]}" ]]; then
    echo "Non Matching modified files: ${OTHER_MODIFIED_ARRAY[*]}"
    echo "::set-output name=only_changed::false"
    echo "::set-output name=other_changed_files::$OTHER_MODIFIED"
  elif [[ -n "${UNIQUE_ALL_MODIFIED_ARRAY[*]}" ]]; then
    echo "::set-output name=only_changed::true"
  fi

  OTHER_DELETED=$(git diff --diff-filter=D --name-only "$PREVIOUS_SHA" "$CURRENT_SHA")

  IFS=$'\n' read -r -a UNIQUE_DELETED_ARRAY <<< "$(printf "%s\n" "${DELETED_ARRAY[@]}" | sort -u)"
  IFS=$'\n' read -r -a OTHER_DELETED_ARRAY <<< "$(echo "${OTHER_DELETED[@]}" "${UNIQUE_DELETED_ARRAY[@]}" | xargs -0 printf "%s\n" | sort -u)"

  OTHER_DELETED=$(printf "%s\n" "${OTHER_DELETED_ARRAY[@]}" | sort -u | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  echo "Matching deleted files: ${UNIQUE_DELETED_ARRAY[*]}"

  if [[ -n "${UNIQUE_DELETED_ARRAY[*]}" ]]; then
    echo "::set-output name=any_deleted::true"
  else
    echo "::set-output name=any_deleted::false"
  fi

  if [[ -n "${OTHER_DELETED_ARRAY[*]}" ]]; then
    echo "Non Matching deleted files: ${OTHER_DELETED_ARRAY[*]}"
    echo "::set-output name=only_deleted::false"
    echo "::set-output name=other_deleted_files::$OTHER_DELETED"
  elif [[ -n "${UNIQUE_DELETED_ARRAY[*]}" ]]; then
    echo "::set-output name=only_deleted::true"
  fi
fi

echo "Added files: $ADDED"
echo "Copied files: $COPIED"
echo "Deleted files: $DELETED"
echo "Modified files: $MODIFIED"
echo "Renamed files: $RENAMED"
echo "Type Changed files: $TYPE_CHANGED"
echo "Unmerged files: $UNMERGED"
echo "Unknown files: $UNKNOWN"
echo "All changed files: $ALL_CHANGED_AND_MODIFIED"
echo "All modified files: $ALL_MODIFIED"

git remote remove temp_changed_files

echo "::set-output name=added_files::$ADDED"
echo "::set-output name=copied_files::$COPIED"
echo "::set-output name=deleted_files::$DELETED"
echo "::set-output name=modified_files::$MODIFIED"
echo "::set-output name=renamed_files::$RENAMED"
echo "::set-output name=type_changed_files::$TYPE_CHANGED"
echo "::set-output name=unmerged_files::$UNMERGED"
echo "::set-output name=unknown_files::$UNKNOWN"
echo "::set-output name=all_changed_and_modified_files::$ALL_CHANGED_AND_MODIFIED"
echo "::set-output name=all_modified_files::$ALL_MODIFIED"

echo "::endgroup::"
