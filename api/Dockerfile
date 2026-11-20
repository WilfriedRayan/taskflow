# 1. Image de base officielle, légère, avec une version fixée
FROM node:22-alpine

# 2. Dossier de travail dans l'image
WORKDIR /app

# 3. On copie d'abord les fichiers de dépendances (optimise le cache)
COPY package*.json ./

# 4. Installation des dépendances de production uniquement
RUN npm ci --omit=dev

# 5. Puis le code source
COPY . .

# 6. Configuration et documentation du port
ENV PORT=3000
EXPOSE 3000

# 7. Sécurité : on n'exécute pas l'application en root
USER node

# 8. Commande lancée au démarrage du conteneur
CMD ["node", "server.js"]
