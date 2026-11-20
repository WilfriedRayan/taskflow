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

# 6. Configuration (modifiable avec "docker run -e") et documentation du port
ENV PORT=3000 \
    APP_ENV=production
EXPOSE 3000

# 7. Sécurité : on n'exécute pas l'application en root
USER node

# 8. Docker vérifie toutes les 30 s que l'API répond (statut "healthy" / "unhealthy")
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# 9. Commande lancée au démarrage du conteneur (forme exec : reçoit bien SIGTERM)
CMD ["node", "server.js"]
