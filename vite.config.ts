import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// Project page on GitHub Pages (federicodiluca.github.io/vocabe) — dev server keeps serving at "/".
const base = process.env.GITHUB_PAGES ? '/vocabe/' : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Vocabe — una parola al giorno',
        short_name: 'Vocabe',
        description: 'Impara una parola italiana al giorno: significato, esempi e ripasso.',
        lang: 'it',
        // relative to the manifest's own URL, so it works under any base path
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#faf7f2',
        theme_color: '#1c1917',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        // The RevenueCat Web Billing SDK is a large, rarely-needed chunk (only paying
        // customers ever fetch it) — skip it at install time and cache it on first use.
        globIgnores: ['**/iap-web-sdk-*.js'],
        runtimeCaching: [
          {
            urlPattern: /iap-web-sdk-.*\.js$/,
            handler: 'CacheFirst',
            options: { cacheName: 'iap-web-sdk' },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@revenuecat/purchases-js') || id.includes('@revenuecat/purchases-ui-js')) {
            return 'iap-web-sdk'
          }
        },
      },
    },
  },
})
