# CLAUDE.md — Usman Khan Portfolio

This file provides guidance for Claude Code when working on this project.

## Project Overview

Personal portfolio website for Muhammad Usman Khan — Mechanical Engineering student & web developer at Air University, Islamabad. Includes an AI-powered chatbot, blog platform, academic tracker, and utility apps.

**Live site:** https://usman-ai-and-mech-engineer.vercel.app/

---

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+) — no frameworks
- **Backend:** Python 3.12 serverless function on Vercel (Flask + Groq API)
- **AI Chatbot:** Groq API (`llama-3.1-8b-instant`) via `/api/index.py`
- **Deployment:** Vercel (primary), GitHub Pages (backup)
- **Package manager:** `uv` (Python), no Node.js build step

---

## Project Structure

```
/
├── index.html          # Main portfolio page (hero, about, skills, projects, contact)
├── index.css           # Design system for index.html (tokens, nav, hero, sections)
├── site-theme.css      # Shared theme for every other page (same tokens, nav, cards)
├── site-theme.js       # Applies the saved colour theme + mobile drawer state on subpages
├── academics.html      # Education, GPA tracker, semester results
├── blog.html           # Blog listing page
├── blog-post.html      # Individual blog post template
├── blog.js             # Blog post database (~108 KB, contains all post content)
├── gpa.html / gpa.js   # GPA calculator app
├── todo.html / todo.js # To-do list app
├── api/
│   └── index.py        # Vercel serverless chatbot handler (Groq-powered)
├── images/             # Portfolio images (26 MB — do not commit large binaries)
├── projects/           # Engineering project files, PDFs, videos (64 MB)
├── Certificate/        # Academic certificates and results
├── CV/                 # Resume PDFs
├── vercel.json         # Routes /api/chat → /api/index.py
├── .vercelignore       # Excludes .venv, dev scripts, config files from deployment
├── requirements.txt    # Flask==3.0.0, openai==1.6.0 (used by Vercel)
└── .env                # GROQ_API_KEY (never commit)
```

---

## Key Development Guidelines

### Frontend
- All pages use vanilla JS — do NOT introduce npm packages or build tools.
- Styling runs through design tokens. `index.css` (home page) and `site-theme.css`
  (every other page) define the same `:root` tokens: `--brand`, `--bg`, `--surface`,
  `--line`, `--text`, `--font-display|body|mono`, `--r-*`, `--shadow-*`, `--ease`, `--dur`.
  Change a token there rather than hard-coding a colour in a component rule.
- Colour is theme-aware: `data-theme="light"` on `<html>` swaps the token set; the
  preference is stored in `localStorage` under `uk-theme`. Keep new rules token-based
  so both themes work, and pin a page to one theme with `data-force-theme`.
- Typography: Sora (display), Inter (body), JetBrains Mono (eyebrows, chips, numbers).
  Icons come from Font Awesome 6.5.1 via CDN.
- `index.html` carries no `<style>` block — styles live in `index.css`. Page CSS stays
  co-located per page (e.g. `blog.css` for `blog.html`), then `site-theme.css` is linked
  last so the shared tokens win.
- Motion is opt-out: any new animation must sit inside `@media (prefers-reduced-motion: no-preference)`
  or be neutralised by the reduced-motion block.
- `blog.js` contains all blog post data as JS objects. Add new posts there.

### Backend / API
- The only server-side code deployed to Vercel is `api/index.py`.
- `chatbot.py`, `main.py`, and `server.py` are local dev files — excluded via `.vercelignore`.
- The chatbot uses Groq API. The key is read from `GROQ_API_KEY` env variable.
- When testing locally, run `server.py` or use the Flask dev server.

### Environment Variables
- Copy `.env.example` → `.env` and set `GROQ_API_KEY`.
- Never commit `.env`. It is already in `.gitignore`.
- On Vercel, set `GROQ_API_KEY` in the project environment settings.

### Deployment
- Pushing to `main` triggers auto-deploy on Vercel.
- `vercel.json` only rewrites `/api/chat` → `/api/index.py`. Keep it minimal.
- `.vercelignore` excludes all dev-only files — do not remove entries without reason.
- Python runtime is pinned to `python3.12` via `runtime.txt`.

---

## Common Tasks

### Add a new blog post
Edit `blog.js` — append a new object to the posts array following the existing schema (id, title, date, category, tags, content, etc.).

### Update portfolio content
Edit `index.html` directly (sections are commented) and `index.css` for its styling — the page has no inline `<style>` block anymore. Subpages inherit `site-theme.css`; page-specific tweaks go in that page's own CSS file, which is loaded before the shared theme.

### Modify the chatbot system prompt
Edit the `system` message in `api/index.py` (and optionally `chatbot.py` for local dev).

### Add a new page
- Create `page.html` and `page.css` / `page.js` alongside existing pages.
- Link from `index.html` navigation (nav labels live in the `.nav-links` block), and load `site-theme.css` + `site-theme.js` with the correct relative prefix.
- Add `<meta name="description">` and a favicon (`images/favicon.png`) like the other pages.
- No routing config needed — Vercel serves static files automatically.

---

## Git Conventions

- Commit messages are short and imperative (e.g., `Update hobbies section`, `Fix Vercel deployment config`).
- Do not commit large binary files (images, PDFs, videos) unless necessary.
- The `projects/` and `images/` directories are large — avoid bulk re-adding them.

---

## Subfolders to Ignore

- `areeba-portfolio/` and `swaira-portfolio/` — separate portfolio projects, unrelated to main site.
- `.venv/` — Python virtual environment, never edit or commit.
