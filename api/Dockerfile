# Dockerfile
FROM node:20-alpine
WORKDIR /app

# Dépendances natives (Prisma + argon2)
RUN apk add --no-cache openssl libc6-compat python3 make g++

# Déps Node (lock si présent)
COPY package*.json ./
RUN npm ci

# Code + Prisma + TS config
COPY tsconfig.json ./tsconfig.json
COPY prisma ./prisma
COPY src ./src

# Génère Prisma Client
RUN npx prisma generate

COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
#ENTRYPOINT ["/run.sh"]

