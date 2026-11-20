// API TaskFlow - version 2 (données en mémoire).
// PostgreSQL et Redis arriveront dans les prochains épisodes.
const express = require("express");
const os = require("os");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const APP_ENV = process.env.APP_ENV || "development";

let tasks = [
  { id: 1, title: "Installer Docker", done: true },
  { id: 2, title: "Écrire mon premier Dockerfile", done: true },
  { id: 3, title: "Maîtriser le cycle de vie des conteneurs", done: false },
];

// Vérification de santé : utilisée par le HEALTHCHECK du Dockerfile (et plus tard par Swarm)
app.get("/health", (req, res) => {
  res.json({ status: "ok", env: APP_ENV, hostname: os.hostname() });
});

app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/tasks", (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: "Le champ 'title' est obligatoire" });
  const task = { id: Date.now(), title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// 0.0.0.0 : indispensable pour être joignable depuis l'extérieur du conteneur
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`TaskFlow API démarrée sur le port ${PORT} (env: ${APP_ENV})`);
});

// Arrêt propre : "docker stop" envoie SIGTERM au processus principal (PID 1).
// On termine les requêtes en cours avant de quitter, au lieu d'être tué au bout de 10 s.
function shutdown(signal) {
  console.log(`${signal} reçu : arrêt propre en cours...`);
  server.close(() => {
    console.log("Serveur arrêté proprement.");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 8000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
