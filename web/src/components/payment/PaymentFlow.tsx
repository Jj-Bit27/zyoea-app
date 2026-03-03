import { useMemo, useState } from 'react'
import { IoArrowBack, IoCash, IoCard, IoCheckmarkCircle } from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle } from '../custom/Card'
import { Button } from '../custom/Button'
import { useOrder } from '../../context/OrderContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../custom/Toast'
import { useRestaurantById } from '../../hooks/useRestaurants'

type PaymentMethod = 'cash' | 'card' | null

export default function PaymentFlow() {
  const { items, restaurantId, total, clearOrder } = useOrder()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { restaurant } = useRestaurantById(restaurantId || '')

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)

  const subtotal = total
  const tax = Math.round(subtotal * 0.16)
  const finalTotal = subtotal + tax

  const handleSelectCash = () => setPaymentMethod('cash')
  
  const handleSelectCard = () => {
    setPaymentMethod('card')
    window.location.href = '/pago/tarjeta'
  }

  const handleConfirmCash = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setIsComplete(true)
  }

  const handleFinish = () => {
    clearOrder()
    showToast('Orden completada exitosamente', 'success')
    window.location.href = '/tickets'
  }

  if (!user || items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">No hay orden activa</h1>
        <p className="mt-2 text-muted-foreground">Agrega productos a tu orden primero</p>
        <a href="/restaurantes" className="inline-block mt-4">
          <Button>Ver Restaurantes</Button>
        </a>
      </div>
    )
  }

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="py-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <IoCheckmarkCircle className="h-12 w-12 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Esperando al personal</h1>
          <p className="mt-4 text-muted-foreground">Esperando el apoyo del personal del restaurante...</p>
          <div className="mt-6 rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Total a pagar</p>
            <p className="text-3xl font-bold">${finalTotal}</p>
          </div>
          <Button fullWidth className="mt-8" onClick={handleFinish}>Finalizar</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <a href="/orden" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <IoArrowBack className="h-4 w-4" /> Volver a mi orden
      </a>

      <h1 className="text-2xl font-bold">Método de Pago</h1>
      <p className="mt-1 text-muted-foreground">Selecciona como deseas pagar tu orden</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button onClick={handleSelectCash} className={`flex flex-col items-center rounded-xl border-2 p-6 transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
          <div className={`rounded-full p-4 ${paymentMethod === 'cash' ? 'bg-primary/10' : 'bg-secondary'}`}>
            <IoCash className={`h-8 w-8 ${paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Efectivo</h3>
        </button>

        <button onClick={handleSelectCard} className={`flex flex-col items-center rounded-xl border-2 p-6 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
          <div className={`rounded-full p-4 ${paymentMethod === 'card' ? 'bg-primary/10' : 'bg-secondary'}`}>
            <IoCard className={`h-8 w-8 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Tarjeta</h3>
        </button>
      </div>

      <Card className="mt-8">
        <CardHeader><CardTitle>Resumen de la orden</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                <span className="text-foreground">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <hr className="my-4 border-border" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal}</span></div>
            <div className="flex justify-between text-sm"><span>IVA (16%)</span><span>${tax}</span></div>
            <div className="flex justify-between pt-2"><span className="font-semibold">Total</span><span className="text-xl font-bold text-primary">${finalTotal}</span></div>
          </div>
        </CardContent>
      </Card>

      {paymentMethod === 'cash' && (
        <Button fullWidth size="lg" className="mt-6" onClick={handleConfirmCash} isLoading={isProcessing}>
          Confirmar Pago en Efectivo
        </Button>
      )}
    </div>
  )
}