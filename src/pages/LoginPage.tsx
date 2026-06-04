import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMe, setAuthHeader } from '../api/tickets'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const userId = Number(id)
    if (!userId) {
      setError('Ingresa un ID válido')
      return
    }

    setAuthHeader(userId)

    try {
      const user = await getMe()
      login(user)
      navigate('/dashboard')
    } catch {
      setAuthHeader(null)
      setError('Usuario no encontrado')
    }
  }

  return (
    <div className="page login-page">
      <div className="login-card">
        <h1>Tickets</h1>
        <p className="subtitle">Ingresa tu ID de usuario</p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="ID de usuario"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoFocus
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}
