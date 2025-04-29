#!/bin/bash

# ──────────────────────────────────────────────────────────────
# 🌊 0. Prompt the navigator
read -p "📜 Enter your commit message: " commit_message

# ──────────────────────────────────────────────────────────────
# 🚢 1. Optional: deactivate virtual environment (for legacy setups)
if [ -f "../../../myenv/bin/deactivate" ]; then
  source ../../../myenv/bin/deactivate
fi

# ──────────────────────────────────────────────────────────────
# 🪛 2. Clean and rebuild the Jupyter Book
echo "🧼 Cleaning Jupyter Book..."
jb clean .
bash/bash_clean.sh 2>/dev/null || echo "ℹ️ No extended clean script found."

echo "🏗️ Building Jupyter Book..."
jb build . || { echo "❌ Jupyter Book build failed. Aborting."; exit 1; }

# ──────────────────────────────────────────────────────────────
# ✂️ 3. Push the built book to gh-pages
echo "🚀 Deploying to gh-pages..."
ghp-import -n -p -f _build/html || { echo "❌ ghp-import failed. Aborting."; exit 1; }

# ──────────────────────────────────────────────────────────────
# 🦈 4. Return to Git root
echo "🧭 Returning to Git root..."
cd "$(git rev-parse --show-toplevel)" || { echo "❌ Git root not found. Exiting."; exit 1; }

# ──────────────────────────────────────────────────────────────
# 🛟 5. Plant flicks: the graffiti of discernment
echo "🌿 Planting flicks..."
python kitabo/ensi/python/plant_flicks.py || echo "⚠️ Flick planting encountered an issue."

# ──────────────────────────────────────────────────────────────
# 🏝️ 6. Commit and push
echo "🧾 Staging changes..."
git add .

echo "✍️ Committing..."
git commit -m "$commit_message" || echo "⚠️ Nothing to commit."

echo "⬆️ Pushing to origin/main..."
git push origin main || echo "❌ Push failed."
# flick 20250409213603-LCbj
# flick 20250409214209-dRV9
# flick 20250409214625-9y2W
# flick 20250409230604-mnQ4
# flick 20250409231149-83Ak
# flick 20250409234307-9IYJ
