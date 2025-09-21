import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Tambah() {
  const [nama, setNama] = useState("");
  const [namaTugas, setNamaTugas] = useState("");
  const [waktu, setWaktu] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nama, namaTugas, waktu }),
    })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: 500, width: "100%", borderRadius: 20 }}
      >
        <h3
          className="text-center fw-bold text-uppercase mb-4"
          style={{ letterSpacing: 2, color: "#4f46e5" }}
        >
          Tambah Daftar Tugas
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ color: "#6366f1" }}
            >
              Nama
            </label>
            <input
              className="form-control form-control-lg rounded-pill"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ color: "#6366f1" }}
            >
              Nama Tugas
            </label>
            <input
              className="form-control form-control-lg rounded-pill"
              value={namaTugas}
              onChange={(e) => setNamaTugas(e.target.value)}
              placeholder="Masukkan nama tugas"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ color: "#6366f1" }}
            >
              Waktu
            </label>
            <input
              type="time"
              className="form-control form-control-lg rounded-pill"
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link
              to="/"
              className="btn btn-outline-secondary rounded-pill px-4 py-2"
            >
              Kembali
            </Link>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 py-2 shadow-sm"
              style={{
                background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                border: "none",
              }}
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
