# ABS PCB World Portfolio

> Aaditya Bharat Singh — Interactive 3D portfolio built on a PCB board.
> Drive a solder robot around a monochrome circuit board. Park near components to explore the portfolio.

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Controls

| Key | Action |
|-----|--------|
| `W` `A` `S` `D` / Arrows | Drive |
| `Shift` | Boost |
| `E` / `Enter` | Inspect component |
| `Esc` | Close panel |
| Mouse drag | Orbit camera |

## Project Structure

```
pcb-world/
├── server.js              # Express server
├── package.json
├── public/
│   ├── index.html         # Entry point + loading screen
│   ├── css/
│   │   └── style.css      # All styles (monochrome PCB theme)
│   └── js/
│       ├── data.js        # ← EDIT THIS to change portfolio content
│       ├── world.js       # PCB board, traces, component meshes
│       ├── robot.js       # Solder robot mesh + animation
│       ├── controls.js    # Keyboard/mouse input + physics
│       ├── ui.js          # Loading, panel, HUD, prompts
│       └── main.js        # Scene setup + game loop
```

## Updating Content

All portfolio content lives in `public/js/data.js`. Edit `PORTFOLIO_DATA` to update:
- Component positions (`x`, `z`)
- Panel content (`tag`, `title`, `sub`, `desc`, `tags[]`)
- Component types: `ic_large`, `capacitor`, `led`, `resistor`, `connector`

## Deploy to Netlify

For Netlify, serve the `public/` folder directly — no Node.js needed.
The `server.js` is only for local development.

## Tech Stack

- **Three.js r160** — 3D rendering (via CDN)
- **Node.js + Express** — local dev server
- **Space Mono + Syne** — typography
- No build tools, no bundler — plain JS modules
