import React, { useMemo, useState } from 'react'
import { IoArrowBack, IoCard, IoLockClosed, IoCheckmarkCircle } from 'react-icons/io5'
import { Card, CardContent, CardHeader, CardTitle } from '../custom/Card'
import { Button } from '../custom/Button'
import { Input } from '../custom/Input'
import { useOrder } from '../../context/OrderContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../custom/Toast'
import { restaurants } from '../../libs/mock-data'

export default function CardPaymentForm() {
  const { items, restaurantId, total, clearOrder } = useOrder()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = total
  const tax = Math.round(subtotal * 0.16)
  const finalTotal = subtotal + tax

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const parts = v.match(/.{1,4}/g)
    return parts ? parts.join(' ') : v
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4)
    return v
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Ingresa un número válido'
    if (!cardName.trim()) newErrors.cardName = 'Ingresa el nombre del titular'
    if (!expiry || expiry.length < 5) newErrors.expiry = 'Ingresa una fecha válida'
    if (!cvv || cvv.length < 3) newErrors.cvv = 'Ingresa el CVV'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
  }

  const handleFinish = () => {
    clearOrder()
    showToast('Pago completado exitosamente', 'success')
    window.location.href = '/tickets'
  }

  if (!user || items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">No hay orden activa</h1>
        <a href="/restaurants" className="inline-block mt-4"><Button>Ver Restaurantes</Button></a>
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
          <h1 className="text-2xl font-bold">Pago Exitoso</h1>
          <p className="mt-4 text-muted-foreground">Tu pago ha sido procesado correctamente</p>
          <div className="mt-6 rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Total pagado</p>
            <p className="text-3xl font-bold">${finalTotal}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Tarjeta terminada en {cardNumber.slice(-4)}</p>
          <Button fullWidth className="mt-8" onClick={handleFinish}>Ver mi Ticket</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <a href="/pago" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <IoArrowBack className="h-4 w-4" /> Volver a métodos de pago
      </a>

      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-primary/10 p-3"><IoCard className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold">Pago con Tarjeta</h1>
          <p className="text-sm text-muted-foreground">Ingresa los datos de tu tarjeta</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Número de tarjeta" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} error={errors.cardNumber} />
            <Input label="Nombre del titular" placeholder="Nombre completo" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} error={errors.cardName} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Fecha (MM/AA)" placeholder="MM/AA" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} maxLength={5} error={errors.expiry} />
              <Input label="CVV" placeholder="123" type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} maxLength={4} error={errors.cvv} />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground"><IoLockClosed /> Datos encriptados con SSL</div>
            <hr className="border-border" />
            <div className="flex justify-between items-center"><span className="font-semibold">Total a pagar</span><span className="text-xl font-bold text-primary">${finalTotal}</span></div>
            <Button type="submit" fullWidth size="lg" isLoading={isProcessing}>Pagar ${finalTotal}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}