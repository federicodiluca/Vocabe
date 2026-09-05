# Pubblicazione

Branch `feature/store-release`. Qui `MONETIZATION` è `true` (`src/core/features.ts`).
**Target attivo: Android.** iOS è in pausa (serve un Mac, vedi in fondo).

## Già pronto nel codice

- `MONETIZATION = true`.
- Icone e splash generati da `assets/` — `npm run assets:build` poi
  `npx -y @capacitor/assets@latest generate --android`.
- Firma Android: `signingConfigs.release` legge `android/key.properties` (git-ignored);
  senza quel file la release usa la chiave di debug.
- Consenso AdMob (ATT iOS + Google UMP) in `src/core/ads/admob.ts`.
- Chiave RevenueCat per piattaforma in `revenuecat.ts` (`VITE_REVENUECAT_API_KEY_ANDROID`).
- Shell nativa: splash screen, status bar a tema, icona notifica `ic_stat_notification`.
- Privacy policy: `public/privacy/` → `/vocabe/privacy/`, linkata da Opzioni e sitemap.
- `.gitignore`: keystore, `key.properties`, file dei servizi Google.

## Da fare — Android

- [ ] Android Studio + SDK installati.
- [ ] Account **RevenueCat** + Stripe; prodotto one-time + entitlement `pro`.
      Chiave in `.env`: `VITE_REVENUECAT_API_KEY_ANDROID`.
- [ ] Account **AdMob**: unità rewarded reale → `.env`
      (`VITE_ADMOB_REWARDED_UNIT_ID_ANDROID`) e app id come `-PADMOB_APP_ID=…`
      o in `android/gradle.properties` (sostituisce l'id di test nel manifest).
- [ ] Generare il **keystore** di release:
      `keytool -genkey -v -keystore vocabe-release.keystore -alias vocabe -keyalg RSA -keysize 2048 -validity 10000`
      — tenerlo fuori dal repo, creare `android/key.properties`.
- [ ] `versionCode` / `versionName` in `android/app/build.gradle`.
- [ ] `npm run cap:sync`, poi in Android Studio: Build → Generate Signed Bundle (`.aab`).
- [ ] Play Console: scheda, screenshot, content rating, data safety (AdMob + acquisti),
      URL privacy `…/vocabe/privacy/`, canale di test interno.
- [ ] Verificare il testo della privacy con i servizi realmente attivi.

## iOS — in pausa

Il progetto `ios/` esiste già (`@capacitor/ios`, `Info.plist` con ATT/AdMob, icone). Per
completarlo serve **macOS** (CocoaPods + Xcode per firma e build) oppure una **CI macOS**
(GitHub Actions runner `macos-*`, Codemagic) più un **Apple Developer Program** ($99/anno).
Quando ci sarà:

- [ ] `sudo gem install cocoapods`, `npx cap sync ios`.
- [ ] Xcode: team, bundle id `app.vocabe.mobile`, signing.
- [ ] `Info.plist`: `GADApplicationIdentifier` reale + lista completa `SKAdNetworkItems`.
- [ ] Chiave RevenueCat iOS (`VITE_REVENUECAT_API_KEY_IOS`) + prodotto su App Store Connect.
- [ ] App Store Connect: scheda, screenshot, privacy labels, revisione.

## Note

- Capacitor 7 (v8 richiede Node ≥ 22; ora si usa Node 20).
