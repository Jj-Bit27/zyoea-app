import { useState, useMemo } from 'react'
import { IoAdd, IoCalendar, IoPencil, IoTrash, IoTime, IoPeople } from 'react-icons/io5'
import { Card, CardContent } from '../custom/Card'
import { Button } from '../custom/Button'
import { Badge } from '../custom/Badge'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../custom/Modal'
import { Input } from '../custom/Input'
import { Select } from '../custom/Select'
import { Textarea } from '../custom/Textarea'
import { EmptyState } from '../custom/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../custom/Toast'
import { reservations as initialReservations, restaurants } from '../../libs/mock-data'
import type { Reservation } from '../../types'

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'destructive',
  completed: 'secondary',
} as const

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
}

export default function BookingManager() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [formData, setFormData] = useState({
    restaurantId: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  })

  const userReservations = useMemo(() => {
    return reservations.filter((r) => r.userId === user?.id)
  }, [reservations, user?.id])

  const restaurantOptions = restaurants.map((r) => ({ value: r.id, label: r.name }))
  const timeOptions = [
    { value: '12:00', label: '12:00 PM' }, { value: '13:00', label: '1:00 PM' },
    { value: '18:00', label: '6:00 PM' }, { value: '20:00', label: '8:00 PM' },
  ] // ... (resto de opciones igual)

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

  const handleOpenModal = (reservation?: Reservation) => {
    if (reservation) {
      setEditingReservation(reservation)
      setFormData({
        restaurantId: reservation.restaurantId,
        date: new Date(reservation.date).toISOString().split('T')[0],
        time: reservation.time,
        guests: String(reservation.guests),
        notes: reservation.notes || '',
      })
    } else {
      setEditingReservation(null)
      setFormData({ restaurantId: '', date: '', time: '', guests: '2', notes: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.restaurantId || !formData.date || !formData.time) {
      showToast('Completa todos los campos requeridos', 'error')
      return
    }

    const restaurant = restaurants.find((r) => r.id === formData.restaurantId)

    if (editingReservation) {
      setReservations(reservations.map((r) => r.id === editingReservation.id ? { ...r, ...formData, guests: Number(formData.guests), date: new Date(formData.date), restaurant } : r))
      showToast('Reservación actualizada', 'success')
    } else {
      const newReservation: any = { id: Date.now().toString(), userId: user.id, ...formData, restaurant, guests: Number(formData.guests), date: new Date(formData.date), status: 'pending', createdAt: new Date() }
      setReservations([newReservation, ...reservations])
      showToast('Reservación creada', 'success')
    }
    setIsModalOpen(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Reservaciones</h1>
          <p className="text-muted-foreground">Administra tus reservaciones en restaurantes</p>
        </div>
        <Button onClick={() => handleOpenModal()}><IoAdd /> Nueva Reservación</Button>
      </div>

      {userReservations.length === 0 ? (
        <EmptyState icon={IoCalendar} title="No tienes reservaciones" description="Crea tu primera reservación aquí" action={{ label: 'Nueva Reservación', onClick: () => handleOpenModal() }} />
      ) : (
        <div className="space-y-4">
          {userReservations.map((res) => (
            <Card key={res.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{res.restaurant?.name}</h3>
                    <Badge variant={statusColors[res.status]}>{statusLabels[res.status]}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><IoCalendar /> {new Date(res.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><IoTime /> {res.time}</span>
                    <span className="flex items-center gap-1"><IoPeople /> {res.guests} personas</span>
                  </div>
                </div>
                {res.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(res)}><IoPencil /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setReservations(reservations.filter(r => r.id !== res.id))}><IoTrash /></Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>{editingReservation ? 'Editar' : 'Nueva'} Reservación</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Select label="Restaurante" options={restaurantOptions} value={formData.restaurantId} onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })} />
            <Input type="date" label="Fecha" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <Select label="Hora" options={timeOptions} value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
            <Select label="Personas" options={guestOptions} value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} />
            <Textarea label="Notas" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}