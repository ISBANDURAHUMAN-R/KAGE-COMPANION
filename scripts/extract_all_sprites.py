import os
from PIL import Image
import numpy as np
from collections import deque

def extract_cell(img_arr, box, threshold=15):
    x0, y0, x1, y1 = box
    cell = img_arr[y0:y1, x0:x1].copy()
    ch, cw, _ = cell.shape
    
    rgba = np.zeros((ch, cw, 4), dtype=np.uint8)
    rgba[:, :, :3] = cell
    rgba[:, :, 3] = 255
    
    visited = np.zeros((ch, cw), dtype=bool)
    queue = deque()
    
    # Enqueue borders
    for x in range(cw):
        queue.append((x, 0))
        queue.append((x, ch - 1))
    for y in range(ch):
        queue.append((0, y))
        queue.append((cw - 1, y))
        
    for x, y in queue:
        visited[y, x] = True
        
    while queue:
        x, y = queue.popleft()
        r, g, b = int(cell[y, x, 0]), int(cell[y, x, 1]), int(cell[y, x, 2])
        brightness = max(r, g, b)
        
        if brightness <= threshold:
            rgba[y, x, 3] = 0
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < cw and 0 <= ny < ch and not visited[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((nx, ny))
        elif brightness < threshold + 35 and (r > g + 8 or r > b + 8):
            # Soft red glow boundary
            alpha = int(255.0 * (brightness - threshold) / 35.0)
            rgba[y, x, 3] = min(rgba[y, x, 3], alpha)
            
    # Auto-crop non-zero alpha with 2px padding
    alpha = rgba[:, :, 3]
    y_idx, x_idx = np.where(alpha > 0)
    if len(y_idx) > 0 and len(x_idx) > 0:
        min_x = max(0, np.min(x_idx) - 2)
        min_y = max(0, np.min(y_idx) - 2)
        max_x = min(cw, np.max(x_idx) + 3)
        max_y = min(ch, np.max(y_idx) + 3)
        rgba = rgba[min_y:max_y, min_x:max_x]
        
    return Image.fromarray(rgba, "RGBA")

base_path = r"C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\.user_uploaded"
kage_dest = r"src\renderer\characters\kage\assets"
chan_dest = r"src\renderer\characters\kage-chan\assets"
os.makedirs(kage_dest, exist_ok=True)
os.makedirs(chan_dest, exist_ok=True)

# ----------------- 1. PROCESS KAGE (4x7) -----------------
print("Processing KAGE sprites...")
kage_img = Image.open(f"{base_path}\\media_1795013180870_1f12438d.jpg").convert("RGB")
kage_arr = np.array(kage_img)

kage_row_bounds = [(0, 165), (165, 316), (316, 488), (488, 682)]
kage_col_divs = [
    [0, 148, 306, 450, 602, 751, 883, 1024],
    [0, 153, 297, 432, 594, 738, 875, 1024],
    [0, 142, 288, 440, 590, 748, 891, 1024],
    [0, 150, 295, 435, 582, 739, 877, 1024]
]

kage_names = [
    # Row 0
    ['state-idle', 'state-happy', 'state-excited', 'state-blushing', 'state-surprised', 'state-curious', 'state-angry'],
    # Row 1
    ['state-sad', 'state-crying', 'state-sleepy', 'state-sleeping', 'state-bored', 'state-teasing', 'state-sunglasses'],
    # Row 2
    ['state-snack', 'state-coffee', 'state-coding', 'state-gaming', 'state-music', 'state-thinking', 'state-idea'],
    # Row 3
    ['state-hacking', 'state-demon', 'state-shield', 'state-fireball', 'state-love', 'state-scared', 'state-walking']
]

for r in range(4):
    y0, y1 = kage_row_bounds[r]
    divs = kage_col_divs[r]
    for c in range(7):
        x0, x1 = divs[c], divs[c+1]
        name = kage_names[r][c]
        sprite = extract_cell(kage_arr, (x0, y0, x1, y1))
        out_path = os.path.join(kage_dest, f"{name}.png")
        sprite.save(out_path)
        print(f"  KAGE -> {name}.png ({sprite.size})")
        if name == 'state-idle':
            sprite.save(os.path.join(kage_dest, "kage-main.png"))
            print(f"  KAGE -> kage-main.png ({sprite.size})")

# ----------------- 2. PROCESS KAGE-CHAN POSES (3x5) -----------------
print("\nProcessing KAGE-CHAN Poses...")
chan_poses_img = Image.open(f"{base_path}\\media_1795012792559_e0314f4d.jpg").convert("RGB")
chan_poses_arr = np.array(chan_poses_img)

chan_row_bounds = [(0, 236), (236, 453), (453, 682)]
chan_col_divs = [
    [0, 223, 418, 607, 800, 1024],
    [0, 215, 415, 600, 818, 1024],
    [0, 211, 400, 600, 815, 1024]
]

chan_pose_names = [
    # Row 0
    ['state-idle', 'state-happy', 'state-blushing', 'state-angry', 'state-surprised'],
    # Row 1
    ['state-coding', 'state-gaming', 'state-coffee', 'state-sleeping', 'state-walking'],
    # Row 2
    ['state-excited', 'state-teasing', 'state-sleepy', 'state-shocked', 'state-angry-mode']
]

for r in range(3):
    y0, y1 = chan_row_bounds[r]
    divs = chan_col_divs[r]
    for c in range(5):
        x0, x1 = divs[c], divs[c+1]
        name = chan_pose_names[r][c]
        sprite = extract_cell(chan_poses_arr, (x0, y0, x1, y1))
        out_path = os.path.join(chan_dest, f"{name}.png")
        sprite.save(out_path)
        print(f"  KAGE-CHAN -> {name}.png ({sprite.size})")
        if name == 'state-idle':
            sprite.save(os.path.join(chan_dest, "kage-chan-main.png"))
            print(f"  KAGE-CHAN -> kage-chan-main.png ({sprite.size})")

# ----------------- 3. PROCESS KAGE-CHAN EXPRESSIONS (Selected) -----------------
print("\nProcessing KAGE-CHAN Extra Expressions...")
chan_expr_img = Image.open(f"{base_path}\\media_1795012761207_8ce17804.jpg").convert("RGB")
chan_expr_arr = np.array(chan_expr_img)

# Row 1: Col 4 -> sad / crying, Col 5 -> sunglasses, Col 6 -> curious
# Row 2: Col 0 -> love / heart, Col 5 -> music
y0, y1 = 173, 337
divs_r1 = [0, 151, 282, 448, 596, 746, 889, 1024]
# sad
sprite_sad = extract_cell(chan_expr_arr, (divs_r1[4], y0, divs_r1[5], y1))
sprite_sad.save(os.path.join(chan_dest, "state-sad.png"))
print(f"  KAGE-CHAN -> state-sad.png ({sprite_sad.size})")

# sunglasses
sprite_shades = extract_cell(chan_expr_arr, (divs_r1[5], y0, divs_r1[6], y1))
sprite_shades.save(os.path.join(chan_dest, "state-sunglasses.png"))
print(f"  KAGE-CHAN -> state-sunglasses.png ({sprite_shades.size})")

# curious
sprite_curious = extract_cell(chan_expr_arr, (divs_r1[6], y0, divs_r1[7], y1))
sprite_curious.save(os.path.join(chan_dest, "state-curious.png"))
print(f"  KAGE-CHAN -> state-curious.png ({sprite_curious.size})")

# Row 2
y0, y1 = 337, 501
divs_r2 = [0, 151, 296, 435, 590, 735, 881, 1024]
# love
sprite_love = extract_cell(chan_expr_arr, (divs_r2[0], y0, divs_r2[1], y1))
sprite_love.save(os.path.join(chan_dest, "state-love.png"))
print(f"  KAGE-CHAN -> state-love.png ({sprite_love.size})")

# music
sprite_music = extract_cell(chan_expr_arr, (divs_r2[5], y0, divs_r2[6], y1))
sprite_music.save(os.path.join(chan_dest, "state-music.png"))
print(f"  KAGE-CHAN -> state-music.png ({sprite_music.size})")

print("\n=== ALL SPRITES EXTRACTED SUCCESSFULLY! ===")
