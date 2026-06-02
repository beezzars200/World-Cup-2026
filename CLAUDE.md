# CLAUDE.md

## Before every commit

Run this first — the git config resets between sessions and commits will show as Unverified on GitHub without it:

```bash
git config user.email noreply@anthropic.com && git config user.name Claude
```

## Repository overview

Static HTML/CSS/JS site for the FIFA World Cup 2026, hosted on GitHub Pages.

- `index.html` — app shell, tabs, buster form
- `js/tournament.js` — all team, group, and fixture data
- `js/app.js` — rendering logic, live scores, buster form handling
- `css/style.css` — all styles
- `data/results.json` — live match scores (updated by GitHub Action)
- `data/entries.json` — buster entry count (`count`, `max`, `open`)
- `.github/workflows/worldcup-pages.yml` — deploys to GitHub Pages on push to `main`
- `.github/workflows/worldcup-results.yml` — fetches live scores every 5 min during matches

## Key config (top of js/app.js)

```js
var FORMSPREE_ID = 'xqeozegb';               // Formspree form ID
var REVOLUT_URL  = 'https://revolut.me/brianos'; // Payment link
var ENTRY_FEE    = '€20';                    // Entry fee shown on success screen
```

## Buster entry cap

Edit `data/entries.json` to update the live count as entries come in:

```json
{ "count": 5, "max": 48, "open": true }
```

Set `"open": false` to close the buster early regardless of count.

## Branch

Development branch: `claude/world-cup-migration-Bp5vw`  
Production: `main` (auto-deploys to GitHub Pages)
