# AI Assistant Instructions - આલ પરિવાર (Aal Parivar - Bhechada)

This document contains critical project rules, constraints, architectural guidelines, and conventions for any AI assistant working on this codebase.

---

## 1. Project Overview & Purpose

- **Context**: Internal seva and community web tool suite for **આલ પરિવાર મઢ (Aal Parivar Madh - Bhechada)**.
- **Current Active Tool**: **દાન પોસ્ટર (Temple Donation Poster Maker)** — creates high-resolution devotional donation acknowledgment posters for WhatsApp status, stories, and community groups.
- **Nature of Project**: **100% Non-Commercial & Internal Use Only**.
- **Zero Backend**: Pure static client-side web application (HTML5, CSS3, Vanilla JS). Must work offline and directly via `file:///` without requiring any build step or server.

---

## 2. Strict Rules & Constraints (Non-Negotiable)

1. **Language & Communication**:
   - **Assistant to User Communication**: Must ALWAYS be in **Hinglish** (Roman script Hindi/English mix).
   - **Website UI & Poster Content**: Must ALWAYS be in **Gujarati Script (ગુજરાતી લિપિ)**.
2. **Forbidden Words & Branding**:
   - **NEVER** use or mention **"નેસ મેનેજર"** anywhere in the code, comments, UI, or posters.
   - Always use **"આલ પરિવાર"** (or "આલ પરિવાર - ભેચડા").
3. **No Marketing or Commercial Fluff**:
   - This tool is strictly non-profit and internal.
   - **NEVER** add promotional badges, marketing hype, counters ("1 સક્રિય", "● સક્રિય (Active)"), fake pricing, or sales copy.
4. **Strict Scope & Minimalism**:
   - *"Jitna bola jaye utna hi karna"* — Do NOT assume, invent, or add unsolicited features.
   - Do NOT add placeholder cards or "coming soon" fake tools to the dashboard. Only display tools that are actually built and functioning.
5. **No External Build Tools / Framework Bloat**:
   - Keep the codebase 100% vanilla (vanilla JS, standard CSS, plain HTML). No React, Vue, Webpack, or npm dependencies unless explicitly instructed.

---

## 3. Design System & Poster Layout

- **Color Palette**:
  - **Top Devotional Aura**: Warm Radiant Golden-Yellow (`#facc15`, `#eab308`, `#fef08a`) with subtle radial gradients and mandala glow.
  - **Bottom Field**: Deep Peacock Teal (`#0a3c48`, `#06424e`, `#083344`).
  - **Accents**: 24K Gold (`#facc15`, `#f59e0b`), Pure White frames, Sacred Maroon text (`#6e1d0c`).
- **Poster Layout Structure**:
  - **Distinct Layout (Do NOT clone wave cut)**: The transition between yellow and teal uses a symmetrical **Temple Arch / Dome curve (મંદિર ગુમ્બજ આકાર)** with dual gold and white piping trim.
  - **Top Header**: Four sacred deity names (defined in `config.json`) in sacred maroon, followed by the tagline `❖ “શ્રદ્ધા, સેવા અને સંગઠન” ❖`.
  - **Temple Photo**: Centered hero frame with double white and gold inner border, followed by `— ❖ ગામ : ભેચડા ❖ —`.
  - **Occasion Badge**: Centered at the apex of the teal arch (e.g. `જન્મદિવસ નિમિત્તે`).
  - **Donor Photo**: White framed box with inner gold rim, supporting client-side pan (X/Y) and zoom.
  - **Donor Name**: Auto-expanding white capsule pill with gold border and dynamic font autoscaling.
  - **Donation Details**: Illuminated frosted plaque showing date and glowing gold donation amount (`₹ 501/-`).
  - **Footer**: `આલ પરિવાર મઢ - ભેચડા`, appreciation line, and `॥ ખુબ ખુબ આભાર.... ॥`.

---

## 4. Configuration Architecture (`config.json` & `config.js`)

- **`config.json`**: The master static configuration file. Contains deity names, tagline, village name, and footer lines.
- **`config.js`**: A JavaScript wrapper setting `window.TEMPLE_CONFIG` with the identical data.
  > **Crucial Rule**: Because web browsers block `fetch('config.json')` when opened locally via the `file:///` protocol (CORS restriction), `app.js` attempts to fetch `config.json?v=${Date.now()}` on HTTP/servers, and seamlessly falls back to `config.js` on `file:///`.
  > **Always keep `config.js` in exact sync with `config.json`** whenever configuration changes are made.

---

## 5. File Structure & Responsibilities

```
├── index.html            # Main single-page interface (Dashboard Hub & Poster Tool View)
├── style.css             # Responsive layout, devotional theme, modern inputs
├── canvas-renderer.js    # 1080x1760 px Ultra-HD poster rendering engine
├── app.js                # State management, view routing, form bindings, export handlers
├── config.json           # Master JSON configuration for Aal Parivar Madh
├── config.js             # Fallback configuration for offline / file:/// protocol
├── assets.js             # Base64 fallback images for offline resilience
└── assets/               # Local images (temple photo, etc.)
```

---

## 6. How to Run & Test

1. **Direct file open**: Double click `index.html` in any browser (`file:///` protocol).
2. **Local HTTP server**:
   ```bash
   python3 -m http.server 8000
   # or via VS Code Live Server
   ```
