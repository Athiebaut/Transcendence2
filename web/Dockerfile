# Utiliser Debian plutôt qu'Alpine pour éviter les problèmes de permissions
FROM node:20-bullseye

# Dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Commande pour lancer le serveur de dev avec hot reload
CMD ["npm", "run", "dev", "--", "--host"]
