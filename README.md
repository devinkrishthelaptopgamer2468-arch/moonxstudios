# MoonXstudios website

A static site with plain HTML, CSS and JavaScript. It has no build step and no dependencies apart from Google Fonts.
The repo root is the website. **Main address: https://moonxstudios.vercel.app**

Every push to `main` redeploys automatically, within a minute or two, on both Vercel and GitHub Pages.

## Files

| File | What it is |
|---|---|
| `index.html` | The page: all sections and text |
| `style.css` | Theme, layout and CSS animations |
| `main.js` | Loader, smooth scroll, cursor and scroll effects |
| `404.html` | "Page not found" page (Netlify, Vercel and GitHub Pages pick it up automatically) |
| `assets/` | Photos |
| `favicon.svg`, `apple-touch-icon.png` | Browser-tab and home-screen icons |
| `og-image.jpg` | Preview image shown when the link is shared |
| `robots.txt` | Lets search engines index the site |

## Deploy

**Vercel (main):** https://moonxstudios.vercel.app
Project `moonxstudios`, connected to this GitHub repo. Framework preset *Other*, no build command, root `./`.

**GitHub Pages (backup):** https://devinkrishthelaptopgamer2468-arch.github.io/moonxstudios/
Repo → Settings → Pages → *Deploy from a branch* → `main` / `(root)`. `.nojekyll` tells GitHub to serve the files as-is.

## Moving to a custom domain later

In `index.html`, update the `canonical`, `og:url` and `og:image` URLs in the `<head>` to the new domain.
WhatsApp, LinkedIn and others need the full URL to show the share preview.

## Changing photos

Replace a file in `assets/` and keep the same name:

| File | Section |
|---|---|
| `hero-arms.png` | Table of contents (transparent cut-out) |
| `intro-camera.jpg` | Introduction banner |
| `ryan-portrait.jpg` | About me (shown black & white) |
| `skill-editing.jpg` | Editing card |
| `skill-video.jpg` | Videography card |
| `experience-laptop.jpg` | Work Experience, last card |
| `first-project.jpg` | First Project |
| `thank-you.png` | Thank You (transparent cut-out) |

Keep photos at about 1600px wide or less and under ~300 KB each so the site stays fast.

## Contact links

The "Let's talk" button opens an Instagram DM (`https://ig.me/m/moonxstudios`).
To use email instead, change it to `mailto:you@example.com` in `index.html`.
