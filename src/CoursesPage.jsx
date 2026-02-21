import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // novo curso
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newModulesQty, setNewModulesQty] = useState(18);
  const [saving, setSaving] = useState(false);

  // edição
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editModulesQty, setEditModulesQty] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadCourses() {
    setError("");
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/course/list`, {
        method: "GET",
        credentials: "include",
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(data?.error || "Erro ao carregar cursos");
        setCourses([]);
        return;
      }

      setCourses(Array.isArray(data.courses) ? data.courses : []);
    } catch (e) {
      setError("Erro de rede ao carregar cursos");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  async function createCourse() {
    setError("");
    setSaving(true);
    try {
      const r = await fetch(`${API_BASE}/course/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newName,
          modulesQty: Number(newModulesQty),
        }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(data?.error || "Erro ao cadastrar curso");
        return;
      }

      setShowNew(false);
      setNewName("");
      setNewModulesQty(18);
      await loadCourses();
    } catch (e) {
      setError("Erro de rede ao cadastrar curso");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!editingId) return;

    setError("");
    setSavingEdit(true);
    try {
      const body = {};
      if (editName.trim()) body.name = editName.trim();
      if (String(editModulesQty).trim() !== "") body.modulesQty = Number(editModulesQty);

      const r = await fetch(`${API_BASE}/course/edit/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(data?.error || "Erro ao editar curso");
        return;
      }

      setEditingId(null);
      setEditName("");
      setEditModulesQty("");
      await loadCourses();
    } catch (e) {
      setError("Erro de rede ao editar curso");
    } finally {
      setSavingEdit(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Cursos</h2>

        <button
          type="button"
          onClick={() => setShowNew(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          + Adicionar novo curso
        </button>
      </div>

      {showNew ? (
        <div
          style={{
            marginTop: 14,
            padding: 14,
            border: "1px solid #eee",
            borderRadius: 12,
            display: "grid",
            gap: 10,
            maxWidth: 720,
          }}
        >
          <div style={{ fontWeight: 900 }}>Novo curso</div>

          <label style={{ display: "grid", gap: 6 }}>
            Nome do curso
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              placeholder="Ex: DIGETI - Doutorado Internacional em Gestão de Terapia Intensiva"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Número de módulos
            <input
              value={newModulesQty}
              onChange={(e) => setNewModulesQty(e.target.value)}
              type="number"
              min={1}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", width: 200 }}
            />
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={createCourse}
              disabled={saving}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                cursor: "pointer",
                fontWeight: 900,
              }}
            >
              {saving ? "SALVANDO..." : "SALVAR"}
            </button>

            <button
              type="button"
              onClick={() => setShowNew(false)}
              disabled={saving}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                cursor: "pointer",
                fontWeight: 800,
                opacity: 0.8,
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        {loading ? <div>Carregando...</div> : null}
        {error ? <div style={{ color: "#ff4d4f" }}>{error}</div> : null}

        {!loading && !error && courses.length === 0 ? <div>Nenhum curso cadastrado.</div> : null}

        {!loading && !error && courses.length > 0 ? (
          <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
            {courses.map((c) => (
              <div key={c.id} style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{c.name}</div>
                    <div style={{ opacity: 0.75, fontSize: 13 }}>Módulos: {c.modulesQty}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                      setEditModulesQty(c.modulesQty);
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    Editar
                  </button>
                </div>

                {editingId === c.id ? (
                  <div style={{ marginTop: 12, width: "100%", display: "grid", gap: 10 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      Nome
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                      />
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      Módulos
                      <input
                        type="number"
                        min={1}
                        value={editModulesQty}
                        onChange={(e) => setEditModulesQty(e.target.value)}
                        style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", width: 200 }}
                      />
                    </label>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={savingEdit}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: "1px solid #ddd",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                      >
                        {savingEdit ? "SALVANDO..." : "SALVAR"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        disabled={savingEdit}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: "1px solid #ddd",
                          cursor: "pointer",
                          fontWeight: 800,
                          opacity: 0.8,
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}