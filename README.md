# Varad Palod · 3D Portfolio

React + React Three Fiber + drei + GSAP + Zustand, bundled with Vite.

## Run locally

    npm install
    npm run dev       # dev server at http://localhost:5173
    npm run build     # production build into dist/

## Deploy

Connect this repo to Vercel, Netlify or Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`

Every push to `main` rebuilds and updates the live site.

## Editing content

Almost all text lives in `src/data.js`: projects and case studies, process steps,
toolkit chips, key labels and the email address. Social links are in `src/App.jsx`
(search for `[ GitHub`).

## How the 3D works

One fixed WebGL canvas sits above the page and never intercepts input. Every 3D object is
glued to a DOM element (`#kb-anchor`, `#box-anchor`, `#p3d-1..3`, `#stack-anchor`,
`#enter-anchor`), so layout, scrolling and responsiveness are plain CSS and the 3D follows.
