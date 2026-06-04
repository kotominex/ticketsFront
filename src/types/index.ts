export type Role = 'USUARIO' | 'SOPORTE'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type TicketStatus = 'ABIERTO' | 'EN_EJECUCION' | 'CERRADO'

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface Ticket {
  id: number
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  createdBy: User
  assignedTo: User | null
  createdAt: string
  updatedAt: string
}
