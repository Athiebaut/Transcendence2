# Dockerfile
FROM node:20-alpine
WORKDIR /app


# Dépendances natives nécessaires (Prisma + argon2)
RUN apk add --no-cache openssl libc6-compat python3 make g++


# Déps Node
COPY package*.json ./
RUN npm ci


# Code + Prisma
COPY . .
RUN npx prisma generate


EXPOSE 3000
CMD ["npm", "run", "dev"] # en prod: préfère "node dist/main.js"
