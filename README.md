# Vocabe 📖

Una **parola italiana al giorno**: significato, esempi, etimologia e curiosità.
Poche cose ogni giorno, un piccolo ripasso, e la vista di quanto hai imparato — senza account, senza database.

App **freemium** (rewarded ads + sblocco "Pro" una tantum) pensata per **Google Play Store** e **web** (PWA).
`src/core` e `src/ui` sono il template riutilizzabile per le prossime app.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4**
- **vite-plugin-pwa** (offline, installabile)
- **react-router**
- Stato utente in un unico blob JSON `vocabe:v1` — `localStorage` sul web, Capacitor Preferences nell'app Android (adapter in `src/core/storage`)
- Ripasso: mini algoritmo di Leitner (`src/core/srs`)

## Struttura

```
src/
  app/        shell, routing, tema
  core/       logica pura e riusabile: content, storage, srs, streak, badges, share, date
  state/      ProgressContext (stato + azioni + persistenza)
  features/   daily · recall · progress · settings
  ui/         componenti condivisi
  data/       words.json (dataset curato)
scripts/      validate-words.ts
```

## Sviluppo

Node `20.19.1`.

```bash
npm install
npm run dev
npm run words:validate   # controlla il dataset
npm run build && npm run preview
```

## App Android (Capacitor)

Richiede **Android Studio** (con Android SDK) installato e avviato almeno una volta.

```bash
npm run cap:sync   # build web + copia in android/ + sincronizza i plugin
npm run cap:open   # apre il progetto in Android Studio (Run ▶ per lanciarlo su device/emulatore)
```

Su Android: storage in `Preferences` nativo (non `localStorage`) e promemoria giornaliero reale via `LocalNotifications`
(l'utente deve concedere il permesso la prima volta — gestito automaticamente quando attiva il promemoria in Impostazioni).
Le icone in `android/app/src/main/res/mipmap-*` sono ancora quelle di default di Capacitor: da rifare con
[`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets) prima della pubblicazione.

**Nota versioni**: Capacitor 8 richiede Node ≥22; il progetto è fissato a Node 20.19.1, quindi si usa **Capacitor 7**
(supportato fino a fine 2025). Da valutare l'aggiornamento di Node quando si passa a Capacitor 8.

## Roadmap

- **Fase 1 — MVP** ✅ parola del giorno · segna come imparata · storico con ricerca
- **Fase 2 — retention** ✅ streak · badge · tema chiaro/scuro · quiz di ripasso · notifiche native (Android)
- **Fase 3 — viralità** ✅ condivisione con grafica (immagine PNG generata) · ⏳ sfida amici · curiosità
- **Fase 4 — premium** categorie · quiz avanzati · chatbot IA · packaging Capacitor + AdMob + IAP
