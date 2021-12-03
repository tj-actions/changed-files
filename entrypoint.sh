#!/usr/bin/env bash

set -eu

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

echo "Setting up 'temp_changed_files' remote..."

git ls-remote --exit-code temp_changed_files 1>/dev/null 2>&1 && exit_status=$? || exit_status=$?

if [[ $exit_status -ne 0 ]]; then
  echo "No 'temp_changed_files' remote found"
  echo "Creating 'temp_changed_files' remote..."
  git remote add temp_changed_files "https://${INPUT_TOKEN}@${SERVER_URL}/${GITHUB_REPOSITORY}"
else
  echo "Found 'temp_changed_files' remote"
fi

echo "Getting HEAD info..."

if [[ -z $INPUT_SHA ]]; then
  CURRENT_SHA=$(git rev-parse HEAD 2>&1) && exit_status=$? || exit_status=$?
else
  CURRENT_SHA=$INPUT_SHA && exit_status=$? || exit_status=$?
fi

if [[ $exit_status -ne 0 ]]; then
  echo "::warning::Unable to determine the current head sha"
  git remote remove temp_changed_files
  exit 1
fi

if [[ -z $GITHUB_BASE_REF ]]; then
  TARGET_BRANCH=${GITHUB_REF/refs\/heads\//}
  CURRENT_BRANCH=$TARGET_BRANCH

  if [[ -z $INPUT_BASE_SHA ]]; then
    PREVIOUS_SHA=$(git rev-parse HEAD^1 2>&1) && exit_status=$? || exit_status=$?
  else
    PREVIOUS_SHA=$INPUT_BASE_SHA && exit_status=$? || exit_status=$?
  fi

  if [[ $exit_status -ne 0 ]]; then
    echo "::warning::Unable to determine the previous commit sha"
    echo "::warning::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    git remote remove temp_changed_files
    exit 1
  fi
else
  TARGET_BRANCH=$GITHUB_BASE_REF
  CURRENT_BRANCH=$GITHUB_HEAD_REF

  if [[ -z $INPUT_BASE_SHA ]]; then
    git fetch --no-tags -u --progress --depth=1 temp_changed_files "${TARGET_BRANCH}":"${TARGET_BRANCH}" && exit_status=$? || exit_status=$?
    PREVIOUS_SHA=$(git rev-parse "${TARGET_BRANCH}" 2>&1) && exit_status=$? || exit_status=$?
  else
    git fetch --no-tags -u --progress --depth=1 temp_changed_files "$INPUT_BASE_SHA" && exit_status=$? || exit_status=$?
    PREVIOUS_SHA=$INPUT_BASE_SHA
  fi

  if [[ $exit_status -ne 0 ]]; then
    echo "::warning::Unable to determine the base ref sha for ${TARGET_BRANCH}"
    echo "::warning::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
    git remote remove temp_changed_files
    exit 1
  fi
fi

echo "Retrieving changes between $PREVIOUS_SHA ($TARGET_BRANCH) → $CURRENT_SHA ($CURRENT_BRANCH)"

echo "Verifing commit hash..."

git rev-parse --quiet --verify "$PREVIOUS_SHA^{commit}" && exit_status=$? || exit_status=$?
git rev-parse --quiet --verify "$CURRENT_SHA^{commit}" && exit_status=$? || exit_status=$?

if [[ $exit_status -ne 0 ]]; then
  echo "::warning::Unable to determine changes between $PREVIOUS_SHA ($TARGET_BRANCH) → $CURRENT_SHA ($CURRENT_BRANCH)"
  echo "::warning::You seem to be missing 'fetch-depth: 0' or 'fetch-depth: 2'. See https://github.com/tj-actions/changed-files#usage"
  git remote remove temp_changed_files
  exit 1
fi

if [[ -z "${INPUT_FILES[*]}" ]]; then
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
  echo "Input files: ${INPUT_FILES[*]}"

  FILES=$(echo "${INPUT_FILES[*]}" | awk '{gsub(/ /,"\n"); print $0;}' | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  echo "Checking for file changes: \"${FILES}\"..."
  ADDED=$(git diff --diff-filter=A --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  COPIED=$(git diff --diff-filter=C --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  DELETED=$(git diff --diff-filter=D --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  MODIFIED=$(git diff --diff-filter=M --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  RENAMED=$(git diff --diff-filter=R --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  TYPE_CHANGED=$(git diff --diff-filter=T --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNMERGED=$(git diff --diff-filter=U --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNKNOWN=$(git diff --diff-filter=X --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_CHANGED_AND_MODIFIED=$(git diff --diff-filter="*ACDMRTUX" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  ALL_MODIFIED=$(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | grep -E "(${FILES})" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  ALL_OTHER_MODIFIED=$(git diff --diff-filter="ACMR" --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNIQUE_ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | sort -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n $ALL_OTHER_MODIFIED ]]; then
    if [[ -n "$UNIQUE_ALL_MODIFIED" ]]; then
      OTHER_MODIFIED=$(echo "${ALL_OTHER_MODIFIED}|${UNIQUE_ALL_MODIFIED}"  | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_MODIFIED=$ALL_OTHER_MODIFIED
    fi
  fi

  UNIQUE_ALL_MODIFIED=$(echo "${UNIQUE_ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${UNIQUE_ALL_MODIFIED}" ]]; then
    echo "Matching modified files: ${UNIQUE_ALL_MODIFIED}"
    echo "::set-output name=any_changed::true"
  else
    echo "::set-output name=any_changed::false"
  fi

  OTHER_MODIFIED=$(echo "${OTHER_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n "${OTHER_MODIFIED}" ]]; then
    echo "Non Matching modified files: ${OTHER_MODIFIED}"
    echo "::set-output name=only_changed::false"
    echo "::set-output name=other_changed_files::$OTHER_MODIFIED"
  elif [[ -n "${UNIQUE_ALL_MODIFIED}" ]]; then
    echo "::set-output name=only_changed::true"
  fi

  ALL_OTHER_DELETED=$(git diff --diff-filter=D --name-only "$PREVIOUS_SHA" "$CURRENT_SHA" | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
  UNIQUE_ALL_DELETED=$(echo "${DELETED}" | awk '{gsub(/\|/,"\n"); print $0;}' | sort -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')

  if [[ -n $ALL_OTHER_DELETED ]]; then
    if [[ -n "$UNIQUE_ALL_DELETED" ]]; then
      OTHER_DELETED=$(echo "${ALL_OTHER_DELETED}|${UNIQUE_ALL_DELETED}"  | awk '{gsub(/\|/,"\n"); print $0;}' | sort | uniq -u | awk -v d="|" '{s=(NR==1?s:s d)$0}END{print s}')
    else
      OTHER_DELETED=$ALL_OTHER_DELETED
    fi
  fi

  echo "Matching deleted files: ${UNIQUE_ALL_DELETED}"

  if [[ -n "${UNIQUE_ALL_DELETED}" ]]; then
    echo "::set-output name=any_deleted::true"
  else
    echo "::set-output name=any_deleted::false"
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
  ALL_MODIFIED=$(echo "${ALL_MODIFIED}" | awk '{gsub(/\|/,"\n"); print $0;}' | awk -v d="$INPUT_SEPARATOR" '{s=(NR==1?s:s d)$0}END{print s}')
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
