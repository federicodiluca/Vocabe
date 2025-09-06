# 📘 Vocabe

Vocabe è una **web app minimal** che mostra una *parola italiana al giorno*, con definizione ed esempi d’uso.
L’utente può spuntare la parola come “fatta” e mantenerne lo stato grazie al `localStorage`.
L’app è **PWA-ready**: può essere installata su smartphone come applicazione standalone.

---

## 🚀 Tecnologie usate

* [Next.js 14](https://nextjs.org/) — React framework
* [TailwindCSS](https://tailwindcss.com/) — styling
* [TypeScript](https://www.typescriptlang.org/) — typing
* **PWA** (manifest + service worker)
* **Docker + Docker Compose** — ambiente portabile

---

## 📂 Struttura progetto

```
vocabe/
 ├─ app/              # codice Next.js (layout.tsx, page.tsx, globals.css)
 ├─ public/           # file statici (words.json, manifest.json, sw.js, icons)
 ├─ package.json      # dipendenze
 ├─ tailwind.config.js
 ├─ postcss.config.js
 ├─ tsconfig.json
 ├─ Dockerfile
 ├─ docker-compose.yml
 └─ .gitignore
```

---

## 🖥️ Setup locale per sviluppo

Per utilizzare la versione corretta di node:

```bash
nvm install 20.19.1
nvm use 20.19.1
```

N.B. Per switchare versione di Node serve un terminale aperto da Admin.

### 1️⃣ Installa le dipendenze

```bash
npm install
```

### 2️⃣ Avvia Next.js in modalità sviluppo

```bash
npm run dev
```

Apri il browser su 👉 [http://localhost:3000](http://localhost:3000)

---

## 📦 Build in produzione

Per buildare la versione ottimizzata:

```bash
docker compose -f docker-compose.yml down
docker build -t vocabe-prod -f Dockerfile .
docker run -p 3000:3000 vocabe-prod npm run build && npm start
```

---

## 📱 PWA (Installabile su smartphone)

* `manifest.json` definisce nome/icona/colori.
* `sw.js` gestisce il caching offline.
* Su Android/iOS, puoi aggiungere **Vocabe** alla schermata home e usarla come app standalone.

---

## 📝 Gestione delle parole

Le parole sono definite in **`public/words.json`**:

```json
[
  {
    "date": "2025-09-04",
    "word": "ineffabile",
    "definition": "Che non si può esprimere a parole.",
    "examples": ["Una bellezza ineffabile.", "Un'emozione ineffabile."]
  }
]
```

➡️ basta aggiungere nuove entry con la data per arricchire il dizionario.

---

## ⚙️ Comandi rapidi

| Comando                   | Descrizione                           |
| ------------------------- | ------------------------------------- |
| `docker compose build`    | Builda l’immagine                     |
| `docker compose up`       | Avvia l’app in modalità sviluppo      |
| `docker compose down`     | Stoppa i container                    |
| `docker system prune -af` | Pulisce cache e immagini inutilizzate |

---

## 📌 TODO Futuri

* Archivio parole passate
* Notifiche push giornaliere
* Gamification (badge, streak giornalieri)
* Deploy su [Vercel](https://vercel.com/) o [Railway](https://railway.app/)
