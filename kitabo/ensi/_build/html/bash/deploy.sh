#!/bin/bash

set -e
trap 'git worktree remove /tmp/temp-ghp-check --force 2>/dev/null || true; rm -rf /tmp/temp-ghp-check 2>/dev/null || true' EXIT

# ──────────────────────────────────────────────────────────────
# 🌊 0. Prompt the navigator
read -p "📜 Enter your commit message: " commit_message

# Get current branch
current_branch=$(git branch --show-current)

read -p "🛰️ Enter the Git remote to push to (default: origin): " git_remote
git_remote=${git_remote:-origin}

read -p "🌿 Enter the Git branch to push to (default: $current_branch): " git_branch
git_branch=${git_branch:-$current_branch}

# Check if branch exists
if ! git rev-parse --verify "$git_branch" >/dev/null 2>&1; then
  echo "❌ Branch '$git_branch' does not exist. Please create it first."
  exit 1
fi

read -p "🚀 Enter the remote for ghp-import (default: origin): " ghp_remote
ghp_remote=${ghp_remote:-origin}

# Warn if trying to push to main
if [ "$git_branch" = "main" ]; then
    echo "⚠️  WARNING: You are about to push to 'main'. That's dangerous!"
    read -p "Type 'confirm' to proceed or anything else to cancel: " confirm
    if [ "$confirm" != "confirm" ]; then
        echo "🛑 Cancelled push to main."
        exit 1
    fi
fi

# ──────────────────────────────────────────────────────────────
# 🪛 1. Clean and rebuild
echo "🧼 Cleaning Jupyter Book..."
jb clean . || echo "⚠️ jb clean failed (might be clean already)."

bash/bash_clean.sh 2>/dev/null || echo "ℹ️ No extended clean script found."

echo "🏗️ Building Jupyter Book..."
jb build . || { echo "❌ Jupyter Book build failed. Exiting."; exit 1; }

# 🍱 Inject extra directories
echo "📦 Copying extra folders..."
dirs=( pdfs figures media testbin nis myhtml dedication python ai r stata bash xml data aperitivo antipasto primo secondo contorno insalata formaggio-e-frutta dolce caffe digestivo ukubona )
shopt -s dotglob nullglob
for d in "${dirs[@]}"; do
  [ -d "$d" ] && mkdir -p "_build/html/$d" && cp -r "$d"/* "_build/html/$d/" 2>/dev/null
done
shopt -u dotglob nullglob

# ──────────────────────────────────────────────────────────────
# ✂️ 2. Check if _build/html actually changed
echo "🔍 Checking if _build/html has changes..."

# Create a temp branch to check if build is new
temp_branch="temp-ghp-check"
git worktree add /tmp/$temp_branch gh-pages || true
pushd /tmp/$temp_branch > /dev/null

if diff -r _build/html . > /dev/null; then
    echo "🧘 No changes in built HTML. Skipping ghp-import."
else
    echo "🚀 Changes detected in build. Deploying with ghp-import..."
    popd > /dev/null
    ghp-import -n -p -f -r "$ghp_remote" _build/html || { echo "❌ ghp-import failed."; exit 1; }
fi

# Cleanup
git worktree remove /tmp/$temp_branch --force || true
rm -rf /tmp/$temp_branch

# ──────────────────────────────────────────────────────────────
# 🦈 3. Return to Git root
echo "🧭 Returning to Git root..."
cd "$(git rev-parse --show-toplevel)" || { echo "❌ Git root not found."; exit 1; }

# 🛟 4. Plant flicks
echo "🌿 Planting flicks..."
python kitabo/ensi/python/plant_flicks_frac.py --percent 23 || echo "⚠️ Flick planting encountered issues."

# 🏝️ 5. Commit and push
echo "🧾 Staging changes..."
git add .

echo "✍️ Committing..."
if git commit -m "$commit_message"; then
    echo "⬆️ Pushing to [$git_remote/$git_branch]..."
    git push "$git_remote" "$git_branch" || echo "❌ Push failed."
else
    echo "⚠️ Nothing committed. Skipping push."
fi

