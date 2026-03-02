import { useState } from "react";
import { FiDollarSign, FiCheck, FiClock, FiSearch } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Badge } from "../custom/Badge";
import { addToast } from "../custom/Toast"; // Feedback global

interface CashPayment {
  id: string;
  orderId: string;
  table: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  status: "pendiente" | "completado";
  receivedAmount?: number;
  change?: number;
}

const initialPayments: CashPayment[] = [
  {
    id: "1",
    orderId: "ORD-001",
    table: "Mesa 3",
    total: 245,
    items: [
      { name: "Filete Mignon", quantity: 1, price: 180 },
      { name: "Limonada", quantity: 2, price: 45 },
      { name: "Tiramisú", quantity: 1, price: 20 },
    ],
    status: "pendiente",
  },
  {
    id: "2",
    orderId: "ORD-002",
    table: "Mesa 7",
    total: 380,
    items: [
      { name: "Pasta Alfredo", quantity: 2, price: 165 },
      { name: "Ensalada César", quantity: 1, price: 50 },
    ],
    status: "pendiente",
  },
  {
    id: "3",
    orderId: "ORD-003",
    table: "Mesa 1",
    total: 120,
    items: [
      { name: "Bruschetta", quantity: 2, price: 60 },
    ],
    status: "completado",
    receivedAmount: 150,
    change: 30,
  },
];

export function PaymentsManager() {
  const [payments, setPayments] = useState<CashPayment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<CashPayment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");

  const pendingPayments = payments.filter((p) => p.status === "pendiente");
  const completedPayments = payments.filter((p) => p.status === "completado");

  const filteredPending = pendingPayments.filter(
    (p) =>
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenPayment = (payment: CashPayment) => {
    setSelectedPayment(payment);
    setReceivedAmount("");
    setIsModalOpen(true);
  };

  const handleProcessPayment = () => {
    if (!selectedPayment) return;

    const received = parseFloat(receivedAmount) || 0;
    if (received < selectedPayment.total) {
      addToast("El monto recibido es insuficiente", "error");
      return;
    }

    const change = received - selectedPayment.total;

    setPayments(
      payments.map((p) =>
        p.id === selectedPayment.id
          ? { ...p, status: "completado" as const, receivedAmount: received, change }
          : p
      )
    );

    addToast(`Pago procesado. Cambio: $${change.toFixed(2)}`, "success");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pagos en Efectivo</h1>
        <p className="text-muted-foreground">Gestiona los pagos pendientes en efectivo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/20 rounded-lg text-warning">
                <FiClock size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingPayments.length}</p>
                <p className="text-sm text-muted-foreground">Pagos pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/20 rounded-lg text-success">
                <FiCheck size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedPayments.length}</p>
                <p className="text-sm text-muted-foreground">Completados hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-lg text-primary">
                <FiDollarSign size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${pendingPayments.reduce((sum, p) => sum + p.total, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total pendiente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Buscar por orden o mesa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pending Payments */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Pagos Pendientes</h2>
        {filteredPending.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FiCheck size={48} className="mx-auto text-success mb-4" />
              <p className="text-lg font-medium text-foreground">No hay pagos pendientes</p>
              <p className="text-muted-foreground">Todos los pagos en efectivo han sido procesados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPending.map((payment) => (
              <Card key={payment.id} className="border-warning border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{payment.orderId}</h3>
                      <p className="text-sm text-muted-foreground">{payment.table}</p>
                    </div>
                    <Badge variant="warning">Pendiente</Badge>
                  </div>

                  <div className="space-y-1 mb-4">
                    {payment.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-foreground">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <p className="text-lg font-bold text-foreground">Total: ${payment.total}</p>
                    <Button size="sm" onClick={() => handleOpenPayment(payment)}>
                      Cobrar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Payments */}
      {completedPayments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Completados Hoy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedPayments.map((payment) => (
              <Card key={payment.id} className="opacity-75 bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{payment.orderId}</h3>
                      <p className="text-sm text-muted-foreground">{payment.table}</p>
                    </div>
                    <Badge variant="success">Completado</Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-foreground">${payment.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recibido</span>
                      <span className="text-foreground">${payment.receivedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cambio</span>
                      <span className="text-success font-medium">${payment.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          Procesar Pago - {selectedPayment?.orderId}
        </ModalHeader>
        <ModalBody>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{selectedPayment.table}</p>
                <div className="space-y-1">
                  {selectedPayment.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-foreground">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${selectedPayment.total}</span>
                </div>
              </div>

              <Input
                label="Monto recibido"
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
              />

              {receivedAmount && parseFloat(receivedAmount) >= selectedPayment.total && (
                <div className="p-4 bg-success/10 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-lg font-semibold text-success text-center">
                    Cambio: ${(parseFloat(receivedAmount) - selectedPayment.total).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleProcessPayment} disabled={!receivedAmount || parseFloat(receivedAmount) < (selectedPayment?.total || 0)}>
            Confirmar pago
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}