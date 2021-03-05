#!/usr/bin/env bash

set -e

if [[ -z $GITHUB_BASE_REF ]]; then
  echo "Skipping: This should only run on pull_request.";
  exit 0;
fi

GITHUB_TOKEN=$1
TARGET_BRANCH=${GITHUB_BASE_REF}
CURRENT_BRANCH=${GITHUB_HEAD_REF}

git remote set-url origin https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}

echo "Getting base branch..."
git config --local remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git config --local --add remote.origin.fetch "+refs/tags/*:refs/tags/*"

git fetch --depth=1 origin ${TARGET_BRANCH}:${TARGET_BRANCH}

echo "Getting head sha..."
HEAD_SHA=$(git rev-parse ${TARGET_BRANCH} || true)

echo "Getting diff..."

ADDED_FILES=$(git diff --diff-filter=A --name-only ${HEAD_SHA} || true)
COPIED_FILES=$(git diff --diff-filter=C --name-only ${HEAD_SHA} || true)
DELETED_FILES=$(git diff --diff-filter=D --name-only ${HEAD_SHA} || true)
MODIFIED_FILES=$(git diff --diff-filter=M --name-only ${HEAD_SHA} || true)
RENAMED_FILES=$(git diff --diff-filter=R --name-only ${HEAD_SHA} || true)
CHANGED_FILES=$(git diff --diff-filter=T --name-only ${HEAD_SHA} || true)
UNMERGED_FILES=$(git diff --diff-filter=R --name-only ${HEAD_SHA} || true)
UNKNOWN_FILES=$(git diff --diff-filter=X --name-only ${HEAD_SHA} || true)
ALL_CHANGED_FILES=$(git diff --diff-filter="*" --name-only ${HEAD_SHA} || true)


echo "::set-output name=added_files::$ADDED_FILES"
echo "::set-output name=copied_files::$COPIED_FILES"
echo "::set-output name=deleted_files::$DELETED_FILES"
echo "::set-output name=modified_files::$MODIFIED_FILES"
echo "::set-output name=renamed_files::$RENAMED_FILES"
echo "::set-output name=changed_files::$CHANGED_FILES"
echo "::set-output name=unmerged_files::$UNMERGED_FILES"
echo "::set-output name=unknown_files::$UNKNOWN_FILES"
echo "::set-output name=all_changed_files::$ALL_CHANGED_FILES"
