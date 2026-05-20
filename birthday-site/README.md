# 🌻 Birthday Garden Website

A small, private sunflower-garden birthday site — pure HTML/CSS/JS, no build step.

## How to host on GitHub Pages

1. Create a new public GitHub repo (e.g. `birthday-garden`).
2. Upload the **contents** of the `birthday-site` folder to the repo root.
3. Repo → **Settings → Pages** → Source: `main` branch / root → **Save**.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

## Pages

| Page | File | Notes |
|---|---|---|
| Welcome | `index.html` | Soft intro |
| Passcode | `entry.html` | Default: **`1406`** |
| Garden menu | `garden.html` | 6 paths |
| Letter | `letter.html` | Typewriter effect |
| Pictures | `gallery.html` | 8 polaroids, alternating slide-in |
| Bouquet | `bouquet.html` | Click each sunflower for a reason |
| Music | `music.html` | 5 songs (3 + 2 layout) |
| Open When | `openwhen.html` | Tap envelopes |
| Final | `final.html` | Tap the sunflower |

## Where to edit things

Every editable area is marked with an `EDIT:` comment in the HTML/CSS.

- **Passcode** → `entry.html` → `const PASSCODE = "1406";`
- **Theme colors** → `styles.css` → `:root { ... }`
- **Letter text** → `letter.html` → `const LETTER_TEXT = ...`
- **Photos** → drop 8 images in `assets/` named `photo1.jpg`–`photo8.jpg`
- **Photo captions** → `gallery.html` → each `<figcaption>` and `data-caption`
- **Sunflower reasons** → `bouquet.html` → `const REASONS = [...]`
- **Final bouquet line** → `bouquet.html` → `const FINAL_LINE = "..."`
- **Songs** → `music.html` → 5 `<article class="song">` blocks
- **Open-When notes** → `openwhen.html` → 6 envelope blocks
- **Final surprise** → `final.html` → `const FINAL_MSG = "..."`

Enjoy 🌻
