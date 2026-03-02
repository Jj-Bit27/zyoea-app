import { useOrder } from "../../context/OrderContext";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Card, CardContent } from "../custom/Card";
import { addToast } from "../custom/Toast";

export function CartManager() {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useOrder();
  const deliveryFee = 25;
  const finalTotal = total + (cart.length > 0 ? deliveryFee : 0);

  const handleCheckout = () => {
    addToast("¡Pedido realizado con éxito!", "success");
    clearCart();
    // Aquí redirigirías a una página de éxito o perfil
    setTimeout(() => window.location.href = "/", 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <FiShoppingBag size={40} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">Parece que aún no has agregado nada delicioso.</p>
        <Button onClick={() => window.location.href = "/restaurantes"}>
          Ir a explorar
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Items List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Tu pedido de <span className="text-primary">{cart[0]?.restaurantName}</span></h2>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
            Vaciar carrito
          </Button>
        </div>
        
        {cart.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex gap-4 items-center">
              {item.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-primary font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 rounded-md hover:bg-secondary disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  <FiMinus size={16} />
                </button>
                <span className="w-4 text-center font-medium">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 rounded-md hover:bg-secondary"
                >
                  <FiPlus size={16} />
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <FiTrash2 />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold border-b border-border pb-4">Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-4">
              <span>Total</span>
              <span className="text-primary">${finalTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-6" size="lg" onClick={handleCheckout}>
              Proceder al pago <FiArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}