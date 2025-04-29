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

#!/bin/bash
jb clean . || echo "⚠️ jb clean failed (maybe nothing to clean?)"

bash/bash_clean.sh 2>/dev/null || echo "ℹ️ No extended clean script found."

echo "🏗️ Building Jupyter Book..."
jb build . || { echo "❌ Jupyter Book build failed. Aborting."; exit 1; }

# 🍱 Inject non-JupyterBook folders back into _build/html
echo "📦 Copying extra directories to _build/html/"
dirs=(
  pdfs figures media testbin nis myhtml dedication python ai r stata bash xml data
  aperitivo antipasto primo secondo contorno insalata formaggio-e-frutta dolce caffe digestivo ukubona
)
shopt -s dotglob nullglob
for d in "${dirs[@]}"; do
  if [ -d "$d" ]; then
    mkdir -p "_build/html/$d"
    cp -r "$d"/* "_build/html/$d/" 2>/dev/null
  fi
done
shopt -u dotglob nullglob

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
python kitabo/ensi/python/plant_flicks_frac.py --percent 23 || echo "⚠️ Flick planting encountered an issue."

# ──────────────────────────────────────────────────────────────
# 🏝️ 6. Commit and push
echo "🧾 Staging changes..."
git add .

echo "✍️ Committing..."
git commit -m "$commit_message" || echo "⚠️ Nothing to commit."

echo "⬆️ Pushing to origin/main..."
git push origin main || echo "❌ Push failed."

