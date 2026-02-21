import React from "react";
import "./Sidebar.css";

export default function Sidebar({
  active = "courses",
  onGoCourses,
  onGoClasses,
  classesDisabled = false,
}) {
  return (
    <aside className="sb">
      <div className="sb__brand">Plataforma</div>

      <nav className="sb__nav">
        <button
          className={`sb__item ${active === "courses" ? "is-active" : ""}`}
          onClick={onGoCourses}
          type="button"
        >
          <span className="sb__icon" aria-hidden="true">
            📚
          </span>
          <span className="sb__text">Cursos</span>
        </button>

        <button
          className={`sb__item ${active === "classes" ? "is-active" : ""}`}
          onClick={onGoClasses}
          type="button"
          disabled={classesDisabled}
          title={classesDisabled ? "Selecione um curso primeiro" : "Abrir Turmas"}
        >
          <span className="sb__icon" aria-hidden="true">
            👥
          </span>
          <span className="sb__text">Turmas</span>
        </button>
      </nav>

      <div className="sb__footer">
        <div className="sb__hint">© {new Date().getFullYear()}</div>
      </div>
    </aside>
  );
}