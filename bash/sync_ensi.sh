#!/bin/bash

set -euo pipefail

echo "🚧 Cleaning peer-review/, preserving kitabo/ensi (no overwrites)..."

# Step 1: Move kitabo/ensi to a temp location
mkdir -p temp_preserve
cp -a peer-review/kitabo/ensi temp_preserve/ensi

# Step 2: Delete everything else in peer-review/
rm -rf peer-review/*
mkdir -p peer-review/kitabo

# Step 3: Copy everything from hologram/ to peer-review/ EXCEPT kitabo/ensi
rsync -a --exclude 'kitabo/ensi/' hologram/ peer-review/

# Step 4: Restore preserved ensi
cp -a temp_preserve/ensi peer-review/kitabo/

# Step 5: Add *only* new files/dirs from hologram/kitabo/ensi
echo "📁 Merging new files into peer-review/kitabo/ensi (no overwrites)..."
find hologram/kitabo/ensi -mindepth 1 -print0 | while IFS= read -r -d '' src_path; do
    rel_path="${src_path#hologram/kitabo/ensi/}"
    dest_path="peer-review/kitabo/ensi/${rel_path}"
    if [ ! -e "$dest_path" ]; then
        if [ -d "$src_path" ]; then
            mkdir -p "$dest_path"
            echo "📂 New dir: $rel_path"
        else
            mkdir -p "$(dirname "$dest_path")"
            cp -a "$src_path" "$dest_path"
            echo "📄 New file: $rel_path"
        fi
    fi
done

# Step 6: Clean up
rm -rf temp_preserve

echo "✅ Done. All preexisting ensi files preserved. Only new files added."
