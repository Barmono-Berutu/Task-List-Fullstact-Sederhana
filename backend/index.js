import express from "express";
import Task from "./models/Task.js";
import siap from "./models/siaps.js";
import user from "./models/users.js";
import session from "express-session";
import { sequelize } from "./database/database.js";
import bcrypt from "bcrypt";
import cors from "cors";
import { Op } from "sequelize";

const app = express();

// ====================== MIDDLEWARE ======================

// Support JSON & URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // alamat frontend
    credentials: true, // supaya cookie bisa dikirim
  })
);

// Session
app.use(
  session({
    secret: "iasdsad212312dsf123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 jam
  })
);

// Middleware cek login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized, silakan login dulu" });
  }
  next();
}

// ====================== AUTH ======================

// Register
app.post("/api/regis", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newUser = await user.create({ username, password: hash });
    res.json({ message: "Registrasi berhasil", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Registrasi gagal", error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const found = await user.findOne({ where: { username } });

    if (!found)
      return res.status(400).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, found.password);
    if (!match) return res.status(400).json({ message: "Password salah" });

    req.session.user = { id: found.id, username: found.username };
    res.json({ message: "Login berhasil", user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: "Login gagal", error: err.message });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout gagal" });
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "Logout berhasil" });
  });
});

// Get current user
app.get("/api/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Belum login" });
  }
});

// ====================== TASK ======================

// Ambil semua task
app.get("/api/tasks", requireLogin, async (req, res) => {
  try {
    const data = await Task.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah task
app.post("/api/tasks", requireLogin, async (req, res) => {
  try {
    const { nama, namaTugas, waktu } = req.body;
    const task = await Task.create({ nama, namaTugas, waktu });
    res.json({ message: "Task berhasil ditambahkan", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit task
app.put("/api/tasks/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, namaTugas, waktu } = req.body;

    await Task.update({ nama, namaTugas, waktu }, { where: { id } });
    res.json({ message: "Task berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus task
app.delete("/api/tasks/:id", requireLogin, async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });
    res.json({ message: "Task berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cari task berdasarkan query
app.get("/api/tasks/search", requireLogin, async (req, res) => {
  try {
    const { q } = req.query; // query string ?q=keyword
    const data = await Task.findAll({
      where: {
        [Op.or]: [
          { nama: { [Op.like]: `%${q}%` } },
          { namaTugas: { [Op.like]: `%${q}%` } },
        ],
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ambil detail task
app.get("/api/tasks/:id/detail", requireLogin, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: "Task tidak ditemukan" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== TASK SELESAI ======================

// Ambil semua task selesai
app.get("/api/selesai", requireLogin, async (req, res) => {
  try {
    const data = await siap.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tandai task selesai
app.post("/api/selesai/:id", requireLogin, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: "Task tidak ditemukan" });

    await siap.create({
      nama: task.nama,
      namaTugas: task.namaTugas,
      waktu: task.waktu,
    });

    await Task.destroy({ where: { id: req.params.id } });

    res.json({ message: "Task selesai dipindahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus task selesai
app.delete("/api/selesai/:id", requireLogin, async (req, res) => {
  try {
    await siap.destroy({ where: { id: req.params.id } });
    res.json({ message: "Task selesai berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== RUN SERVER ======================
sequelize.sync({ alter: true }).then(() => {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
});
