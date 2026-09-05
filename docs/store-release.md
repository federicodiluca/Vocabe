# Pubblicazione su Play Store e App Store

Branch di lavoro: `feature/store-release`. Su questo branch si accende
`MONETIZATION` (`src/core/features.ts`) e si completano gli step qui sotto.

## Comune

- [ ] Pagina **privacy policy** pubblica e raggiungibile (i dati stanno solo sul
      dispositivo, ma le store la richiedono per ads e acquisti). Può stare su
      `federicodiluca.github.io/vocabe/privacy/`.
- [ ] Account **RevenueCat** + Stripe collegato; prodotto one-time + entitlement `pro`.
- [ ] `MONETIZATION = true` in `src/core/features.ts`.
- [ ] Aggiornare i link alle store nel sito e nel README quando sono online.

## Android (Capacitor già in `android/`)

- [ ] Android Studio + SDK installati e aperti almeno una volta.
- [ ] Icone adaptive: `@capacitor/assets` a partire da `scripts/icon-source.svg`
      (le `npm run icons:build` coprono solo la PWA).
- [ ] `applicationId` in `android/app/build.gradle` (ora `app.vocabe.mobile`).
- [ ] Keystore di release + `signingConfigs`. **Non committare il keystore.**
- [ ] `versionCode` / `versionName`.
- [ ] Account **AdMob**: unità rewarded reale; sostituire il valore di test in
      `android/app/build.gradle` (`manifestPlaceholders.admobAppId`) e in
      `.env` (`VITE_ADMOB_REWARDED_UNIT_ID_ANDROID`).
- [ ] Chiave RevenueCat Android in `.env` (`VITE_REVENUECAT_API_KEY_ANDROID`).
- [ ] `npm run cap:sync`, poi bundle `.aab` da Android Studio.
- [ ] Play Console: scheda, screenshot, content rating, data safety, test interno.
- [ ] Nota: Capacitor 8 richiede Node ≥ 22 (ora si usa 7 su Node 20).

## iOS

- [ ] Mac con **Xcode** (obbligatorio per il build).
- [ ] `npm i @capacitor/ios && npx cap add ios`.
- [ ] Bundle id, team di sviluppo, signing.
- [ ] Chiave RevenueCat iOS + prodotto su App Store Connect.
- [ ] App Store Connect: scheda, screenshot, privacy, revisione.
