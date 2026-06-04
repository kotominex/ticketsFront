import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getMisTickets,
  getAllTickets,
  getTicketsAsignados,
  asignarTicket,
  cambiarEstado,
} from '../api/tickets'
import type { Ticket, TicketStatus } from '../types'

const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#6b7280',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
}

const STATUS_COLORS: Record<string, string> = {
  ABIERTO: '#3b82f6',
  EN_EJECUCION: '#f59e0b',
  CERRADO: '#22c55e',
}

const NEXT_STATUS: Record<TicketStatus, TicketStatus> = {
  ABIERTO: 'EN_EJECUCION',
  EN_EJECUCION: 'CERRADO',
  CERRADO: 'ABIERTO',
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'todos' | 'asignados'>('todos')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetch = async () => {
      setLoading(true)
      try {
        if (user.role === 'SOPORTE') {
          const data =
            tab === 'todos' ? await getAllTickets() : await getTicketsAsignados()
          setTickets(data)
        } else {
          const data = await getMisTickets()
          setTickets(data)
        }
      } catch {
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user, navigate, tab])

  const handleAsignar = async (id: number) => {
    try {
      await asignarTicket(id)
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, assignedTo: user } : t
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleCambiarEstado = async (id: number, current: TicketStatus) => {
    const next = NEXT_STATUS[current]
    try {
      await cambiarEstado(id, next)
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: next } : t))
      )
    } catch (err) {
      console.error(err)
    }
  }

  if (!user) return null

  const isSoporte = user.role === 'SOPORTE'

  return (
    <div className="page">
      <header className="header">
        <div>
          <strong>{user.name}</strong>
          <span className="badge">{user.role}</span>
        </div>
        <div className="header-actions">
          {!isSoporte && (
            <button className="btn-primary" onClick={() => navigate('/crear')}>
              + Nuevo Ticket
            </button>
          )}
          <button className="btn-ghost" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <main className="main">
        <h2>{isSoporte ? 'Panel de Soporte' : 'Mis Tickets'}</h2>

        {isSoporte && (
          <div className="tabs">
            <button
              className={tab === 'todos' ? 'active' : ''}
              onClick={() => setTab('todos')}
            >
              Todos
            </button>
            <button
              className={tab === 'asignados' ? 'active' : ''}
              onClick={() => setTab('asignados')}
            >
              Mis Asignados
            </button>
          </div>
        )}

        {loading ? (
          <p className="empty">Cargando...</p>
        ) : tickets.length === 0 ? (
          <p className="empty">
            {isSoporte
              ? 'No hay tickets registrados'
              : 'No tienes tickets. Crea uno nuevo.'}
          </p>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <h3>{ticket.title}</h3>
                  <div className="ticket-badges">
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: PRIORITY_COLORS[ticket.priority],
                      }}
                    >
                      {ticket.priority}
                    </span>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: STATUS_COLORS[ticket.status],
                      }}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>
                {ticket.description && (
                  <p className="ticket-desc">{ticket.description}</p>
                )}
                <div className="ticket-meta">
                  <span>Creado por: {ticket.createdBy.name}</span>
                  {ticket.assignedTo && (
                    <span>Asignado a: {ticket.assignedTo.name}</span>
                  )}
                </div>
                <div className="ticket-actions">
                  {isSoporte && !ticket.assignedTo && (
                    <button
                      className="btn-secondary"
                      onClick={() => handleAsignar(ticket.id)}
                    >
                      Asignarme
                    </button>
                  )}
                  {isSoporte && ticket.assignedTo?.id === user.id && (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        handleCambiarEstado(ticket.id, ticket.status)
                      }
                    >
                      Pasar a {NEXT_STATUS[ticket.status]}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
