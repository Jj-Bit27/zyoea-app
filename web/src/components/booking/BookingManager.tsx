import { useState } from 'react'
import { IoAdd, IoCalendar, IoPencil, IoTrash, IoTime, IoPeople } from 'react-icons/io5'
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

function BookingManagerContent() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { restaurants, loading: loadingRestaurants } = useRestaurants()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    restaurantId: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  })

  const restaurantOptions = restaurants.map((r: any) => ({ value: r.id, label: r.name }))

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

  if (loadingRestaurants) {
    return <Spinner size="lg" message="Cargando restaurantes..." className="py-12" />
  }

  const handleOpenModal = () => {
    setFormData({ restaurantId: '', date: '', time: '', guests: '2', notes: '' })
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.restaurantId || !formData.date || !formData.time) {
      showToast('Completa todos los campos requeridos', 'error')
      return
    }
    showToast('Para crear una reservación, contacta al restaurante directamente', 'info')
    setIsModalOpen(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Reservaciones</h1>
          <p className="text-muted-foreground">Administra tus reservaciones en restaurantes</p>
        </div>
        <Button onClick={handleOpenModal}><IoAdd /> Nueva Reservación</Button>
      </div>

      <EmptyState
        icon={IoCalendar}
        title="No tienes reservaciones"
        description="Crea tu primera reservación aquí"
        action={{ label: 'Nueva Reservación', onClick: handleOpenModal }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>Nueva Reservación</ModalHeader>
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

export default function BookingManager() {
  return (
    <ApolloWrapper>
      <BookingManagerContent />
    </ApolloWrapper>
  )
}