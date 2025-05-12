from PIL import Image, ImageDraw

# Create a blank canvas
size = 600
img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Example: Draw a perfect white circle (symbolic placeholder)
circle_radius = 240
center = size // 2
draw.ellipse(
    (center - circle_radius, center - circle_radius, center + circle_radius, center + circle_radius),
    fill=(255, 255, 255, 255)
)

# Add a symbolic arc, text, or layered glyph if desired here...

# Save it
img.save("ukubona-light-generated.png")
