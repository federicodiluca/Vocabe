# Pubblicazione su Play Store e App Store

Branch `feature/store-release`. Qui `MONETIZATION` è `true` (`src/core/features.ts`).

## Già fatto su questo branch

- `MONETIZATION = true`.
- Icone e splash Android + iOS generati da `assets/` con `@capacitor/assets` (via npx,
  non è una dipendenza). Rigenerare:
  `npm run assets:build && npx -y @capacitor/assets@latest generate`.
- Piattaforma **iOS** aggiunta (`ios/`). Serve un Mac per il resto.
- `android/app/build.gradle`: `signingConfigs.release` che legge da `android/key.properties`
  (git-ignored); finché non c'è, la release usa la chiave di debug.
- Pagina **privacy** statica: `public/privacy/` → `/vocabe/privacy/`, linkata dalle opzioni
  e nel sitemap.
- `.gitignore`: `key.properties`, `*.keystore`, `*.jks`, i file dei servizi Google.
- **Consenso AdMob**: `src/core/ads/admob.ts` fa ATT (iOS) + UMP (Google) prima di
  `initialize()`. Chiave RevenueCat scelta per piattaforma in `revenuecat.ts`
  (`VITE_REVENUECAT_API_KEY_IOS` / `_ANDROID`).
- `ios/App/App/Info.plist`: `NSUserTrackingUsageDescription`, `GADApplicationIdentifier`
  (id di test), un `SKAdNetworkItems` con la sola rete Google.
- **Shell nativa**: `@capacitor/splash-screen` (nascosto da JS a mount, sfondo scuro) +
  `@capacitor/status-bar` (stile che segue il tema, in `ThemeEffect`). Icona notifica
  Android `ic_stat_notification` (bianca, 5 densità) generata da `scripts/build-native-assets.mjs`.

## Da fare — comune

- [ ] Account **RevenueCat** + Stripe collegato; prodotto one-time + entitlement `pro`.
- [ ] Chiavi in `.env`: `VITE_REVENUECAT_API_KEY_ANDROID`, `_IOS`, `_WEB`.
- [ ] Verificare il testo della privacy con i servizi realmente attivati.

## Da fare — Android

- [ ] Android Studio + SDK installati.
- [ ] Account **AdMob**: unità rewarded reale → in `.env`
      (`VITE_ADMOB_REWARDED_UNIT_ID_ANDROID`) e come `-PADMOB_APP_ID=…` o in
      `android/gradle.properties` (sostituisce l'id di test nel manifest).
- [ ] Generare il **keystore** di release (`keytool -genkey -v -keystore vocabe-release.keystore
      -alias vocabe -keyalg RSA -keysize 2048 -validity 10000`), tenerlo fuori dal repo,
      creare `android/key.properties`.
- [ ] `versionCode` / `versionName` in `android/app/build.gradle`.
- [ ] `npm run cap:sync`, poi in Android Studio: Build → Generate Signed Bundle (`.aab`).
- [ ] Play Console: scheda, screenshot, content rating, data safety
      (indicare AdMob + acquisti), URL privacy `…/vocabe/privacy/`, test interno.

## Da fare — iOS (su Mac)

- [ ] `sudo gem install cocoapods`, poi `npx cap sync ios`.
- [ ] Xcode: team di sviluppo, bundle id `app.vocabe.mobile`, signing.
- [ ] `Info.plist`: sostituire `GADApplicationIdentifier` con quello reale e incollare
      la lista completa `SKAdNetworkItems` di Google.
- [ ] Chiave RevenueCat iOS + prodotto su App Store Connect.
- [ ] App Store Connect: scheda, screenshot, privacy nutrition labels, revisione.

## Note

- Capacitor 7 (Capacitor 8 richiede Node ≥ 22; ora si usa Node 20).
- `npm run cap:sync` sincronizza entrambe le piattaforme.
