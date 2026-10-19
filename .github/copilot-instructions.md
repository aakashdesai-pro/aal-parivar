# GitHub Copilot Instructions - આલ પરિવાર

## Project Summary
Internal, non-commercial web suite for **આલ પરિવાર મઢ (Aal Parivar Madh - Bhechada)**.
Main active tool is the **દાન પોસ્ટર (Temple Donation Poster Maker)**.

## Non-Negotiable Rules
1. **User Communication Language**: Always reply in **Hinglish** (Roman script Hindi/English).
2. **Application Text / UI**: All user-facing text, buttons, titles, and poster text must be in **Gujarati Script (ગુજરાતી લિપિ)**.
3. **Forbidden Word**: NEVER use the name **"નેસ મેનેજર"** anywhere in the project or code. Always use **"આલ પરિવાર"**.
4. **Scope Constraint**: Strictly follow requested scope without adding unsolicited features, fake tools, badges, or promotional marketing text.
5. **No Backend / Vanilla Stack**: 100% client-side HTML, CSS, Vanilla JS. Must work via `file:///` and HTTP.

## Key Files
- `index.html`: Multi-tool single page UI.
- `app.js`: Application controller, navigation, form inputs, dynamic routing.
- `canvas-renderer.js`: 1080x1760 HD Canvas drawing engine with devotional golden-yellow top and deep peacock teal bottom separated by a symmetrical temple arch curve.
- `config.json` & `config.js`: Temple configuration. Always keep `config.js` in sync with `config.json`.
