# Warren Wong — 3D Profile Site

Personal static profile site with a chunky low-poly Three.js avatar (hand-painted
canvas textures, studio-paper backdrop). The avatar's head tracks the cursor and
locks onto whichever edge component (contact chip, logo, sales card) you hover;
on touch, tapping a chip makes him glance at it.

## Stack

- Plain static HTML/CSS/JS — no build step
- Three.js `0.160` via CDN import map
- Google Fonts: Bricolage Grotesque + IBM Plex Mono

## Run locally

```bash
python3 -m http.server 8722
```

Then open http://localhost:8722. (Any static server works — a server is needed
because `js/main.js` is an ES module.)

## Structure

- `index.html` — scaffold only: stage + empty section containers
- `js/config.js` — **all site content lives here** (name, contacts, experience,
  skills, certs). Edit this file to update the site.
- `js/render.js` — builds the DOM from `config.js`
- `js/main.js` — avatar geometry/textures, gaze tracking, copy-to-clipboard toast
- `css/style.css` — neo-brutalist paper UI; under 820px the contact/past-exp
  rails flank the canvas and contact chips collapse to icons
- `assets/logos/` — company logos (EvoMap, Dify, GitLab, Kong, Microsoft)

## Editing quick refs

- Content (titles, dates, links, sales-resources URL): `js/config.js`
- Avatar look: `js/main.js` — `hairBlobs` for hair, `paintTex` painters for
  skin/tee/lips, `HEAD_SCALE` for proportions
