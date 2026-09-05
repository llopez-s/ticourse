import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Deployed to GitHub Pages at https://llopez-s.github.io/ticourse/ , so assets
// must resolve under that sub-path. Override with BASE_PATH=/ for other hosts
// (Vercel, Netlify, a custom domain) — the HashRouter needs no rewrite rules.
const base = process.env.BASE_PATH ?? '/ticourse/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
