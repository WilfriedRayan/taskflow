// API TaskFlow - version 1 (données en mémoire).
// PostgreSQL et Redis arriveront dans les prochains épisodes.
const express = require("express");
const os = require("os");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
let tasks = [
  { id: 1, title: "Installer Docker", done: true },
  { id: 2, title: "Écrire mon premier Dockerfile", done: false },
];

// Vérification de santé : utilisée plus tard par Docker et Swarm
app.get("/health", (req, res) => {
  res.json({ status: "ok", hostname: os.hostname() });
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`TaskFlow API démarrée sur le port ${PORT}`);
});
