#!/usr/bin/env python3

import subprocess
import shutil
import os
import sys
from pathlib import Path
import click

def run(cmd, check=True, capture_output=False, cwd=None):
    print(f"⚙️  {cmd}")
    result = subprocess.run(cmd, shell=True, check=check, capture_output=capture_output, text=True, cwd=cwd)
    if capture_output:
        return result.stdout.strip()
    return result.returncode

def branch_exists(branch):
    try:
        run(f"git rev-parse --verify {branch}", capture_output=True)
        return True
    except subprocess.CalledProcessError:
        return False

def remote_exists(remote):
    remotes = run("git remote", capture_output=True).split()
    return remote in remotes

@click.command()
@click.option('--commit-message', prompt="📜 Enter your commit message", help="The Git commit message.")
@click.option('--git-remote', prompt="🛰️ Enter the Git remote to push to", default="origin", show_default=True, help="Git remote name.")
@click.option('--ghp-remote', prompt="🚀 Enter the remote for ghp-import", default="origin", show_default=True, help="Remote for ghp-import deployment.")
def main(commit_message, git_remote, ghp_remote):
    # Move to repo root
    os.chdir(Path(__file__).resolve().parents[1])

    # Get current branch
    current_branch = run("git rev-parse --abbrev-ref HEAD", capture_output=True).strip()
    git_branch = click.prompt("🌿 Enter the Git branch to push to", default=current_branch, show_default=True)
    # 🔥 NEW: Check for mismatch between active branch and branch to push
    if current_branch != git_branch:
        click.secho(f"⚠️  You are on branch '{current_branch}', but you are trying to push '{git_branch}'.", fg="yellow")
        proceed = click.confirm("Continue anyway?", default=False)
        if not proceed:
            click.secho("🛑 Deployment aborted to prevent wrong branch push.", fg="red")
            sys.exit(1)

    # Check local branch
    if not branch_exists(git_branch):
        click.secho(f"🌱 Local branch '{git_branch}' does not exist.", fg="yellow")
        create_branch = click.confirm(f"❓ Create and switch to '{git_branch}'?", default=True)
        if create_branch:
            run(f"git checkout -b {git_branch}")
            click.secho(f"✅ Created and switched to '{git_branch}'", fg="green")
        else:
            click.secho("🛑 Branch creation cancelled. Exiting.", fg="red")
            sys.exit(1)

    # Check remote
    if not remote_exists(git_remote):
        click.secho(f"🔗 Remote '{git_remote}' not found.", fg="yellow")
        add_remote = click.confirm(f"❓ Add remote '{git_remote}'?", default=True)
        if add_remote:
            remote_url = click.prompt("🌍 Enter remote URL (e.g. git@github.com:user/repo.git)")
            run(f"git remote add {git_remote} {remote_url}")
            click.secho(f"✅ Remote '{git_remote}' added.", fg="green")
        else:
            click.secho("🛑 Remote addition cancelled. Exiting.", fg="red")
            sys.exit(1)

    # Check remote branch
    try:
        run(f"git ls-remote --exit-code --heads {git_remote} {git_branch}", capture_output=True)
        remote_branch_exists = True
        click.secho(f"🌐 Remote branch '{git_branch}' exists on '{git_remote}'.", fg="cyan")
    except subprocess.CalledProcessError:
        remote_branch_exists = False
        click.secho(f"🆕 Remote branch '{git_branch}' does not exist on '{git_remote}'.", fg="yellow")

    # Warning when pushing to main
    if git_branch == "main":
        confirm = click.prompt("⚠️  WARNING: pushing to 'main'. Type 'confirm' to continue", default="", show_default=False)
        if confirm != "confirm":
            click.secho("🛑 Cancelled push to 'main'.", fg="red")
            sys.exit(1)

    # --- Build Section ---
    click.secho("🧼 Cleaning Jupyter Book...", fg="cyan")
    run("jb clean .")
    if os.path.exists("bash/bash_clean.sh"):
        run("bash/bash_clean.sh")

    click.secho("🏗️ Building Jupyter Book...", fg="cyan")
    run("jb build .")

    # Copy extras
    click.secho("📦 Copying extra folders...", fg="cyan")
    extras = [
        "pdfs", "figures", "media", "testbin", "nis", "myhtml", "dedication", "python", "ai",
        "r", "stata", "bash", "xml", "data", "aperitivo", "antipasto", "primo", "secondo",
        "contorno", "insalata", "formaggio-e-frutta", "dolce", "caffe", "digestivo", "ukubona"
    ]
    for d in extras:
        if os.path.isdir(d):
            dest = os.path.join("_build/html", d)
            os.makedirs(dest, exist_ok=True)
            for item in os.listdir(d):
                s = os.path.join(d, item)
                d_ = os.path.join(dest, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d_, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d_)

    # Plant flicks
    click.secho("🌿 Planting flicks...", fg="cyan")
    try:
        run("python python/plant_flicks_frac.py --percent 23")
    except Exception as e:
        click.secho(f"⚠️ Flick planting failed: {e}", fg="yellow")

    # Stage and commit
    click.secho("🧾 Staging changes...", fg="cyan")
    run("git add .")

    click.secho("✍️ Committing...", fg="cyan")
    try:
        run(f"git commit -m \"{commit_message}\"")
    except subprocess.CalledProcessError:
        click.secho("⚠️ No changes to commit.", fg="yellow")

    # Push changes
    if remote_branch_exists:
        click.secho("🔄 Fetching remote changes...", fg="cyan")
        run(f"git fetch {git_remote}")

        click.secho("🔀 Rebasing local changes...", fg="cyan")
        try:
            run(f"git rebase {git_remote}/{git_branch}")
        except subprocess.CalledProcessError:
            click.secho("⚠️ Rebase failed. Resolve conflicts manually.", fg="red")
            sys.exit(1)
    else:
        click.secho(f"📤 Pushing new branch '{git_branch}' to remote...", fg="yellow")
        run(f"git push -u {git_remote} {git_branch}")

    click.secho(f"⬆️ Pushing to {git_remote}/{git_branch}...", fg="cyan")
    run(f"git push {git_remote} {git_branch}")

    # Handle gh-pages
    click.secho("🌐 Checking for 'gh-pages' branch...", fg="cyan")
    try:
        run("git rev-parse --verify gh-pages", capture_output=True)
        click.secho("✅ 'gh-pages' branch exists.", fg="green")
    except subprocess.CalledProcessError:
        click.secho("🆕 'gh-pages' branch not found. Creating it...", fg="yellow")
        run("git checkout --orphan gh-pages")
        run("git reset --hard")
        Path(".keep").touch()
        run("git add .keep")
        run("git commit -m 'Initialize gh-pages'")
        run(f"git push {git_remote} gh-pages")
        run(f"git checkout {git_branch}")

    # Check if HTML changed
    click.secho("🔍 Checking if _build/html has changed...", fg="cyan")
    tmp_dir = "/tmp/temp-ghp-check"
    run(f"git worktree add {tmp_dir} gh-pages")
    try:
        diff = subprocess.run(["diff", "-r", "_build/html", tmp_dir], capture_output=True)
        if diff.returncode == 0:
            click.secho("🧘 No changes detected in HTML.", fg="green")
        else:
            click.secho("🚀 Deploying with ghp-import...", fg="cyan")
            run(f"ghp-import -n -p -f -r {ghp_remote} _build/html")
    finally:
        run(f"git worktree remove {tmp_dir} --force")
        shutil.rmtree(tmp_dir, ignore_errors=True)

if __name__ == "__main__":
    main()
