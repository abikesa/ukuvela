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
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ukubona - Gateway to Perception</title>
  <link rel="stylesheet" href="style/main.css">
  <link rel="stylesheet" href="style/homepage.css">
</head>

<body>
  <!-- Site name ABOVE centerpiece -->
  <div id="site-name">Ukubona</div>
  <div id="site-tagline">The Gateway to Perception</div>

  <!-- Centerpiece -->
  <div id="centerpiece">
    <img src="images/ukubona-004.jpg" alt="Ukubona Globe" id="globe">
  
    <div id="topics-wrapper">
      <a href="articles/mythology.html" class="topic" style="--i:0;">Mythology</a>
      <a href="articles/theory-of-relativity.html" class="topic" style="--i:1;">Epistemology</a>
      <a href="articles/symbolic-logic.html" class="topic" style="--i:2;">Symbolism</a>
      <a href="articles/first-article.html" class="topic" style="--i:3;">Architecture</a>
      <a href="articles/theory-of-relativity.html" class="topic" style="--i:4;">Cognition</a>
      <a href="articles/your-article-title.html" class="topic" style="--i:5;">Resonance</a>
    </div>
  </div>
  

  <!-- Search bar BELOW everything -->
  <div id="search-bar">
    <input id="search-input" type="text" placeholder="Search Ukubona...">

  </div>

  <!-- Link to the search.js script -->
  <script src="js/search.js" defer></script>

  <!-- Hidden Iframes for Searchable Content (place them here) -->
  <iframe src="articles/mythology.html" style="display:none; border: 1px solid red;" id="mythology"></iframe>
  <iframe src="articles/theory-of-relativity.html" style="display:none; border: 1px solid red;" id="theory-of-relativity"></iframe>
  <iframe src="articles/symbolic-logic.html" style="display:none; border: 1px solid red;" id="symbolic-logic"></iframe>
  <iframe src="articles/first-article.html" style="display:none; border: 1px solid red;" id="first-article"></iframe>
  <iframe src="articles/your-article-title.html" style="display:none; border: 1px solid red;" id="your-article-title"></iframe>
  
  
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
