#!/bin/bash
# Script to push the backup-main-01 branch to remote
# This script should be run by someone with push access to the repository

set -e

echo "Pushing backup-main-01 branch to remote..."
echo "This branch is a backup of main at commit e5e4aa9351dfb86573db78b0069a44dde9b0771f"

# Push the local backup-main-01 branch to remote
git push origin backup-main-01:backup-main-01

echo "✓ Successfully pushed backup-main-01 to remote"
echo ""
echo "Verify with: git ls-remote --heads origin | grep backup-main-01"
