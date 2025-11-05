# Transcendence2

> Backend **Fastify + Prisma**, proxy **Nginx** en **HTTPS** (certifs autosignés), et un petit **frontend** (HTML/CSS/TS) dans `web/`. Auth locale **et** OAuth **Google**. Déploiement via **Docker Compose**.

---

## Démarrage rapide

### Avec Docker

```bash
# 1) Variables d’env
cp .env.example .env

# 2) Certificat autosigné (si absent)
./certs-init.sh   # ou déposez vos certs dans ./certs

# 3) Build + run
docker compose up -d --build

# 4) Logs ciblés
docker compose logs -f api

# 5) Ouvrir l’app
# Frontend (servi par Nginx) et API via proxy
open https://localhost:8443/  # acceptez l’avertissement TLS autosigné
```

### Sans Docker (dev local)

```bash
# Installer deps
npm ci

# Générer Prisma Client
npx prisma generate

# Appliquer migrations (option dev)
npx prisma migrate deploy

# Lancer l’API (ex: tsx/vite-node selon scripts)
npm run dev

# Frontend
# Servez ./web/ via un serveur statique (ou laissez Nginx en Docker s’en charger)
```

---

## Aperçu

**Transcendence** est une base d’app pour un mini‑service web : API Node/TypeScript propulsée par **Fastify**, persistance via **Prisma** (SQLite par défaut, Postgres possible), **Nginx** en frontal (TLS), et un **frontend** léger situé dans `web/`.

Points clés : Auth **locale** + **Google OAuth**, routes utilisateurs, schéma Prisma versionné par migrations, orchestration Docker simple.

## Fonctionnalités

* Auth locale (`/auth/*`) et **OAuth Google** (`/auth/google`, callback dédié)
* Endpoints utilisateurs (`/users/*`) protégés par un **guard**
* Proxy **Nginx** en **HTTPS** (certificat autosigné pour le dev)
* Frontend minimal (HTML/CSS/TS) servi par Nginx

## Architecture

```
                +---------------------+
                |      Frontend       |
                |     web/index.html  |
                +----------+----------+
                           |  HTTPS (443)
+-----------+     +--------v---------+      +------------------+
|  Nginx    |<--->|   Backend API    |<---->|   Database (ORM) |
|  :443 TLS |     |  Fastify :3000   |      | Prisma (SQLite/ |
|  certs/   |     +------------------+      | Postgres)       |
+-----------+                                   ^
                                                |
                                           prisma/schema
```

* **Ports** : Nginx écoute en `443` et reverse‑proxy vers l’API (`:3000`).
* **Callback OAuth** : exposé publiquement via Nginx (`GOOGLE_CALLBACK_URL`).
* **Certifs dev** : `certs/selfsigned.crt` & `certs/selfsigned.key`.

## Stack & prérequis

* **Langages** : TypeScript 5, HTML/CSS
* **Runtime** : Node.js ≥ 20
* **API** : Fastify
* **ORM** : Prisma
* **DB** : SQLite par défaut (fichier), Postgres possible via `DATABASE_URL`
* **Proxy** : Nginx (TLS)
* **Infra** : Docker & Docker Compose
* **Outils** : ESLint, Prettier, Prisma CLI

---

## Configuration (.env)

| Variable               | Exemple                                  | Description                             |
| ---------------------- | ---------------------------------------- | --------------------------------------- |
| `NODE_ENV`             | `development`                            | Environnement d’exécution               |
| `PORT`                 | `3000`                                   | Port HTTP de Fastify                    |
| `DATABASE_URL`         | `file:./prisma/dev.db`                   | URL Prisma (SQLite par défaut)          |
| `JWT_SECRET`           | `change-me`                              | Secret pour signer les JWT (si utilisé) |
| `SESSION_SECRET`       | `another-secret`                         | Secret cookies/sessions (si utilisé)    |
| `CORS_ORIGIN`          | `https://localhost`                      | Origine autorisée côté front            |
| `GOOGLE_CLIENT_ID`     | `xxxx.apps.googleusercontent.com`        | OAuth Google                            |
| `GOOGLE_CLIENT_SECRET` | `xxxxx`                                  | OAuth Google                            |
| `GOOGLE_CALLBACK_URL`  | `https://localhost/auth/google/callback` | URL publique de callback via Nginx      |
| `SSL_CERT_FILE`        | `./certs/selfsigned.crt`                 | Chemin cert TLS pour Nginx              |
| `SSL_KEY_FILE`         | `./certs/selfsigned.key`                 | Chemin clé TLS pour Nginx               |

