import os
from PIL import Image
import numpy as np

# Load transparent logo
logo_path = "scripts/test_logo_trans.png"
logo = Image.open(logo_path).convert("RGBA")
lw, lh = logo.size

# 1. Save full transparent logo
dest_icons = r"src\renderer\assets\icons"
os.makedirs(dest_icons, exist_ok=True)
os.makedirs("build", exist_ok=True)

logo.save(os.path.join(dest_icons, "logo.png"))
print(f"Saved logo.png: {logo.size}")

# 2. Create square icon canvas (padded and centered)
# We make a 512x512 square canvas
canvas_size = 512
# Pad by 6% on each side for nice icon framing
max_dim = int(canvas_size * 0.90)

scale = min(max_dim / lw, max_dim / lh)
new_w = int(lw * scale)
new_h = int(lh * scale)

resized_logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Center on transparent square canvas
square_icon = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
paste_x = (canvas_size - new_w) // 2
paste_y = (canvas_size - new_h) // 2
square_icon.paste(resized_logo, (paste_x, paste_y), resized_logo)

# Save high-res PNG icon
square_icon.save(os.path.join(dest_icons, "icon.png"))
print("Saved icon.png: 512x512")

# Save 64x64 PNG
icon_64 = square_icon.resize((64, 64), Image.Resampling.LANCZOS)
icon_64.save(os.path.join(dest_icons, "icon-64.png"))
print("Saved icon-64.png: 64x64")

# 3. Create Windows multi-resolution ICO files
# Standard Windows icon sizes: 256, 128, 64, 48, 32, 16
ico_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]

# Save to build/icon.ico (for electron-builder)
square_icon.save("build/icon.ico", format="ICO", sizes=ico_sizes)
print("Saved build/icon.ico (256, 128, 64, 48, 32, 16)")

# Save to src/renderer/assets/icons/icon.ico (for BrowserWindow)
square_icon.save(os.path.join(dest_icons, "icon.ico"), format="ICO", sizes=ico_sizes)
print("Saved src/renderer/assets/icons/icon.ico")

# 4. Create Tray Icons
# For Windows tray: a crisp 32x32 and 16x16 icon
tray_icon_32 = square_icon.resize((32, 32), Image.Resampling.LANCZOS)
tray_icon_32.save(os.path.join(dest_icons, "tray-icon.png"))
tray_icon_32.save(os.path.join(dest_icons, "tray-icon.ico"), format="ICO", sizes=[(32, 32), (16, 16)])
print("Saved tray-icon.png and tray-icon.ico")

print("\n=== ALL APP ICONS GENERATED SUCCESSFULLY! ===")
