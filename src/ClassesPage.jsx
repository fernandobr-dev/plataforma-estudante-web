import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState("");

  // pesquisa
  const [q, setQ] = useState("");

  // modal/form novo
  const [showNew, setShowNew] = useState(false);
  const [newCourseId, setNewCourseId] = useState("");
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [saving, setSaving] = useState(false);

  async function loadClasses() {
    setError("");
    setLoading(true);

    try {
      const r = await fetch(`${API_BASE}/class/list`, {
        method: "GET",
        credentials: "include",
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(data?.error || "Erro ao carregar turmas");
        setClasses([]);
        return;
      }

      setClasses(Array.isArray(data.classes) ? data.classes : []);
    } catch (e) {
      setError("Erro de rede ao carregar turmas");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCourses() {
    setLoadingCourses(true);
    try {
      const r = await fetch(`${API_BASE}/course/list`, {
        method: "GET",
        credentials: "include",
      });

      const data = await r.json().catch(() => ({}));
      if (r.ok) setCourses(Array.isArray(data.courses) ? data.courses : []);
    } finally {
      setLoadingCourses(false);
    }
  }

  async function createClass() {
    setError("");

    if (!newCourseId) {
      setError("Selecione um curso");
      return;
    }

    if (!String(newYear).trim()) {
      setError("Informe o ano");
      return;
    }

    setSaving(true);
    try {
      const r = await fetch(`${API_BASE}/class/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: newCourseId,
          year: Number(newYear),
        }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(data?.error || "Erro ao criar turma");
        return;
      }

      setShowNew(false);
      setNewCourseId("");
      setNewYear(new Date().getFullYear());
      await loadClasses();
    } catch (e) {
      setError("Erro de rede ao criar turma");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadClasses();
    loadCourses();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return classes;

    return classes.filter((c) => {
      const className = String(c.className || "").toLowerCase();
      const courseName = String(c.course?.name || "").toLowerCase();
      const year = String(c.year ?? "").toLowerCase();

      return className.includes(term) || courseName.includes(term) || year.includes(term);
    });
  }, [classes, q]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Turmas</h2>

        <button
          type="button"
          onClick={() => setShowNew(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          + Criar Nova Turma
        </button>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar por turma, curso ou ano..."
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 280,
            flex: "1 1 320px",
          }}
        />

        <button
          type="button"
          onClick={loadClasses}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            fontWeight: 800,
            background: "#fff",
          }}
        >
          Recarregar
        </button>
      </div>

      {error ? <div style={{ color: "#ff4d4f", marginTop: 10 }}>{error}</div> : null}

      <div style={{ marginTop: 16 }}>
        {loading ? <div>Carregando...</div> : null}

        {!loading && filtered.length === 0 ? <div>Nenhuma turma encontrada.</div> : null}

        {!loading && filtered.length > 0 ? (
          <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
            {filtered.map((c) => (
              <div key={c.id} style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{c.className}</div>
                    <div style={{ opacity: 0.75, fontSize: 13 }}>
                      Curso: {c.course?.name || "-"} • Ano: {c.year}
                    </div>
                  </div>

                  {/* depois você coloca editar / detalhes aqui */}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* modal simples */}
      {showNew ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            padding: 14,
            zIndex: 50,
          }}
          onClick={() => (saving ? null : setShowNew(false))}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #eee",
              padding: 14,
              display: "grid",
              gap: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 900, fontSize: 16 }}>Criar Nova Turma</div>

            <label style={{ display: "grid", gap: 6 }}>
              Curso
              <select
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                disabled={loadingCourses || saving}
                style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              >
                <option value="">{loadingCourses ? "Carregando cursos..." : "Selecione um curso"}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Ano
              <input
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                type="number"
                min={2000}
                max={2100}
                disabled={saving}
                style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", width: 200 }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button
                type="button"
                onClick={createClass}
                disabled={saving}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                {saving ? "SALVANDO..." : "CRIAR TURMA"}
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

            <div style={{ fontSize: 12, opacity: 0.7 }}>
              O nome da turma será gerado automaticamente no backend: <b>NOME DO CURSO-ON-ANO</b>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}