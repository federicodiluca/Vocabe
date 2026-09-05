# Vocabe

Una parola italiana al giorno: significato, esempi, etimologia. Il giorno dopo un quiz per ripassarla.

**[federicodiluca.github.io/vocabe](https://federicodiluca.github.io/vocabe/)**

Web app (PWA), funziona offline. Nessun account: i progressi stanno in `localStorage`,
esportabili come file JSON dalle impostazioni.

## Sviluppo

Node 20.19.1.

```bash
npm install
npm run dev
npm run words:validate   # valida src/data/words.json
npm run build
```

Stack: Vite, React, TypeScript, Tailwind, react-router, vite-plugin-pwa.

```
src/
  app/        shell, routing, tema
  core/       content, storage, srs (Leitner), streak, badges, share, challenge
  state/      contesto + persistenza
  features/   daily · recall · explore · progress · settings · challenge · paywall
  ui/         componenti condivisi
  data/       words.json (386 voci)
scripts/
  build-seo.mjs    genera dopo la build /parole/<slug>/, glossario, sitemap.xml
  build-icons.mjs  rigenera le icone da icon-source.svg (npm run icons:build)
```

## Deploy

GitHub Actions pubblica su GitHub Pages a ogni push su `main`
(`.github/workflows/deploy.yml`). Il `base` diventa `/vocabe/` solo con `GITHUB_PAGES=true`.

## Note

`android/` contiene un wrapper Capacitor e `src/core/{ads,iap}` l'aggancio a AdMob / RevenueCat:
inattivi finché le chiavi in `.env` non sono impostate (`.env.example`).

---

[Federico Di Luca](https://federicodiluca.github.io/)
