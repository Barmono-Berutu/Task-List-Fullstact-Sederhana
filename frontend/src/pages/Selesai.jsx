import React, { useEffect, useState } from "react";

export default function Selesai() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/selesai", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  const hapus = (id) => {
    fetch(`http://localhost:5000/api/selesai/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body">
              <h3
                className="text-center fw-bold text-uppercase mb-4"
                style={{ letterSpacing: "2px", color: "#4f46e5" }}
              >
                <i
                  className="bi bi-check-circle-fill me-2"
                  style={{ color: "#22c55e" }}
                ></i>
                Daftar Tugas Selesai
              </h3>
              <div className="table-responsive">
                <table className="table align-middle table-hover table-bordered rounded-3 overflow-hidden">
                  <thead className="table-primary">
                    <tr>
                      <th style={{ width: "5%" }}>No</th>
                      <th style={{ width: "20%" }}>Nama</th>
                      <th style={{ width: "35%" }}>Tugas</th>
                      <th style={{ width: "20%" }}>Waktu</th>
                      <th style={{ width: "20%" }}>Menu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          <i className="bi bi-inbox-fill fs-3"></i>
                          <div className="mt-2">Belum ada tugas selesai.</div>
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task, i) => (
                        <tr key={task.id} className="align-middle">
                          <td className="fw-semibold">{i + 1}</td>
                          <td>
                            <span className="badge bg-success bg-opacity-25 text-success px-3 py-2 rounded-pill">
                              {task.nama}
                            </span>
                          </td>
                          <td className="text-start">{task.namaTugas}</td>
                          <td>
                            <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-2 rounded-pill">
                              {task.waktu}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              onClick={() => hapus(task.id)}
                            >
                              <i className="bi bi-trash-fill"></i>&nbsp;Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
