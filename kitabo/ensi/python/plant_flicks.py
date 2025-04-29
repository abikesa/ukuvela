#!/usr/bin/env python3
"""
plant_flicks.py 🌱

Performs the flick ritual:
- Walks the Git-rooted directory tree starting from shill.
- Appends symbolic graffiti to existing dotfiles or creates new ones.
- Also flicks regular files (excl. JupyterBook/sys files).
- Commits each flick individually with a unique message.
"""

import os
import random
import string
from datetime import datetime
import subprocess

# Dynamically resolve Git root from script location
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))

EXCLUDED_NAMES = {
    ".git", ".ipynb_checkpoints", "__pycache__", "_build",
    "_toc.yml", "_config.yml", ".DS_Store"
}
EXCLUDED_SUFFIXES = {".ipynb", ".png", ".jpg", ".jpeg", ".gif", ".svg"}

def random_tag():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=4))

def random_filename():
    return f".{''.join(random.choices(string.ascii_lowercase, k=random.randint(4, 8)))}"

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

def plant_flicks(base_dir):
    repo_root = find_git_root(base_dir)
    flicked = 0

    for root, dirs, files in os.walk(base_dir):
        # Skip excluded dirs
        dirs[:] = [d for d in dirs if not is_excluded(d)]

        # Folder-based flick (dotfile)
        try:
            flick_path = get_or_create_flick_path(root)
            with open(flick_path, 'a') as f:
                f.write(generate_graffiti())
            rel_path = os.path.relpath(flick_path, start=repo_root)
            git_commit(flick_path, f" {rel_path}", repo_root)
            print(f"✅ {rel_path}")
            flicked += 1
        except Exception as e:
            print(f"❌ Folder flick failed in {root}: {e}")

        # File-based flicks
        for name in files:
            if is_excluded(name) or name.startswith('.'):
                continue
            try:
                path = os.path.join(root, name)
                with open(path, 'a') as f:
                    f.write(generate_graffiti())
                rel_path = os.path.relpath(path, start=repo_root)
                git_commit(path, f" {rel_path}", repo_root)
                print(f"✅ {rel_path}")
                flicked += 1
            except Exception as e:
                print(f"❌ File flick failed: {name} – {e}")

    print(f"\n🌿 Ritual complete: {flicked} targets flicked.")

if __name__ == "__main__":
    plant_flicks(BASE_DIR)
# flick 20250409213602-JHcU
# flick 20250409214208-DGC6
# flick 20250409214624-dDPG
# flick 20250409220130-BYZK
# flick 20250409230556-Y1hQ
# flick 20250409231148-TgGz
# flick 20250410002731-4YXd
