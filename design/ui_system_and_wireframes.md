# UI Design System & Wireframes

## 🎨 Core Design Principles
The UI fuses competitive tactical aesthetics (sharp, high-contrast eSports vibes) with brutalist "blueprint" details, massive typography, and cyberpunk framing. It feels like a high-tech command center mixed with a high-end design studio.

### 1. Color Palette
- **Primary Background:** `#0F1923` (Deep Matte Dark/Black) or deep rich plum/black for intense contrast.
- **High-Impact Panels:** Bright, aggressive Neon Red (`#FF0033`) blocks for extreme emphasis and cyberpunk vibes.
- **Accent (Primary Hero & CTAs):** `#FF4655` (Neon Coral) and bright Lavender/Purple highlights for typography pops.
- **Text Primary:** `#ECE8E1` (Soft Off-White) or solid Black `#000000` when placed inside Neon Red panels.
- **Text Muted/Technical:** `#8B97A2` (Slate Grey) for metadata and grid lines.

### 2. Typography (Massive & Brutalist)
- **Display / Hero Text:** Giant, screen-filling typography that stretches across the viewport (`Space Grotesk`, `Oswald`, or `Monument Extended`). Extremely bold, tightly tracked, and often overlapping to act as visual architecture.
- **Technical / Terminal Font:** Small, precise monospace fonts (`JetBrains Mono`) for metadata, coordinates (e.g., `35.6762° N / 139.6503° E`), and system statuses (e.g., `>_EXECUTE_SUBMISSION`).
- **Body & Code:** `Inter` (sans-serif) for readable paragraphs and `JetBrains Mono` for the actual code editor.

### 3. Aesthetics & Shapes
- **Blueprint & Grid System:** Backgrounds feature subtle, thin architectural grid lines. Intersections are marked with distinct crosshairs (`+`) to give a technical drafting feel.
- **Technical Annotations:** UI elements (like a user's ELO or a problem's difficulty) have thin, HUD-like connector lines pointing to them with small descriptive technical boxes (e.g., `[CORE THREADS: GRAPHS]`).
- **Sharp Edges & Framing:** No soft rounded boundaries. Use sharp corners, boxy frames, and chamfered edges (`clip-path: polygon(...)`).
- **Floating 3D Focal Points:** Incorporate high-fidelity 3D renders (like floating abstract geometric structures representing data structures) in the center of the UI, surrounded by flat technical annotations.

## ✨ Animations & Micro-Interactions
- **Glitch & Scanlines:** Fast, aggressive glitch transitions on page load or matchmaking start, similar to a terminal booting up.
- **Kinetic Typography:** The massive background text slowly shifting or reacting to mouse movements (Parallax effect).
- **Hover States:** Buttons scale up, cast a glowing neon drop-shadow, and reveal a fast "typing" effect for the button label.

## 🏗️ Wireframes / Layout Structures

### 1. The Global Dashboard (Command Center)
- **Background:** A faint engineer's grid with a massive, screen-filling typographic background reading "PRACTICE. ADAPT. OVERCOME."
- **Center Focus:** A floating 3D abstract object (representing the AI mentor's brain). Thin annotation lines point from the object to floating UI cards (Daily Challenge, Weaknesses, ELO Rank).
- **Navigation:** Boxy, terminal-like headers with coordinates and local timestamps in the top corners.

### 2. The Battle Arena (Matchmaking)
- **Layout:** High contrast split screen. Left side deep black, right side stark neon red.
- **Typography:** Giant "MATCH FOUND" text bleeding off the edges of the screen. 
- **Opponent Card:** Boxy, technical frames (`[ ... ]`) encasing the opponent's avatar and stats, looking like a surveillance target overlay.

### 3. The Code Workspace
- **Layout Structure:** Very strict, thin-bordered grid panes separating the problem description, editor, and console.
- **Left Panel:** Problem description set against a minimal background. Tags are designed like terminal commands (`>_TAG: DYNAMIC_PROGRAMMING`).
- **Console/Terminal:** Looks like a genuine hacker terminal with small monospace text logging the execution pipeline.
- **CTA:** Sticky bottom "EXECUTE CODE" button in striking neon coral, featuring a scanning laser line animation when clicked.
