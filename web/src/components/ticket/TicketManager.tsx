import { useState, useMemo } from 'react'
import { IoReceipt, IoChevronForward, IoCash, IoCard, IoTime } from 'react-icons/io5'
import { Card, CardContent } from '../custom/Card'
import { Badge } from '../custom/Badge'
import { Modal } from '../custom/Modal'
import { EmptyState } from '../custom/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { tickets } from '../../libs/mock-data'
import type { Ticket } from '../../types'

export default function TicketManager() {
  const { user } = useAuth()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const userTickets = useMemo(() => {
    return tickets.filter((t) => t.userId === user?.id)
  }, [user?.id])

  if (!user) {
    return (
      <EmptyState
        icon={IoReceipt}
        title="Inicia sesión"
        description="Necesitas iniciar sesión para ver tus tickets"
        action={{ label: 'Iniciar Sesión', onClick: () => window.location.href = '/login' }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">Mis Tickets</h1>
      <p className="mt-1 text-muted-foreground">Historial de tus órdenes anteriores</p>

      {userTickets.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={IoReceipt}
            title="No tienes tickets"
            description="Cuando realices una orden, tu ticket aparecerá aquí"
            action={{ label: 'Ver Restaurantes', onClick: () => window.location.href = '/restaurantes' }}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {userTickets.map((ticket) => (
            <Card
              key={ticket.id}
              hoverable
              className="cursor-pointer transition-colors"
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <IoReceipt className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{ticket.restaurantName}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IoTime className="h-4 w-4" />
                      {new Date(ticket.createdAt).toLocaleDateString('es-MX', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      {ticket.paymentMethod === 'cash' ? <IoCash className="h-4 w-4" /> : <IoCard className="h-4 w-4" />}
                      {ticket.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-foreground">${ticket.total}</p>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    {ticket.items.length} producto{ticket.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <IoChevronForward className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Detalle del Ticket"
        size="md"
      >
        {selectedTicket && (
          <div className="overflow-hidden rounded-lg shadow-sm">
            {/* Ticket Header */}
            <div className="bg-primary px-4 py-6 text-center text-primary-foreground">
              <h2 className="text-xl font-bold">{selectedTicket.restaurantName}</h2>
              <p className="mt-1 text-sm opacity-80">
                {new Date(selectedTicket.createdAt).toLocaleDateString('es-MX', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>

            {/* Top Perforation */}
            <div className="relative h-4 bg-card overflow-hidden">
              <div className="absolute -top-2 left-0 right-0 flex justify-between px-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 rounded-full bg-background" />
                ))}
              </div>
            </div>

            {/* Ticket Body */}
            <div className="bg-card px-6 py-4">
              <div className="border-b border-dashed border-border pb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-3">PRODUCTOS</p>
                {selectedTicket.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1 text-sm">
                    <span className="text-foreground">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-foreground font-medium">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-border py-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${selectedTicket.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA</span>
                  <span className="text-foreground">${selectedTicket.tax}</span>
                </div>
              </div>

              <div className="py-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">TOTAL</span>
                  <span className="text-xl font-bold text-primary">${selectedTicket.total}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-border pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Método de pago</span>
                  <Badge variant="secondary">
                    {selectedTicket.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}
                  </Badge>
                </div>
                {selectedTicket.paymentMethod === 'cash' && selectedTicket.cashReceived && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Efectivo recibido</span>
                      <span className="text-foreground">${selectedTicket.cashReceived}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cambio</span>
                      <span className="text-foreground">${selectedTicket.change}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 text-center pb-4">
                <p className="text-xs font-mono text-muted-foreground">Ticket #{selectedTicket.id}</p>
                <p className="mt-2 text-sm text-muted-foreground">¡Gracias por tu preferencia!</p>
              </div>
            </div>

            {/* Bottom Perforation */}
            <div className="relative h-4 bg-card overflow-hidden">
              <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 rounded-full bg-background" />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}