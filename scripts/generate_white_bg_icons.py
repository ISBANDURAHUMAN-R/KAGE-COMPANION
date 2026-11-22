import os
from PIL import Image
import numpy as np

img_path = r"C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\.user_uploaded\media_1795018782415_a76b41c5.jpg"
img = Image.open(img_path).convert("RGB")
arr = np.array(img)
h, w, _ = arr.shape

# Find non-white content bounding box
# Non-white is where min(R,G,B) < 240
non_white_y, non_white_x = np.where(np.min(arr, axis=2) < 240)
min_x, max_x = np.min(non_white_x), np.max(non_white_x)
min_y, max_y = np.min(non_white_y), np.max(non_white_y)

print(f"Content bbox: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
content_w = max_x - min_x
content_h = max_y - min_y
print(f"Content size: {content_w}x{content_h}")

# Crop content with 20px margin of white
margin = 25
crop_x0 = max(0, min_x - margin)
crop_y0 = max(0, min_y - margin)
crop_x1 = min(w, max_x + margin)
crop_y1 = min(h, max_y + margin)

cropped = img.crop((crop_x0, crop_y0, crop_x1, crop_y1))

# Create a clean square canvas with WHITE background
cw, ch = cropped.size
max_side = max(cw, ch)
square_canvas = Image.new("RGB", (max_side, max_side), (255, 255, 255))
paste_x = (max_side - cw) // 2
paste_y = (max_side - ch) // 2
square_canvas.paste(cropped, (paste_x, paste_y))

# Resize to standard high-res 512x512 icon
icon_512 = square_canvas.resize((512, 512), Image.Resampling.LANCZOS)

dest_dir = r"src\renderer\assets\icons"
os.makedirs(dest_dir, exist_ok=True)
os.makedirs("build", exist_ok=True)

# Save icon.png
icon_512.save(os.path.join(dest_dir, "icon.png"), "PNG")
# Save logo.png
square_canvas.save(os.path.join(dest_dir, "logo.png"), "PNG")

# Generate Windows multi-resolution ICO (256, 128, 64, 48, 32, 16) with white background
ico_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
icon_512.save("build/icon.ico", format="ICO", sizes=ico_sizes)
icon_512.save(os.path.join(dest_dir, "icon.ico"), format="ICO", sizes=ico_sizes)

# Save tray icon
tray_icon = square_canvas.resize((32, 32), Image.Resampling.LANCZOS)
tray_icon.save(os.path.join(dest_dir, "tray-icon.png"), "PNG")
tray_icon.save(os.path.join(dest_dir, "tray-icon.ico"), format="ICO", sizes=[(32, 32), (16, 16)])

print("White-background official KAGE COMPANION icons generated successfully!")
