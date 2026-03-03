import { ApolloWrapper } from '../ApolloWrapper'
import { useRestaurantById } from '../../hooks/useRestaurants'
import ReviewManager from './ReviewManager'
import { Spinner } from '../custom/Spinner'

function RestaurantReviewPageContent({ restaurantId }: { restaurantId: string }) {
  const { restaurant, loading, error } = useRestaurantById(restaurantId)

  if (loading) {
    return <Spinner size="lg" message="Cargando..." className="py-20" />
  }

  if (error || !restaurant) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Restaurante no encontrado.
      </div>
    )
  }

  return (
    <ReviewManager
      restaurantId={restaurantId}
      restaurantName={restaurant.name}
    />
  )
}

export default function RestaurantReviewPage({ restaurantId }: { restaurantId: string }) {
  return (
    <ApolloWrapper>
      <RestaurantReviewPageContent restaurantId={restaurantId} />
    </ApolloWrapper>
  )
}