### Exemple `.env.example`

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=change-me
SESSION_SECRET=change-me-too
CORS_ORIGIN=https://localhost
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://localhost/auth/google/callback
SSL_CERT_FILE=./certs/selfsigned.crt
SSL_KEY_FILE=./certs/selfsigned.key
```

> Pour **Postgres** : `DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public`.

---

## Scripts NPM

> Ajustez selon votre `package.json`.

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc -p .",
    "start": "node dist/main.js",
    "lint": "eslint .",
    "format": "prettier -w .",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio"
  }
}
```

---

## Structure du dépôt

```
.
├── certs/
│   ├── selfsigned.crt
│   └── selfsigned.key
├── certs-init.sh
├── cookiejar.txt
├── cookies.txt
├── docker-compose.yml
├── Dockerfile
├── .gitignore
├── nginx.conf
├── package.json
├── package-lock.json
├── prisma/
│   ├── migrations/
│   │   ├── 20250911125639_init/
│   │   │   └── migration.sql
│   │   ├── 20250911143513_add_lower_cols_optional/
│   │   │   └── migration.sql
│   │   ├── 20250911143714_lower_cols_required_unique/
│   │   │   └── migration.sql
│   │   ├── 20250916150447_add_oauth/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── README.md
├── src/
│   ├── main.ts
│   ├── plugins/
│   │   └── auth-guard.ts
│   └── routes/
│       ├── auth-google.ts
│
```

---

// package.json (ANNOTÉ — JSONC, non valide pour npm)
{
  // Nom du package (backend uniquement)
  "name": "transcendence-backend",

  // Version interne (pas publiée, le package est private)
  "version": "0.1.0",

  // Empêche toute publication accidentelle sur npm
  "private": true,

  // Sortie Node au format ESM (import/export)
  "type": "module",

  "scripts": {
    // Dev: exécute le code TypeScript à la volée avec tsx en mode watch
    "dev": "tsx watch src/main.ts",

    // Build: compile TS -> dist + génère le client Prisma
    // ⚠️ Typiquement on exécute "prisma generate" AVANT tsc pour disposer des types à la compile
    "build": "tsc -p tsconfig.json && prisma generate",

    // Prod: lance le JS compilé
    "start": "node dist/main.js",

    // Prisma utilitaires
    "prisma:generate": "prisma generate",
    // Crée une nouvelle migration à partir du schema.prisma (dev local)
    "prisma:migrate": "prisma migrate dev --name init",
    // Applique les migrations existantes (CI/Prod)
    "prisma:deploy": "prisma migrate deploy",

    // Frontend minimal (bundlé avec esbuild dans web/dist/main.js)
    "web:build": "esbuild web/main.ts --bundle --outfile=web/dist/main.js --platform=browser --format=esm --target=es2020",
    "web:watch": "esbuild web/main.ts --bundle --outfile=web/dist/main.js --platform=browser --format=esm --target=es2020 --watch"
  },

  "dependencies": {
    // Fastify cœur HTTP
    "fastify": "^4.29.1",
    // CORS et cookies (sessions/jwt en cookie)
    "@fastify/cors": "^8.5.0",
    "@fastify/cookie": "^9.4.0",

    // AuthZ/signature JWT et JOSE
    "jose": "^5.9.3",

    // Validation de payloads
    "zod": "^3.23.8",

    // Hash de mots de passe (module natif : requiert toolchain en build)
    "argon2": "^0.41.1",

    // ORM + client généré (versions alignées)
    "@prisma/client": "^5.18.0"
  },

  "devDependencies": {
    // TypeScript + exécution TS à chaud
    "typescript": "^5.5.4",
    "tsx": "^4.19.0",

    // Bundler frontend
    "esbuild": "^0.25.9",

    // Prisma CLI (doit matcher la version du client)
    "prisma": "^5.18.0",

    // Types Node (attention à la cohérence avec ta version Node réelle)
    "@types/node": "^22.5.0"
  }
}
