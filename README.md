# Warren Wong — 3D Profile Site

**Live: https://warrenwong.zeabur.app**

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

## Use as a template (agent skill)

[`skill/3d-profile-website/SKILL.md`](skill/3d-profile-website/SKILL.md) is a
Claude Code skill that walks an AI agent through building **your own** version
of this site — your info, your avatar, your logos.

How to use:

1. Copy the skill into your project (or user) skills folder:

   ```bash
   mkdir -p .claude/skills && cp -r skill/3d-profile-website .claude/skills/
   ```

2. In Claude Code, ask for it — e.g.
   *"use the 3d-profile-website skill to build my profile site, here's my CV
   and a photo of me"* — or invoke it directly with `/3d-profile-website`.

3. The skill covers: copying the template, rewriting `js/config.js` with your
   content, sculpting the avatar (hair/skin/accessories) to match your photo,
   local verification, and deploy options (GitHub Pages / Zeabur).
