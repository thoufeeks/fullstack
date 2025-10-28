const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("feedback.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT, createdAt TEXT)");
});

app.post("/api/feedback", (req, res) => {
  const { name, message } = req.body;
  const createdAt = new Date().toISOString();
  db.run("INSERT INTO feedback (name, message, createdAt) VALUES (?, ?, ?)", [name, message, createdAt], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

app.get("/api/feedback", (req, res) => {
  db.all("SELECT * FROM feedback ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
