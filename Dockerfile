# Dockerfile
FROM node:20-alpine
WORKDIR /app

# 🔧 Librairies nécessaires à Prisma & argon2 sur Alpine
RUN apk add --no-cache openssl libc6-compat python3 make g++


# Dépendances Node
COPY package*.json ./
RUN npm ci     # ou npm install si tu n'utilises pas le lockfile

# Code + Prisma
COPY . .
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
