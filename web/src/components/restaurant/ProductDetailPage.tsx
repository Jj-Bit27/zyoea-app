import { ApolloWrapper } from '../ApolloWrapper'
import { useRestaurantById } from '../../hooks/useRestaurants'
import { useProductById } from '../../hooks/useProducts'
import ProductDetailManager from './ProductDetailManager'
import { Spinner } from '../custom/Spinner'
import { Card, CardContent } from '../custom/Card'

interface Props {
  restaurantId: string
  productId: string
}

function ProductDetailPageContent({ restaurantId, productId }: Props) {
  const { restaurant, loading: loadingRestaurant, error: restaurantError } = useRestaurantById(restaurantId)
  const { products, loading: loadingProduct, error: productError } = useProductById(productId)

  const loading = loadingRestaurant || loadingProduct
  const error = restaurantError || productError

  if (loading) {
    return <Spinner size="lg" message="Cargando producto..." className="py-20" />
  }

  if (error || !restaurant) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Producto o restaurante no encontrado.
      </div>
    )
  }

  const product = products?.[0] ?? null

  if (!product) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Producto no encontrado.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <a
        href={`/restaurants/${restaurantId}/products`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver al menú
      </a>

      <ProductDetailManager
        product={product}
        restaurantName={restaurant.name}
        restaurantId={restaurantId}
      />
    </div>
  )
}

export default function ProductDetailPage({ restaurantId, productId }: Props) {
  return (
    <ApolloWrapper>
      <ProductDetailPageContent restaurantId={restaurantId} productId={productId} />
    </ApolloWrapper>
  )
}
