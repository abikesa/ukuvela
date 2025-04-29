import os

# --- Define structure ---
folders = [
    "style",
    "js",
    "images"
]

files = {
    "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Main Page - MyWiki</title>
  <link rel="stylesheet" href="style/main.css">
  <link rel="stylesheet" href="style/darkmode.css">
  <script src="js/toggle-darkmode.js" defer></script>
</head>
<body>
<header id="top-header">
  <h1>MyWiki</h1>
  <nav>
    <a href="index.html">Main Page</a> |
    <a href="first-article.html">First Article</a> |
    <a href="#" onclick="toggleDarkMode()">Toggle Dark Mode</a>
  </nav>
</header>

<main id="content">
  <h2>Welcome to MyWiki</h2>
  <p>This is a placeholder for your landing page content.</p>
</main>

<footer id="bottom-footer">
  <hr>
  <p>Last updated: April 2025 | Powered by MyWiki</p>
</footer>
</body>
</html>
""",

    "first-article.html": """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>First Article - MyWiki</title>
  <link rel="stylesheet" href="style/main.css">
  <link rel="stylesheet" href="style/darkmode.css">
  <script src="js/toggle-darkmode.js" defer></script>
</head>
<body>
<header id="top-header">
  <h1>First Article</h1>
  <nav>
    <a href="index.html">Main Page</a> |
    <a href="#" onclick="toggleDarkMode()">Toggle Dark Mode</a>
  </nav>
</header>

<main id="content">
  <h2>Introduction</h2>
  <p>This is a placeholder for your first article content.</p>
</main>

<footer id="bottom-footer">
  <hr>
  <p>Last updated: April 2025 | Powered by MyWiki</p>
</footer>
</body>
</html>
""",

    "style/main.css": """/* Main CSS for MyWiki */
body {
    font-family: "Linux Libertine", "Georgia", serif;
    background-color: #f8f9fa;
    color: #202122;
    margin: 0;
    padding: 0;
}

#top-header, #bottom-footer {
    background-color: #ffffff;
    padding: 1rem;
    text-align: center;
}

#content {
    max-width: 960px;
    margin: 2rem auto;
    padding: 1rem;
    background-color: #ffffff;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
}

header nav a {
    color: #0645ad;
    text-decoration: none;
    margin: 0 10px;
}

header nav a:hover {
    text-decoration: underline;
}

h1, h2, h3 {
    font-weight: normal;
    color: #000;
}

a {
    color: #0645ad;
}
""",

    "style/darkmode.css": """/* Dark Mode CSS for MyWiki */
body.darkmode {
    background-color: #121212;
    color: #e0e0e0;
}

#content.darkmode {
    background-color: #1e1e1e;
}

#top-header.darkmode, #bottom-footer.darkmode {
    background-color: #1e1e1e;
}

a.darkmode {
    color: #8ab4f8;
}
""",

    "js/toggle-darkmode.js": """// JavaScript to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("darkmode");
    document.getElementById('content').classList.toggle("darkmode");
    document.getElementById('top-header').classList.toggle("darkmode");
    document.getElementById('bottom-footer').classList.toggle("darkmode");
}
""",

    "README.md": """# MyWiki
A private, minimalist encyclopedia inspired by Wikipedia.
Built for personal use and 100% fidelity to the Wikipedia aesthetic.
""",

    "favicon.ico": ""  # Empty file for now
}

# --- Create folders ---
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# --- Create files ---
for filepath, content in files.items():
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# --- Create placeholder image ---
with open("images/placeholder.png", "wb") as f:
    f.write(b"")

print("✅ Wiki repo structure and starter content generated successfully!")
