# Transcendence — Backend (Fastify/TS/SQLite)

## Démarrage rapide

1. Copie `.env.example` en `.env` (tu peux garder les valeurs par défaut pour v0)
2. Lancer les migrations et le serveur en mode dev :

```bash
# première fois (génère la DB et le client Prisma)
docker compose run --rm api npm run prisma:migrate
# lancer le service
docker compose up --build