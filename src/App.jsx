import { useEffect, useState } from "react";
import "./App.css";
import CoursesPage from "./CoursesPage.jsx";
import ClassesPage from "./ClassesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [error, setError] = useState("");

  const [activePage, setActivePage] = useState("courses"); // "courses" | "classes"

  useEffect(() => {
    (async () => {
      try {
        setLoadingMe(true);
        const r = await fetch(`${API_BASE}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (r.ok) {
          const data = await r.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoadingMe(false);
      }
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoadingLogin(true);

    try {
      const r = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(data?.error || "Falha no login");
        setLoadingLogin(false);
        return;
      }

      setUser(data.user);
      setPassword("");
    } catch (e) {
      setError("Erro de rede ao tentar logar");
    } finally {
      setLoadingLogin(false);
    }
  }

  async function logout() {
    setError("");
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setActivePage("courses");
    }
  }

  function goCourses() {
    setActivePage("courses");
  }

  function goClasses() {
    setActivePage("classes");
  }

  if (loadingMe) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ padding: 24, border: "1px solid #ddd", borderRadius: 12 }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex" }}>
        <Sidebar active={activePage} onGoCourses={goCourses} onGoClasses={goClasses} classesDisabled={false} />

        <main style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid #eee",
              background: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ fontWeight: 900 }}>{activePage === "courses" ? "Cursos" : "Turmas"}</div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>{user?.email}</div>
            </div>

            <button
              onClick={logout}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #ddd",
                cursor: "pointer",
                fontWeight: 800,
                background: "#fff",
              }}
            >
              SAIR
            </button>
          </div>

          <div style={{ padding: 18 }}>
            {activePage === "courses" ? <CoursesPage /> : <ClassesPage />}
          </div>
        </main>
      </div>
    );
  }

  // login
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ padding: 24, border: "1px solid #ddd", borderRadius: 12, minWidth: 320 }}>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>Login</h1>
        <div style={{ opacity: 0.7, marginBottom: 16, fontSize: 13 }}>API: {API_BASE}</div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Usuário (email)
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Senha
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </label>

          {error ? <div style={{ color: "#ff4d4f", fontSize: 13 }}>{error}</div> : null}

          <button
            type="submit"
            disabled={loadingLogin}
            style={{
              marginTop: 6,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {loadingLogin ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>
      </div>
    </div>
  );
}