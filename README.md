# Vocabe 📖

**Una parola italiana al giorno**: significato, esempi d'uso, etimologia e una curiosità.
Il giorno dopo un piccolo quiz ti aiuta a non dimenticarla.

**→ [Prova Vocabe](https://federicodiluca.github.io/vocabe/)**

Gratis, senza registrazione, funziona offline. I progressi restano sul tuo dispositivo:
nessun account, nessun database, nessun tracciamento.

## Cosa fa

- **Oggi** — la parola del giorno, deterministica per data; la scopri con un tocco e la segni come imparata
- **Ripasso** — quiz a scelta multipla sulle parole in scadenza, con ripetizione spaziata (mini algoritmo di Leitner)
- **Progressi** — streak, obiettivi/badge, storico con ricerca
- **Impostazioni** — tema chiaro/scuro, esporta/importa i progressi come file JSON
- **Condivisione** — genera un'immagine della parola pronta per i social
- **[Glossario](https://federicodiluca.github.io/vocabe/parole/)** — pagine statiche per tutte le 386 parole (anche per la SEO)

## Stack

- **Vite + React 19 + TypeScript**, **Tailwind CSS v4**
- **vite-plugin-pwa** — installabile, offline
- **react-router**
- Stato in un unico blob JSON `vocabe:v1` — `localStorage` sul web, dietro un adapter (`src/core/storage`)
- `src/core` e `src/ui` sono pensati come base riutilizzabile per altre micro-app dello stesso tipo

## Struttura

```
src/
  app/        shell, routing, tema
  core/       logica pura: content, storage, srs, streak, badges, share, date, ads, iap, notifications
  state/      ProgressContext (stato + azioni + persistenza)
  features/   daily · recall · progress · settings · paywall
  ui/         componenti condivisi
  data/       words.json — dataset curato (386 parole)
scripts/
  validate-words.ts   controlla il dataset
  build-seo.mjs        genera le pagine statiche + sitemap dopo la build
```

## Sviluppo

Node `20.19.1`.

```bash
npm install
npm run dev
npm run words:validate      # valida src/data/words.json
npm run build && npm run preview
```

## Deploy

Pubblicato su **GitHub Pages** a ogni push su `main` tramite GitHub Actions
(`.github/workflows/deploy.yml`). La build imposta `base: /vocabe/` solo quando la variabile
`GITHUB_PAGES=true` è presente, così `npm run dev` resta su `/`.

Dopo `vite build`, `scripts/build-seo.mjs` genera contenuti statici indicizzabili
(`dist/parole/<parola>/`, glossario, `sitemap.xml`, `robots.txt`) — la SPA da sola sarebbe
quasi invisibile ai motori di ricerca.

## Roadmap

- **MVP** ✅ parola del giorno · imparata · storico con ricerca
- **Retention** ✅ streak · badge · tema · quiz di ripasso
- **Viralità** ✅ condivisione con immagine · ⏳ sfida tra amici · più curiosità
- **Contenuti** ⏳ pagina "Esplora" per categoria/difficoltà dentro l'app
- **App nativa** (in pausa) — wrapper **Capacitor** per Android già presente in `android/`, non ancora pubblicato
- **Monetizzazione** (in pausa) — struttura pronta per IAP "Pro" via **RevenueCat** (web + Android) e rewarded ads
  **AdMob** su Android; disattivata finché le chiavi in `.env` non sono configurate (vedi `.env.example`)

## Autore

Un progetto di [Federico Di Luca](https://federicodiluca.github.io/).
