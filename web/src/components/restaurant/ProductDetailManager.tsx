import { useState } from 'react'
import { IoAdd, IoRemove, IoCart } from 'react-icons/io5'
import { Card, CardContent } from '../custom/Card'
import { Button } from '../custom/Button'
import { Badge } from '../custom/Badge'
import { Textarea } from '../custom/Textarea'
import { useOrder } from '../../context/OrderContext'
import { useToast } from '../custom/Toast'
import { useAuth } from '../../context/AuthContext'

interface Props {
  product: any; // Idealmente usar tu tipo Product
  restaurantName: string;
  restaurantId: string;
}

export default function ProductDetailManager({ product, restaurantName, restaurantId }: Props) {
  const { addItem, restaurantId: currentRestaurantId } = useOrder()
  const { showToast } = useToast()
  const { user } = useAuth()

  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const canAddProduct = !currentRestaurantId || currentRestaurantId === restaurantId
  const totalPrice = product.price * quantity

  const handleAddToOrder = () => {
    if (!user) {
      showToast('Inicia sesión para agregar productos', 'warning')
      window.location.href = '/login'
      return
    }

    if (!canAddProduct) {
      showToast('Ya tienes productos de otro restaurante', 'error')
      return
    }

    // Añadimos el producto N veces según la cantidad
    for (let i = 0; i < quantity; i++) {
      const result = addItem({ ...product, notes }) // Pasamos las notas si tu contexto lo soporta
      if (!result.success) {
        showToast(result.message || 'Error al agregar', 'error')
        return
      }
    }

    showToast(`${quantity}x ${product.name} agregado a tu orden`, 'success')
    // Redirección nativa
    window.location.href = `/restaurants/${restaurantId}/products`
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Image Side */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover max-h-96 lg:max-h-none transition-transform hover:scale-105 duration-500"
        />
      </div>

      {/* Details Side */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="mt-1 text-muted-foreground">{restaurantName}</p>
          </div>
          <Badge variant={product.isAvailable ? 'success' : 'destructive'} className="shrink-0">
            {product.isAvailable ? 'Disponible' : 'Agotado'}
          </Badge>
        </div>

        <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>

        {product.ingredients && product.ingredients.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground">Ingredientes</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.ingredients.map((ingredient: string) => (
                <Badge key={ingredient} variant="secondary">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <span className="text-3xl font-bold text-primary">${product.price}</span>
        </div>

        {/* Interactive Form */}
        {product.isAvailable && (
          <Card className="mt-6">
            <CardContent className="space-y-4 pt-6">
              {/* Quantity Selector */}
              <div>
                <label className="text-sm font-medium text-foreground">Cantidad</label>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    <IoRemove className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    <IoAdd className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <Textarea
                label="Notas especiales (opcional)"
                placeholder="Ej: Sin cebolla, extra salsa..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              {/* Total and Add Button */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">${totalPrice}</p>
                </div>
                {canAddProduct ? (
                  <Button size="lg" onClick={handleAddToOrder}>
                    <IoCart className="h-5 w-5" />
                    Agregar a la orden
                  </Button>
                ) : (
                  <div className="text-right">
                    <p className="text-xs text-destructive mb-1">Orden de otro restaurante activa</p>
                    <a href="/orden">
                      <Button variant="outline" size="sm" className="bg-transparent text-destructive border-destructive hover:bg-destructive/10">
                        Ver mi orden
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}