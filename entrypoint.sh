#!/usr/bin/env bash

set -e

echo "Getting head sha..."
if [[ -z $GITHUB_BASE_REF ]]; then
  HEAD_SHA=$(git rev-parse HEAD^1 || true)
else
  TARGET_BRANCH=${GITHUB_BASE_REF}
  git fetch --depth=1 origin "${TARGET_BRANCH}":"${TARGET_BRANCH}"
  HEAD_SHA=$(git rev-parse "${TARGET_BRANCH}" || true)
fi

if [[ -z "$INPUT_FILES" ]]; then
  echo "Getting diff..."
  ADDED=$(git diff --diff-filter=A --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  COPIED=$(git diff --diff-filter=C --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  DELETED=$(git diff --diff-filter=D --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  MODIFIED=$(git diff --diff-filter=M --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  RENAMED=$(git diff --diff-filter=R --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  CHANGED=$(git diff --diff-filter=T --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  UNMERGED=$(git diff --diff-filter=U --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  UNKNOWN=$(git diff --diff-filter=X --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  ALL_CHANGED=$(git diff --diff-filter="*ACDMRTUX" --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
  ALL_MODIFIED_FILES=$(git diff --diff-filter="ACM" --name-only "$HEAD_SHA" | tr "\n" "$INPUT_SEPARATOR" | sed -E "s/($INPUT_SEPARATOR)$//")
else
  ADDED_ARRAY=()
  COPIED_ARRAY=()
  DELETED_ARRAY=()
  MODIFIED_ARRAY=()
  RENAMED_ARRAY=()
  CHANGED_ARRAY=()
  UNMERGED_ARRAY=()
  UNKNOWN_ARRAY=()
  ALL_CHANGED_ARRAY=()
  ALL_MODIFIED_FILES_ARRAY=()

  for path in ${INPUT_FILES}
  do
    echo "Checking for file changes: \"${path}\"..."
    IFS=" " read -r -a ADDED_ARRAY <<< "$(git diff --diff-filter=A --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a COPIED_ARRAY <<< "$(git diff --diff-filter=C --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a DELETED_ARRAY <<< "$(git diff --diff-filter=D --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a MODIFIED_ARRAY <<< "$(git diff --diff-filter=M --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a RENAMED_ARRAY <<< "$(git diff --diff-filter=R --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a CHANGED_ARRAY <<< "$(git diff --diff-filter=T --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a UNMERGED_ARRAY <<< "$(git diff --diff-filter=U --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a UNKNOWN_ARRAY <<< "$(git diff --diff-filter=X --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a ALL_CHANGED_ARRAY <<< "$(git diff --diff-filter="*ACDMRTUX" --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
    IFS=" " read -r -a ALL_MODIFIED_FILES_ARRAY <<< "$(git diff --diff-filter="ACM" --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s$INPUT_SEPARATOR" || true)"
  done

  ADDED=$(echo "${ADDED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  COPIED=$(echo "${COPIED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  DELETED=$(echo "${DELETED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  MODIFIED=$(echo "${MODIFIED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  RENAMED=$(echo "${RENAMED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  CHANGED=$(echo "${CHANGED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  UNMERGED=$(echo "${UNMERGED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  UNKNOWN=$(echo "${UNKNOWN_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  ALL_CHANGED=$(echo "${ALL_CHANGED_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")
  ALL_MODIFIED_FILES=$(echo "${ALL_MODIFIED_FILES_ARRAY[@]}" | sed -E "s/($INPUT_SEPARATOR)$//")

  # shellcheck disable=SC2001
  OUTPUT_ALL_MODIFIED_FILES=$(echo "$ALL_MODIFIED_FILES" | sed "s/$INPUT_SEPARATOR/ /g")
  ALL_INPUT_FILES=${INPUT_FILES//\n/ }

  SORTED_INPUT_FILES=()
  SORTED_OUTPUT_ALL_MODIFIED_FILES=()

  IFS=" " read -r -a SORTED_INPUT_FILES <<< "$(sort <<<"${ALL_INPUT_FILES[*]}")"
  IFS=" " read -r -a SORTED_OUTPUT_ALL_MODIFIED_FILES <<< "$(sort <<<"${OUTPUT_ALL_MODIFIED_FILES[*]}")"

  if [[ "${SORTED_INPUT_FILES[*]}" == "${SORTED_OUTPUT_ALL_MODIFIED_FILES[*]}" ]]; then
    echo "::set-output name=all_changed::true"
  else
    echo "::set-output name=all_changed::false"
  fi

  if [[ ${#SORTED_OUTPUT_ALL_MODIFIED_FILES[@]} -gt 0 ]]; then
    echo "::set-output name=any_changed::true"
  else
    echo "::set-output name=any_changed::false"
  fi
fi

echo "::set-output name=added_files::$ADDED"
echo "::set-output name=copied_files::$COPIED"
echo "::set-output name=deleted_files::$DELETED"
echo "::set-output name=modified_files::$MODIFIED"
echo "::set-output name=renamed_files::$RENAMED"
echo "::set-output name=changed_files::$CHANGED"
echo "::set-output name=unmerged_files::$UNMERGED"
echo "::set-output name=unknown_files::$UNKNOWN"
echo "::set-output name=all_changed_files::$ALL_CHANGED"
echo "::set-output name=all_modified_files::$ALL_MODIFIED_FILES"
