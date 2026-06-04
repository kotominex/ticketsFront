import axios from 'axios'
import type { Ticket, User } from '../types'

const api = axios.create({
  baseURL: '/api',
})

export function setAuthHeader(userId: number | null) {
  if (userId) {
    api.defaults.headers.common['X-User-Id'] = String(userId)
  } else {
    delete api.defaults.headers.common['X-User-Id']
  }
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me')
  return data
}

export async function createTicket(body: {
  title: string
  description: string
  priority: string
}): Promise<Ticket> {
  const { data } = await api.post<Ticket>('/tickets', body)
  return data
}

export async function getMisTickets(): Promise<Ticket[]> {
  const { data } = await api.get<Ticket[]>('/tickets/mis-tickets')
  return data
}

export async function getAllTickets(): Promise<Ticket[]> {
  const { data } = await api.get<Ticket[]>('/tickets/todos')
  return data
}

export async function getTicketsAsignados(): Promise<Ticket[]> {
  const { data } = await api.get<Ticket[]>('/tickets/asignados')
  return data
}

export async function asignarTicket(id: number): Promise<Ticket> {
  const { data } = await api.put<Ticket>(`/tickets/${id}/asignar`)
  return data
}

export async function cambiarEstado(
  id: number,
  status: string
): Promise<Ticket> {
  const { data } = await api.put<Ticket>(`/tickets/${id}/estado`, { status })
  return data
}
