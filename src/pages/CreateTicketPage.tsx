import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createTicket } from '../api/tickets'

export default function CreateTicketPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [error, setError] = useState('')

  if (!user || user.role !== 'USUARIO') {
    navigate('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }

    try {
      await createTicket({ title, description, priority })
      navigate('/dashboard')
    } catch {
      setError('Error al crear el ticket')
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <strong>{user.name}</strong>
          <span className="badge">{user.role}</span>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/dashboard')}>
          Volver
        </button>
      </header>

      <main className="main">
        <h2>Nuevo Ticket</h2>
        <form className="ticket-form" onSubmit={handleSubmit}>
          <label>
            Título
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Error al iniciar sesión"
              autoFocus
            />
          </label>
          <label>
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el problema..."
              rows={4}
            />
          </label>
          <label>
            Prioridad
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">
            Crear Ticket
          </button>
        </form>
      </main>
    </div>
  )
}
