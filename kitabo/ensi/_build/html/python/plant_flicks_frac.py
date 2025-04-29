#!/usr/bin/env python3
"""
plant_flicks_frac.py 🌱

Performs the flick ritual:
- Walks the Git-rooted directory tree starting from shill.
- Appends symbolic graffiti to existing dotfiles or creates new ones.
- Flicks regular files too (excluding critical JupyterBook/sys files).
- Commits each flick individually with a unique message.
- Supports --percent for random subset flicking.
"""

import os
import random
import string
from datetime import datetime
import subprocess
import argparse

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))

EXCLUDED_NAMES = {
    ".git", ".ipynb_checkpoints", "__pycache__", "_build",
    "_toc.yml", "_config.yml", ".DS_Store", "README"
}
EXCLUDED_SUFFIXES = {".ipynb", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".html", ".sh", ".py", ".txt", ".bib", ".csv", ".js", ".css", "ico"}

def random_tag():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=4))

def reverse_or_scramble(base):
    if random.random() < 0.5:
        return base[::-1]
    else:
        chars = list(base)
        random.shuffle(chars)
        return ''.join(chars)

def random_filename():
    base = ''.join(random.choices(string.ascii_lowercase, k=random.randint(4, 8)))
    twisted = reverse_or_scramble(base)
    return f".{twisted}"

def generate_graffiti():
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    tag = random_tag()
    return f"# flick {timestamp}-{tag}\n"

def find_git_root(start_path):
    current = os.path.abspath(start_path)
    while current != "/":
        if os.path.isdir(os.path.join(current, ".git")):
            return current
        current = os.path.dirname(current)
    raise RuntimeError("❌ Git root not found.")

def is_excluded(name):
    return (
        name in EXCLUDED_NAMES
        or any(name.endswith(suffix) for suffix in EXCLUDED_SUFFIXES)
    )

def get_or_create_flick_path(folder):
    existing = [f for f in os.listdir(folder) if f.startswith('.') and not f.startswith('..')]
    flicks = [f for f in existing if os.path.isfile(os.path.join(folder, f))]
    if flicks:
        return os.path.join(folder, random.choice(flicks))  # Append to existing
    else:
        return os.path.join(folder, random_filename())      # Create new

def git_commit(file_path, message, repo_root):
    try:
        subprocess.run(["git", "add", file_path], cwd=repo_root, check=True)
        subprocess.run(["git", "commit", "-m", message], cwd=repo_root, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Git commit failed for {file_path}: {e}")

def plant_flicks(base_dir, percent=100):
    repo_root = find_git_root(base_dir)
    all_targets = []

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if not is_excluded(d)]
        all_targets.append(("folder", root))

        for name in files:
            if is_excluded(name) or name.startswith('.'):
                continue
            all_targets.append(("file", os.path.join(root, name)))

    if not all_targets:
        print("⚠️ No flickable targets found.")
        return

    sample_size = max(1, int(len(all_targets) * percent / 100))
    chosen_targets = random.sample(all_targets, sample_size)

    flicked = 0
    for kind, path in chosen_targets:
        try:
            if kind == "folder":
                flick_path = get_or_create_flick_path(path)
            else:
                flick_path = path

            with open(flick_path, 'a') as f:
                f.write(generate_graffiti())

            rel_path = os.path.relpath(flick_path, start=repo_root)
            git_commit(flick_path, f" {rel_path}", repo_root)
            print(f"✅ {rel_path}")
            flicked += 1
        except Exception as e:
            print(f"❌ Flick failed: {path} – {e}")

    print(f"\n🌿 Ritual complete: {flicked} of {len(all_targets)} potential targets flicked.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="🌱 Perform flick ritual on a random % of the tree")
    parser.add_argument("--percent", type=int, default=100,
                        help="Random % of folders/files to flick (default: 100)")
    args = parser.parse_args()
    plant_flicks(BASE_DIR, percent=args.percent)
    