# KAGE COMPANION Changelog

All notable changes to the KAGE COMPANION Desktop Companions project will be documented in this file.

## [1.0.0] - 2026-11-18

### Initial Release
- **KAGE The Shadow Pet**:
  - Interactive chibi black shadow pet with glowing blood-red eyes and shadow horns.
  - 13 distinct animation states: Idle, Happy, Sad, Curious, Angry, Sleepy, Surprised, Excited, Walking, Sitting, Sleeping, Talking, Teasing.
  - Procedural micro-animations (ear/horn twitching, breathing bob, tail swishing, eye blinking, aura glow).
- **KAGE-CHAN Companion**:
  - Chibi anime companion girl with long dark hair, crimson streaks, and gothic clothing.
  - 13 distinct animation states with layered hair sway physics, blinking crimson eyes, and cute chibi expressions.
- **Desktop System**:
  - Fully transparent, frameless, always-on-top desktop windows.
  - Smooth mouse drag-and-drop repositioning with click-through transparency boundaries.
  - Single instance lock and system tray controller with mode switcher.
- **Personality & Memory Engine**:
  - Contextual dialogue system based on mood, time of day, and interaction history.
  - Non-repetitive dialogue selection with cooldown tracking.
  - Local SQLite 3 embedded database (`kage.sqlite`) storing settings, character positions, affection, and interaction history.
- **Autonomous Behaviors**:
  - Four operating modes: Quiet, Focus, Normal, and Active.
  - Cross-character interactions (Kage and Kage-Chan banter and play together on the user's desktop).
- **Dashboard & Control Center**:
  - 5 streamlined configuration tabs in KAGE COMPANION black & blood-red theme.
  - Real-time mood telemetry, affection meters, energy gauges, and interaction logs.
- **Audio Synthesizer**:
  - Built-in Web Audio API sound synthesizer producing procedural 8-bit / cyber blips, purrs, chimes, and lullabies with zero external dependencies.
- **Windows Startup**:
  - Automatic launch integration via Windows Startup item registration (`app.setLoginItemSettings`).
- **Distribution**:
  - Single-click Windows installer (`KAGE-COMPANION-Setup-1.0.0.exe`).
  - Standalone zero-dependency portable ZIP package (`KAGE-COMPANION-Portable-x64.zip`).
