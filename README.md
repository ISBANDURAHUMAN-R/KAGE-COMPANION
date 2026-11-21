# KAGE COMPANION — Desktop Companions

**Created, Developed & Owned by Isbandu Rahuman R.**

All rights reserved to **Isbandu Rahuman R.**

- **Founder & Creator:** Isbandu Rahuman R.
- **Developer:** Isbandu Rahuman R.
- **Project Owner:** Isbandu Rahuman R.
- **Concept & Product Design:** Isbandu Rahuman R.
- **Application Development:** Isbandu Rahuman R.

*KAGE Companion is an independently developed personal companion application created by Isbandu Rahuman R.*  
*Official Ownership: Isbandu Rahuman R.*

---

<div align="center">

![KAGE Companion Banner](src/renderer/assets/icons/icon-64.png)

### **KAGE & KAGE-CHAN**
**Living Interactive Chibi Companions for Windows 10 & Windows 11**

*Created & Developed by Isbandu Rahuman R.*  
*Black × Blood Red × White | 100% Offline | Zero Configuration Required*

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-ff1a2b.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-white.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-33.2-black.svg)](#)
[![SQLite](https://img.shields.io/badge/SQLite-Embedded-red.svg)](#)

</div>

---

## ✦ Overview

**KAGE COMPANION Desktop Pets** brings two independent, interactive chibi desktop pets directly onto your Windows desktop:

1. **KAGE — The Shadow Pet**: A mischievous little shadow creature with glowing blood-red eyes, twitched horns, and a swishing tail. Curious, funny, lazy, and playful.
2. **KAGE-CHAN — Companion Chibi**: A cute anime girl companion with long dark hair, crimson highlights, and gothic attire. Caring, supportive, teasing, and slightly tsundere.

Both characters stay visible on your desktop above ordinary windows (browsers, games, VS Code, File Explorer), float and bob naturally, react to mouse interactions, cycle through authentic expressive poses on click, and quietly accompany your daily workflow.

---

## ✦ Key Features

- **Living Desktop Companions**:
  - Transparent backgrounds with no rectangular window borders.
  - Always-on-top positioning with smooth drag-and-drop mouse physics.
  - Saved positions, individual show/hide controls, and customizable scale (60% to 180%).
- **Expressive Character States**:
  - 15 authentic poses and expressions for both characters:
    `Idle`, `Happy`, `Sad`, `Curious`, `Angry`, `Sleepy`, `Surprised`, `Excited`, `Walking`, `Sleeping`, `Gaming`, `Coding`, `Coffee`, `Music`, `Love`, etc.
  - Clean vector radial menus (Pet, Play, Sleep, Settings, Close) for quick companion interactions.
  - Silent companion design: subtle idle animations with zero intrusive popups or unwanted chatter.
- **KAGE COMPANION Settings (Clean 5-Tab Interface)**:
  - **Companions**: Real-time previews, individual toggle switches, scaling slider (60%–180%), and position reset controls.
  - **Behavior**: Motion interval timing, silent desktop mode options, and companion responsiveness.
  - **Audio**: Procedural Web Audio synthesizer toggle, master volume, and pitch controls.
  - **Startup & Privacy**: Windows boot auto-launch, 100% offline local SQLite storage verification, data folder shortcut, and memory reset.
  - **About**: Application version, desktop companion identity, hotkeys, and open-source license.
- **100% Local & Private**:
  - Stored locally in `%APPDATA%\kage-companion\kage.sqlite`.
  - 100% offline with zero internet telemetry, tracking, or network requests.
- **Web Audio Procedural Synthesizer**:
  - Built-in real-time audio synthesis: gentle blips, warm purrs, cheerful chimes, and lullabies with zero missing external audio files.
- **Permanent Windows Startup**:
  - Runs quietly in the background on Windows boot without opening setup windows.
  - Restores characters directly to their previously saved coordinates.

---

## ✦ Installation & Download (End Users)

> **No Node.js, Python, or programming tools required!**

### Option A: Portable Version (ZIP)
1. Download **`KAGE-COMPANION-Portable-x64.zip`**.
2. Right-click the ZIP file and select **Extract All...**.
3. Open the extracted folder and double-click **`KAGE COMPANION.exe`**.
4. Both characters will appear on your desktop!

### Option B: Windows Installer (.exe)
1. Download **`KAGE-COMPANION-Setup-1.0.0.exe`**.
2. Run the installer to create Desktop and Start Menu shortcuts.
3. Check "Launch KAGE COMPANION" and finish.

---

## ✦ Mouse & Desktop Controls

| Action | Control | Result |
| :--- | :--- | :--- |
| **Move Companion** | Click & Drag Character Body | Repositions character smoothly anywhere across your desktop |
| **Cycle Mood / Expression** | Left-Click Character | Instantly cycles through 15 official expressions & poses with sound chimes |
| **Open Menu** | Click Character | Access quick actions (Pet, Play, Sleep, Settings, Close) via vector icons |
| **Open Settings** | Right-Click Character or Double-Click Tray | Opens KAGE COMPANION Settings |
| **Reset Positions** | Right-Click Tray -> "Reset Positions" | Restores companions to bottom-right desktop corner |

---

## ✦ Developer Setup (Building From Source)

If you wish to modify or build KAGE COMPANION from source:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- npm (v9 or newer)
- Windows 10 or Windows 11 (64-bit)

### Clone & Install
```bash
git clone https://github.com/isbandu/kage-companion.git
cd kage-companion
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
- `dist/KAGE-COMPANION-Setup-1.0.0.exe` (NSIS Installer)
- `dist/KAGE-COMPANION-Portable-x64.zip` (Portable ZIP package)

---

## ✦ Architecture Overview

```
src/
├── main/
│   ├── database/
│   │   └── db.js                 # SQLite3 WebAssembly engine & tables
│   ├── engine/
│   │   ├── dialogueDatabase.js   # Character dialogue trees & responses
│   │   ├── personalityEngine.js  # Mood state machine & affection logic
│   │   ├── relationshipEngine.js # Inter-companion synchronization
│   │   └── autonomousEngine.js   # Autonomous timers & mode enforcement
│   ├── preload/
│   │   ├── companionPreload.js   # Isolated IPC bridge for companion windows
│   │   └── settingsPreload.js    # Isolated IPC bridge for settings dashboard
│   ├── windows/
│   │   ├── companionWindow.js    # Transparent frameless always-on-top window
│   │   ├── settingsWindow.js     # KAGE COMPANION 5-tab settings window
│   │   └── welcomeWindow.js      # First-launch setup wizard
│   └── index.js                  # Main process & single-instance manager
└── renderer/
    ├── assets/
    │   └── icons/                # High-res application icons & tray assets
    ├── characters/
    │   ├── kage/                 # Kage character view, avatar SVG, CSS & JS
    │   └── kage-chan/            # Kage-chan view, avatar SVG, CSS & JS
    ├── settings/                 # KAGE COMPANION Settings view & controller
    ├── welcome/                  # First-launch onboarding view & controller
    └── shared/
        ├── audio/                # Web Audio API procedural sound synthesizer
        └── styles/               # Black & blood-red theme CSS
```

---

## ✦ Ownership & License

- **Created, Developed & Owned by:** **Isbandu Rahuman R.**
- **All rights reserved to:** **Isbandu Rahuman R.**
- **Founder & Creator:** Isbandu Rahuman R.
- **Developer:** Isbandu Rahuman R.
- **Project Owner:** Isbandu Rahuman R.
- **Concept & Product Design:** Isbandu Rahuman R.
- **Application Development:** Isbandu Rahuman R.

*KAGE Companion is an independently developed personal companion application created by Isbandu Rahuman R.*  
*Official Ownership: Isbandu Rahuman R.*

This project is licensed under the [MIT License](LICENSE) — free for personal and open-source use.
