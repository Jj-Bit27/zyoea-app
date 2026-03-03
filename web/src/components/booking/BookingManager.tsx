import { useState, useMemo } from 'react'
import { IoAdd, IoCalendar, IoTrash, IoTime, IoPeople } from 'react-icons/io5'
import { Card, CardContent } from '../custom/Card'
import { Button } from '../custom/Button'
import { Badge } from '../custom/Badge'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../custom/Modal'
import { Input } from '../custom/Input'
import { Select } from '../custom/Select'
import { Textarea } from '../custom/Textarea'
import { EmptyState } from '../custom/EmptyState'
import { Spinner } from '../custom/Spinner'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../custom/Toast'
import { useRestaurants } from '../../hooks/useRestaurants'
import { useBookings } from '../../hooks/useBookings'
import { ApolloWrapper } from '../ApolloWrapper'

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'destructive',
  completed: 'secondary',
} as const

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
}

function BookingManagerContent() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { restaurants, loading: loadingRestaurants } = useRestaurants()

  const [selectedRestaurantId, setSelectedRestaurantId] = useState('')
  const { bookings, createBooking } = useBookings(selectedRestaurantId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    restaurantId: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
    tableId: '1',
  })

  const userBookings = useMemo(() => {
    return bookings.filter((b: any) => String(b.userId) === user?.id)
  }, [bookings, user?.id])

  const restaurantOptions = [
    { value: '', label: 'Selecciona un restaurante' },
    ...restaurants.map((r: any) => ({ value: r.id, label: r.name })),
  ]

  const timeOptions = [
    { value: '12:00', label: '12:00 PM' }, { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' }, { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' }, { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' },
  ]

  const guestOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} persona${i > 0 ? 's' : ''}`,
  }))

  if (!user) {
    return (
      <EmptyState
        icon={IoCalendar}
        title="Inicia sesión"
        description="Necesitas iniciar sesión para ver tus reservaciones"
        action={{ label: 'Iniciar Sesión', onClick: () => window.location.href = '/login' }}
      />
    )
  }

  const handleSubmit = () => {
    if (!formData.restaurantId || !formData.date || !formData.time) {
      showToast('Completa todos los campos requeridos', 'error')
      return
    }

    const timeString = `${formData.date}T${formData.time}:00Z`
    createBooking({
      restaurant: parseInt(formData.restaurantId),
      user: parseInt(user.id),
      table: parseInt(formData.tableId),
      people: parseInt(formData.guests),
      time: timeString,
      status: 'pending',
    })
    setSelectedRestaurantId(formData.restaurantId)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Reservaciones</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <IoAdd /> Nueva Reserva
        </Button>
      </div>

      {loadingRestaurants ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : userBookings.length === 0 ? (
        <EmptyState
          icon={IoCalendar}
          title="No tienes reservaciones"
          description="Crea tu primera reservación en alguno de nuestros restaurantes"
          action={{ label: 'Crear Reservación', onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <div className="space-y-4">
          {userBookings.map((booking: any) => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">Restaurante #{booking.restaurantId}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IoCalendar size={14} />
                        {booking.time ? new Date(booking.time).toLocaleDateString('es-MX') : '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <IoTime size={14} />
                        {booking.time ? new Date(booking.time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <IoPeople size={14} />
                        {booking.people} personas
                      </span>
                    </div>
                  </div>
                  <Badge variant={(statusColors as any)[booking.status] || 'secondary'}>
                    {statusLabels[booking.status] || booking.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>Nueva Reservación</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Select
              label="Restaurante"
              value={formData.restaurantId}
              onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
              options={restaurantOptions}
            />
            <Input label="Fecha" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <Select label="Hora" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} options={timeOptions} />
            <Select label="Número de personas" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} options={guestOptions} />
            <Input label="Número de Mesa" type="number" value={formData.tableId} onChange={(e) => setFormData({ ...formData, tableId: e.target.value })} placeholder="1" />
            <Textarea label="Notas especiales (opcional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Alergias, ocasión especial..." />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar Reservación</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default function BookingManager() {
  return (
    <ApolloWrapper>
      <BookingManagerContent />
    </ApolloWrapper>
  )
}

