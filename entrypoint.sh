#!/usr/bin/env bash

set -e

git remote set-url origin "https://${INPUT_TOKEN}@github.com/${GITHUB_REPOSITORY}"
