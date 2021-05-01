#!/usr/bin/env bash

set -e

echo "Getting head sha..."

if [[ -z $GITHUB_BASE_REF ]]; then
  HEAD_SHA=$(git rev-parse HEAD^1 || true)
else
  TARGET_BRANCH=${GITHUB_BASE_REF}
  git fetch --depth=1 origin ${TARGET_BRANCH}:${TARGET_BRANCH}
  HEAD_SHA=$(git rev-parse ${TARGET_BRANCH} || true)
fi

INPUT_FILES="${{ inputs.files }}"

if [[ -z "$INPUT_FILES" ]]; then
  echo "Getting diff..."
  ADDED=$(git diff --diff-filter=A --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  COPIED=$(git diff --diff-filter=C --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  DELETED=$(git diff --diff-filter=D --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  MODIFIED=$(git diff --diff-filter=M --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  RENAMED=$(git diff --diff-filter=R --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  CHANGED=$(git diff --diff-filter=T --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  UNMERGED=$(git diff --diff-filter=U --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  UNKNOWN=$(git diff --diff-filter=X --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  ALL_CHANGED=$(git diff --diff-filter='*ACDMRTUX' --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
  ALL_MODIFIED_FILES=$(git diff --diff-filter='ACM' --name-only "$HEAD_SHA" | tr "\n" "${{ inputs.separator }}" | sed -E 's/(${{ inputs.separator }})$//')
else
  ADDED=()
  COPIED=()
  DELETED=()
  MODIFIED=()
  RENAMED=()
  CHANGED=()
  UNMERGED=()
  UNKNOWN=()
  ALL_CHANGED=()
  ALL_MODIFIED_FILES=()
  for path in ${INPUT_FILES}
  do
    echo "Checking for file changes: \"${path}\"..."
    ADDED+=$(git diff --diff-filter=A --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    COPIED+=$(git diff --diff-filter=C --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    DELETED+=$(git diff --diff-filter=D --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    MODIFIED+=$(git diff --diff-filter=M --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    RENAMED+=$(git diff --diff-filter=R --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    CHANGED+=$(git diff --diff-filter=T --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    UNMERGED+=$(git diff --diff-filter=U --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    UNKNOWN+=$(git diff --diff-filter=X --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    ALL_CHANGED+=$(git diff --diff-filter='*ACDMRTUX' --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
    ALL_MODIFIED_FILES+=$(git diff --diff-filter='ACM' --name-only "$HEAD_SHA" | grep -E "(${path})" | xargs printf "%s${{ inputs.separator }}" || true)
  done

  ADDED=$(echo "$ADDED" | sed -E 's/(${{ inputs.separator }})$//')
  COPIED=$(echo $COPIED | sed -E 's/(${{ inputs.separator }})$//')
  DELETED=$(echo "$DELETED" | sed -E 's/(${{ inputs.separator }})$//')
  MODIFIED=$(echo "$MODIFIED" | sed -E 's/(${{ inputs.separator }})$//')
  RENAMED=$(echo "$RENAMED" | sed -E 's/(${{ inputs.separator }})$//')
  CHANGED=$(echo "$CHANGED" | sed -E 's/(${{ inputs.separator }})$//')
  UNMERGED=$(echo "$UNMERGED" | sed -E 's/(${{ inputs.separator }})$//')
  UNKNOWN=$(echo "$UNKNOWN" | sed -E 's/(${{ inputs.separator }})$//')
  ALL_CHANGED=$(echo "$ALL_CHANGED" | sed -E 's/(${{ inputs.separator }})$//')
  ALL_MODIFIED_FILES=$(echo "$ALL_MODIFIED_FILES" | sed -E 's/(${{ inputs.separator }})$//')

  OUTPUT_ALL_MODIFIED_FILES=$(echo $ALL_MODIFIED_FILES | sed "s/${{ inputs.separator }}/ /g")
  ALL_INPUT_FILES=$(echo $INPUT_FILES | sed "s/\n/ /g")
  IFS=$' ' SORTED_INPUT_FILES=($(sort <<<"${ALL_INPUT_FILES[*]}"))
  IFS=$' ' SORTED_OUTPUT_ALL_MODIFIED_FILES=($(sort <<<"${OUTPUT_ALL_MODIFIED_FILES[*]}"))

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
