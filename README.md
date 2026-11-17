# VOIDKAGE — Desktop Companions

<div align="center">

![VOIDKAGE Banner](src/renderer/assets/icons/icon-64.png)

### **KAGE & KAGE-CHAN**
**Living Interactive Chibi Companions for Windows 10 & Windows 11**

*Black × Blood Red × White | 100% Offline | Zero Configuration Required*

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-ff1a2b.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-white.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-33.2-black.svg)](#)
[![SQLite](https://img.shields.io/badge/SQLite-Embedded-red.svg)](#)

</div>

---

## ✦ Overview

**VOIDKAGE Desktop Companions** brings two independent, interactive chibi desktop pets directly onto your Windows desktop:

1. **KAGE — The Shadow Pet**: A mischievous little shadow creature with glowing blood-red eyes, twitched horns, and a swishing tail. Curious, funny, lazy, and playful.
2. **KAGE-CHAN — Companion Chibi**: A cute anime girl companion with long dark hair, crimson highlights, and gothic attire. Caring, supportive, teasing, and slightly tsundere.

Both characters stay visible on your desktop above ordinary windows (browsers, games, VS Code, File Explorer), float and bob naturally, react to mouse interactions, talk to you and to each other, and adapt to your workflow.

---

## ✦ Key Features

- **Living Desktop Companions**:
  - Transparent backgrounds with no rectangular window borders.
  - Always-on-top positioning with smooth drag-and-drop mouse physics.
  - Saved positions, individual show/hide controls, and customizable scale (60% to 180%).
- **Layered Vector Animation Engine**:
  - 13 distinct animation states for both characters:
    `Idle`, `Happy`, `Sad`, `Curious`, `Angry`, `Sleepy`, `Surprised`, `Excited`, `Walking`, `Sitting`, `Sleeping`, `Talking`, `Teasing`.
  - Dynamic micro-animations: eye blinking, pupil dilation, hair swaying physics, breathing bob, ear twitching, and expressive emote badges (hearts, sweatdrops, question marks, anger marks, stars, Zzz).
- **Personality & Mood Engine**:
  - Contextual dialogue based on mood, time of day (morning, afternoon, late-night), and interaction history.
  - Cooldown-managed dialogue selection to eliminate annoying repetitions.
  - Autonomous inter-character banter where Kage and Kage-Chan talk and play with each other.
- **Four Desktop Operating Modes**:
  - **Normal**: Balanced conversation and cheerful idle animations.
  - **Focus**: Rare, supportive breaks reminding you to hydrate and stretch.
  - **Active**: High-energy antics, frequent banter, and playful tricks.
  - **Quiet**: Pure silent companion mode with zero chatter.
- **VOIDKAGE Control Center (10 Dashboard Sections)**:
  - Dashboard (real-time telemetry, affection & energy bars)
  - Characters (toggle visibility, sizing, opacity)
  - Appearance (crimson glow aura, bubble themes)
  - Personality (affection growth rate, mischief factor)
  - Mood Settings (instant expression triggers)
  - Interaction Settings (interval sliders, cross-banter toggles)
  - Audio Settings (Web Audio synthesizer volume, pitch, test cues)
  - Startup Settings (Windows login auto-launch)
  - Privacy (local SQLite memory verification & log viewer)
  - About VOIDKAGE (credits, design specifications)
- **Local SQLite Persistence**:
  - Stored in `%APPDATA%\voidkage-companions\voidkage.sqlite`.
  - 100% offline, zero internet telemetry or tracking.
- **Web Audio Procedural Synthesizer**:
  - Built-in real-time audio synthesis: gentle blips, warm purrs, cheerful chimes, and lullabies with zero missing external audio files.
- **Permanent Windows Startup**:
  - Runs quietly in the background on Windows boot without opening setup windows.
  - Restores characters directly to their previously saved coordinates.

---

## ✦ Installation & Download (End Users)

> **No Node.js, Python, or programming tools required!**

### Option A: Portable Version (ZIP)
1. Download **`VOIDKAGE-Portable-x64.zip`** from the GitHub Releases page.
2. Right-click the ZIP file and select **Extract All...**.
3. Open the extracted folder and double-click **`VOIDKAGE.exe`**.
4. Both characters will appear on your desktop!

### Option B: Windows Installer (.exe)
1. Download **`VOIDKAGE-Setup-1.0.0.exe`**.
2. Run the installer to create Desktop and Start Menu shortcuts.
3. Check "Launch VOIDKAGE" and finish.

---

## ✦ Mouse & Desktop Controls

| Action | Control | Result |
| :--- | :--- | :--- |
| **Move Companion** | Click & Drag Character Body | Repositions character anywhere across your monitors |
| **Open Menu** | Click Character Once | Opens radial interaction menu |
| **Talk** | Click `[💬]` | Companion chats with contextual dialogue |
| **Pet** | Click `[🐾]` / `[🌸]` | Pet your companion (increases affection) |
| **Play** | Click `[⚡]` / `[✨]` | Playful game / trick (consumes energy) |
| **Ask Question** | Click `[❓]` | Inquisitive thought or reflection |
| **Rest / Sleep** | Click `[💤]` | Puts character into nap mode |
| **Dashboard** | Click `[⚙️]` or Tray Icon | Opens VOIDKAGE Control Center |
| **Reset Positions** | Right-click Tray -> "Reset Positions" | Restores companions to bottom-right desktop corner |

---

## ✦ Developer Setup (Building From Source)

If you wish to modify or build VOIDKAGE from source:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- npm (v9 or newer)
- Windows 10 or Windows 11 (64-bit)

### Clone & Install
```bash
git clone https://github.com/voidkage/desktop-companions.git
cd desktop-companions
npm install
```

### Run in Development
```bash
npm start
```

### Run Automated Tests
```bash
npm test
```

### Package for Windows (Installer & Portable)
```bash
npm run dist
```
Build artifacts will be generated in the `dist/` directory:
- `dist/VOIDKAGE-Setup-1.0.0.exe` (NSIS Installer)
- `dist/VOIDKAGE-Portable-x64.zip` (Portable ZIP package)

---

## ✦ Architecture Overview

```
src/
├── main/
│   ├── database/
│   │   └── db.js                 # SQLite3 WebAssembly engine & tables
│   ├── engine/
│   │   ├── dialogueDatabase.js   # Character dialogue trees & cross-banter
│   │   ├── personalityEngine.js  # Mood state machine & affection logic
│   │   ├── relationshipEngine.js # Inter-companion synchronization
│   │   └── autonomousEngine.js   # Autonomous timers & mode enforcement
│   ├── preload/
│   │   ├── companionPreload.js   # Isolated IPC bridge for companion windows
│   │   └── settingsPreload.js    # Isolated IPC bridge for settings dashboard
│   ├── windows/
│   │   ├── companionWindow.js    # Transparent frameless always-on-top window
│   │   ├── settingsWindow.js     # VOIDKAGE 10-tab dashboard window
│   │   └── welcomeWindow.js      # First-launch setup wizard
│   └── index.js                  # Main process & single-instance manager
└── renderer/
    ├── assets/
    │   └── icons/                # High-res VOIDKAGE icons & tray assets
    ├── characters/
    │   ├── kage/                 # Kage character view, avatar SVG, CSS & JS
    │   └── kage-chan/            # Kage-chan view, avatar SVG, CSS & JS
    ├── settings/                 # VOIDKAGE Control Center view & controller
    ├── welcome/                  # First-launch onboarding view & controller
    └── shared/
        ├── audio/                # Web Audio API procedural sound synthesizer
        └── styles/               # VOIDKAGE black & blood-red theme CSS
```

---

## ✦ License

This project is licensed under the [MIT License](LICENSE) — free for personal and open-source use.
Distributed by **VOIDKAGE**.
