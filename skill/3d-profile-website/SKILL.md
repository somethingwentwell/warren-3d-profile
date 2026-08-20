---
name: 3d-profile-website
description: Build a personal profile website with a chunky low-poly Three.js avatar whose head tracks the cursor and looks at hovered UI components. Use when someone wants a 3D avatar profile/portfolio/CV site, a "character-select" style personal page, or asks to reuse the warren-3d-profile template with their own info and look.
---

# 3D Profile Website (low-poly avatar template)

Build a static, mobile-friendly profile site from this template:
a full-viewport "character select" stage with a hand-molded low-poly 3D avatar
in the middle, contact chips on the left edge, past-employer logo chips on the
right edge, and a full CV below. The avatar's head follows the cursor and locks
onto whichever edge component is hovered (tap = glance on touch devices).

Template source: https://github.com/somethingwentwell/warren-3d-profile
Live example: https://warrenwong.zeabur.app

## Step 1 — Copy the template

Copy these files/folders from the template repo into the new project:

```
index.html        # scaffold only — do not add content here
css/style.css     # neo-brutalist paper UI + mobile layout
js/config.js      # ALL site content (rewrite this per user)
js/render.js      # builds DOM from config — rarely needs edits
js/main.js        # Three.js avatar + gaze tracking (customize the avatar here)
assets/logos/     # replace with the user's company logos
```

No build step. Three.js loads from a CDN import map. Any static server works
(`python3 -m http.server 8722`); a server is required because main.js is an ES
module.

## Step 2 — Collect the user's content, rewrite `js/config.js`

Everything user-visible lives in one exported `CONFIG` object. Ask for (or
extract from their CV/LinkedIn):

- `name`, `title`, current `company` {name, url, logo}
- `salesResource` — one highlighted call-to-action card (rename per user; any
  featured link works: portfolio, booking page, resume PDF)
- `contacts[]` — `{type, label, href}`; supported icon types: `email`,
  `whatsapp`, `wechat`, `linkedin`, `github`. A `copy` field instead of `href`
  makes the chip copy-to-clipboard with a `toast` message (used for WeChat IDs)
- `stats[]` — the bottom strip factoids `{b: "bold part", text: "rest"}`
- `experience[]` — `{id, company, place, role, date, logo, bullets[], badges[]}`;
  `chip: true` puts the company logo on the right-edge rail, `current: true`
  highlights the card and keeps it OFF the rail; optional `links[]` for buttons
- `otherExperience[]`, `skills[]`, `certifications[]`, `education[]`,
  `languages[]`, `footer`

Company logos: download official SVGs, or fall back to
`https://cdn.simpleicons.org/<brand>` and
`https://www.google.com/s2/favicons?domain=<domain>&sz=128`. Store locally in
`assets/logos/` — never hotlink.

## Step 3 — Customize the avatar in `js/main.js`

The avatar is procedural — primitives + vertex jitter (`lumpy()`) + painted
low-res canvas textures (`paintTex()`). Match the person's photo:

- **Skin / hair / shirt colors**: edit the `skinTex`, `hairTex`, `teeTex`
  painters (base fill + blotch colors). Keep textures small (64–128px) — the
  blur when upscaled IS the style.
- **Hair**: the `hairBlobs` table. Each row is
  `[x, y, z, scaleX, scaleY, scaleZ, jitter, rotZ?]` in head-local units
  (head center ≈ y 0.5, radius ≈ 0.6; +z = face direction, +x = viewer right).
  Compose the cut from blobs: crown, back, curtain bangs, side locks, nape/tail.
  Comment each row.
- **Face**: eye/brow/lip positions near `y 0.4–0.65`, `z 0.5+`. Keep the style:
  heavy lids, small dark pupils, fleshy lips, slight asymmetry (`wob`).
- **Accessories**: glasses, watch, bracelet blocks are self-contained — delete
  or keep per the person's look. Necklace/chains: beads along an arc.
- **Proportions**: `HEAD_SCALE` (default 1.34 — big head is on-style),
  `root.position.y` to frame wrists/watch into view.

Do NOT touch the gaze-tracking section — it reads `.edge-item` elements
automatically. Any new hoverable component just needs that class.

## Step 4 — Verify

1. Serve locally, open desktop (≥1280px) and mobile (375px) viewports.
2. Check: no console errors; head turns toward a hovered chip; WeChat-style
   copy chip shows its toast; mobile shows icon-only contact chips flanking the
   canvas; page scroll is locked on mobile until the bottom scroll button is
   tapped (and re-locks at top).
3. Screenshot both sizes and compare the avatar against the person's photo;
   iterate on `hairBlobs`/textures until it reads as them.

## Step 5 — Deploy

- **GitHub Pages**: push, enable Pages from branch root (public repo).
- **Zeabur**: create project + service via dashboard or GraphQL API
  (`api.zeabur.com/graphql`), bind the GitHub repo, `addDomain` with
  `isGenerated: true` for a `*.zeabur.app` subdomain. Note: without the Zeabur
  GitHub App installed, pushes do NOT auto-deploy — trigger the `deploy`
  mutation manually after each push.
- Anything static works (Cloudflare Pages, Netlify, S3…).
