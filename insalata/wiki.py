import os
import sys

# --- Settings ---
WIKI_DIR = "."  # Current directory
INDEX_FILE = "index.html"
STYLE_DIR = "style"
JS_DIR = "js"
IMAGES_DIR = "images"

# --- HTML Template for New Article ---
ARTICLE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title} - MyWiki</title>
  <link rel="stylesheet" href="style/main.css">
  <link rel="stylesheet" href="style/darkmode.css">
  <script src="js/toggle-darkmode.js" defer></script>
</head>
<body>
<header id="top-header">
  <h1>{title}</h1>
  <nav>
    <a href="index.html">Main Page</a> |
    <a href="#" onclick="toggleDarkMode()">Toggle Dark Mode</a>
  </nav>
</header>

<main id="content">
  <h2>Introduction</h2>
  <p>Content placeholder for {title}.</p>

  <h2>Background</h2>
  <p>More placeholder text.</p>

  <h2>See Also</h2>
  <ul>
    <li><a href="index.html">Return to Main Page</a></li>
  </ul>
</main>

<footer id="bottom-footer">
  <hr>
  <p>Last updated: April 2025 | Powered by MyWiki</p>
</footer>
</body>
</html>
"""

# --- Helper Functions ---

def slugify(title):
    """Convert title into a filename-friendly slug."""
    return title.strip().lower().replace(" ", "-").replace("'", "").replace('"', '')

def create_article(title):
    """Create a new article HTML file with the given title."""
    slug = slugify(title)
    filename = f"{slug}.html"
    filepath = os.path.join(WIKI_DIR, filename)
    
    if os.path.exists(filepath):
        print(f"❌ Error: {filename} already exists.")
        return

    # Create the article
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(ARTICLE_TEMPLATE.format(title=title))

    print(f"✅ Created new article: {filepath}")

    # After creating the article, update TOC
    update_index(title, filename)

def update_index(title, filename):
    """Insert a link to the new article into index.html if not already present."""
    if not os.path.exists(INDEX_FILE):
        print(f"⚠️ Warning: {INDEX_FILE} not found. Skipping TOC update.")
        return

    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    toc_start = None
    toc_end = None

    # Find where the <ul> for navigation exists
    for i, line in enumerate(lines):
        if "<ul>" in line and toc_start is None:
            toc_start = i
        if "</ul>" in line and toc_start is not None:
            toc_end = i
            break

    if toc_start is None or toc_end is None:
        print("⚠️ Warning: Could not find TOC in index.html.")
        return

    # Check if link already exists
    new_link = f'    <li><a href="{filename}">{title}</a></li>\n'
    if new_link in lines[toc_start:toc_end]:
        print("ℹ️ Link already exists in TOC.")
        return

    # Insert new link just before </ul>
    lines.insert(toc_end, new_link)

    # Rewrite the file
    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.writelines(lines)

    print(f"✅ Added link to {filename} in {INDEX_FILE}")

def show_help():
    print("Wiki CLI Usage:")
    print("  python3 wiki.py create \"Article Title\"")
    print("Example:")
    print("  python3 wiki.py create \"Theory of Relativity\"")

# --- Main CLI Execution ---

if __name__ == "__main__":
    if len(sys.argv) < 3:
        show_help()
        sys.exit(1)
    
    command = sys.argv[1]
    if command == "create":
        title = " ".join(sys.argv[2:])
        create_article(title)
    else:
        show_help()
