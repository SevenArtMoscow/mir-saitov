import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Адрес сайта нужен соцсетям абсолютным (og:image, canonical). Задаётся при сборке: SITE_URL=https://example.com/ npm run build.
// В GitHub Actions подставляется адрес Pages автоматически; без SITE_URL (локально) теги просто не добавляются.
const siteMeta = (): Plugin => ({
  name: 'site-meta',
  transformIndexHtml(html) {
    const raw = process.env.SITE_URL;
    if (!raw) return html.replace(/ *<!--site-meta-->\r?\n?/, '');
    const site = raw.endsWith('/') ? raw : `${raw}/`;
    const tags = [
      `<link rel="canonical" href="${site}" />`,
      `<meta property="og:url" content="${site}" />`,
      `<meta property="og:image" content="${site}og.jpg" />`,
      `<meta name="twitter:image" content="${site}og.jpg" />`,
    ].join('\n    ');
    return html.replace('<!--site-meta-->', tags);
  },
});

export default defineConfig({
  // относительные пути — сайт открывается и с GitHub Pages (/mir-saitov/), и с любого домена
  base: './',
  plugins: [react(), tailwindcss(), siteMeta()],
  // three.js попадает в отдельный файл сам: 3D-планета подгружается лениво (lazy в Hero.tsx)
  build: { chunkSizeWarningLimit: 1100 },
})
