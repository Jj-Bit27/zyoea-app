import { useState } from 'react'
import { IoAdd, IoStar, IoTrash, IoPencil } from 'react-icons/io5'
import { Card, CardContent } from '../custom/Card'
import { Button } from '../custom/Button'
import { Avatar } from '../custom/Avatar'
import { Rating } from '../custom/Rating'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../custom/Modal'
import { Input } from '../custom/Input'
import { Textarea } from '../custom/Textarea'
import { EmptyState } from '../custom/EmptyState'
import { Spinner } from '../custom/Spinner'
import { useToast } from '../custom/Toast'
import { useAuth } from '../../context/AuthContext'
import { useReviews } from '../../hooks/useReviews'
import { ApolloWrapper } from '../ApolloWrapper'

function ReviewManagerContent({ restaurantId, restaurantName }: { restaurantId: string, restaurantName: string }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { reviews, loading, error, createReview, updateReview, deleteReview } = useReviews(restaurantId)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<any | null>(null)
  const [newReview, setNewReview] = useState({ title: '', content: '', rating: 5 })

  const restaurantReviews = reviews.filter((r: any) => String(r.restaurantId) === String(restaurantId))
  const userReview = restaurantReviews.find((r: any) => String(r.userId) === String(user?.id))

  const averageRating = restaurantReviews.length > 0
    ? restaurantReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / restaurantReviews.length
    : 0

  const handleOpenModal = (review?: any) => {
    if (review) {
      setEditingReview(review)
      setNewReview({ title: '', content: review.comment, rating: review.rating })
    } else {
      setEditingReview(null)
      setNewReview({ title: '', content: '', rating: 5 })
    }
    setIsModalOpen(true)
  }

  const handleSubmitReview = () => {
    if (!newReview.content.trim()) {
      showToast('Completa todos los campos', 'error')
      return
    }
    if (!user) {
      showToast('Inicia sesión para publicar una reseña', 'error')
      return
    }

    if (editingReview) {
      updateReview(editingReview.id, { rating: newReview.rating, comment: newReview.content })
    } else {
      createReview({
        restaurant: parseInt(restaurantId),
        user: parseInt(user.id),
        rating: newReview.rating,
        comment: newReview.content,
      })
    }
    setIsModalOpen(false)
  }

  if (loading) {
    return <Spinner size="lg" message="Cargando reseñas..." className="py-12" />
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-lg text-center">
        Error al cargar reseñas: {error.message}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Reseñas de {restaurantName}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={averageRating} />
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({restaurantReviews.length} reseñas)</span>
          </div>
        </div>
        {user && !userReview && (
          <Button onClick={() => handleOpenModal()}><IoAdd /> Escribir Reseña</Button>
        )}
      </div>

      {restaurantReviews.length === 0 ? (
        <EmptyState icon={IoStar} title="Aún no hay reseñas" description="Sé el primero en compartir tu experiencia" action={user ? { label: 'Escribir Reseña', onClick: () => handleOpenModal() } : undefined} />
      ) : (
        <div className="space-y-4">
          {restaurantReviews.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar name={review.user?.name} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{review.user?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Rating value={review.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                      {String(review.userId) === String(user?.id) && (
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenModal(review)} className="p-1.5 hover:bg-secondary rounded"><IoPencil className="h-4 w-4" /></button>
                          <button onClick={() => deleteReview(review.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><IoTrash className="h-4 w-4" /></button>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>{editingReview ? 'Editar' : 'Nueva'} Reseña</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Rating value={newReview.rating} size="lg" interactive onChange={(v) => setNewReview({ ...newReview, rating: v })} />
            <Textarea label="Tu reseña" value={newReview.content} onChange={(e) => setNewReview({ ...newReview, content: e.target.value })} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmitReview}>Publicar</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default function ReviewManager({ restaurantId, restaurantName }: { restaurantId: string, restaurantName: string }) {
  return (
    <ApolloWrapper>
      <ReviewManagerContent restaurantId={restaurantId} restaurantName={restaurantName} />
    </ApolloWrapper>
  )
}