import { useState } from "react"
import "./App.css"

export default function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function onSubmit(e) {
    e.preventDefault()
    alert(`Email: ${email}\nSenha: ${password}`)
  }

 return (
  <div className="page">
    <div className="card">
      <h1 className="title">PLATAFORMA DO ESTUDANTE</h1>
      <p className="subtitle">MBA • MESTRADO • DOUTORADO</p>
      <div className="login-title">LOGIN</div>

      <form className="form" onSubmit={onSubmit}>
        <label className="label">
          Usuário
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>

        <label className="label">
          Senha
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </label>

        <button className="btn" type="submit">ENTRAR</button>
      </form>
    </div>
  </div>
)

}