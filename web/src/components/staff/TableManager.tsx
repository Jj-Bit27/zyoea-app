import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiClock, FiEye } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Badge } from "../custom/Badge";
import { Select } from "../custom/Select";
import { addToast } from "../custom/Toast"; // Feedback global

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "libre" | "ocupada" | "reservada";
  currentOrder?: {
    id: string;
    items: number;
    total: number;
    startTime: string;
  };
}

interface OrderHistory {
  id: string;
  time: string;
  items: number;
  total: number;
  status: "completada" | "cancelada";
}

const initialTables: Table[] = [
  { id: "1", number: 1, capacity: 2, status: "ocupada", currentOrder: { id: "ORD-001", items: 3, total: 245, startTime: "14:30" } },
  { id: "2", number: 2, capacity: 4, status: "reservada" },
  { id: "3", number: 3, capacity: 4, status: "libre" },
  { id: "4", number: 4, capacity: 6, status: "ocupada", currentOrder: { id: "ORD-002", items: 5, total: 380, startTime: "15:00" } },
  { id: "5", number: 5, capacity: 2, status: "libre" },
  { id: "6", number: 6, capacity: 4, status: "libre" },
  { id: "7", number: 7, capacity: 8, status: "reservada" },
  { id: "8", number: 8, capacity: 2, status: "ocupada", currentOrder: { id: "ORD-003", items: 2, total: 120, startTime: "15:15" } },
];

const mockOrderHistory: OrderHistory[] = [
  { id: "ORD-100", time: "12:00", items: 4, total: 320, status: "completada" },
  { id: "ORD-099", time: "10:30", items: 2, total: 150, status: "completada" },
  { id: "ORD-098", time: "09:00", items: 3, total: 180, status: "cancelada" },
];

const statusColors = {
  libre: "success",
  ocupada: "warning",
  reservada: "primary",
} as const;

export function TablesManager() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    status: "libre" as "libre" | "ocupada" | "reservada",
  });

  const handleOpenModal = (table?: Table) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        number: table.number.toString(),
        capacity: table.capacity.toString(),
        status: table.status,
      });
    } else {
      setEditingTable(null);
      // Sugerir el siguiente número de mesa automáticamente
      const maxNumber = Math.max(...tables.map((t) => t.number), 0);
      setFormData({ number: (maxNumber + 1).toString(), capacity: "4", status: "libre" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Validación simple
    if (!formData.number || !formData.capacity) {
      addToast("Número y capacidad son requeridos", "error");
      return;
    }

    const tableData = {
      number: parseInt(formData.number) || 0,
      capacity: parseInt(formData.capacity) || 2,
      status: formData.status,
    };

    if (editingTable) {
      setTables(
        tables.map((t) =>
          t.id === editingTable.id ? { ...t, ...tableData } : t
        )
      );
      addToast(`Mesa ${tableData.number} actualizada`, "success");
    } else {
      const newTable: Table = {
        id: Date.now().toString(),
        ...tableData,
      };
      setTables([...tables, newTable]);
      addToast(`Mesa ${tableData.number} creada`, "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta mesa?")) {
      setTables(tables.filter((t) => t.id !== id));
      addToast("Mesa eliminada correctamente", "info");
    }
  };

  const handleViewHistory = (table: Table) => {
    setSelectedTable(table);
    setIsHistoryModalOpen(true);
  };

  const stats = {
    total: tables.length,
    libre: tables.filter((t) => t.status === "libre").length,
    ocupada: tables.filter((t) => t.status === "ocupada").length,
    reservada: tables.filter((t) => t.status === "reservada").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mesas</h1>
          <p className="text-muted-foreground">Gestiona las mesas del restaurante</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FiPlus size={18} />
          Nueva mesa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{stats.libre}</p>
            <p className="text-sm text-muted-foreground">Libres</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{stats.ocupada}</p>
            <p className="text-sm text-muted-foreground">Ocupadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.reservada}</p>
            <p className="text-sm text-muted-foreground">Reservadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tables
          .sort((a, b) => a.number - b.number)
          .map((table) => (
            <Card
              key={table.id}
              className={`overflow-hidden transition-all hover:shadow-md ${
                table.status === "ocupada"
                  ? "border-warning"
                  : table.status === "reservada"
                  ? "border-primary"
                  : "border-success"
              }`}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl font-bold mb-3 ${
                      table.status === "libre"
                        ? "bg-success/20 text-success"
                        : table.status === "ocupada"
                        ? "bg-warning/20 text-warning"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {table.number}
                  </div>
                  <Badge variant={statusColors[table.status]} className="mb-2">
                    {table.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <FiUsers size={14} />
                    {table.capacity} personas
                  </p>
                </div>

                {table.currentOrder && (
                  <div className="mt-3 p-2 bg-muted/50 rounded-lg text-sm">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <FiClock size={12} />
                      Desde {table.currentOrder.startTime}
                    </p>
                    <p className="font-medium text-foreground">${table.currentOrder.total}</p>
                  </div>
                )}

                <div className="flex justify-center gap-1 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => handleViewHistory(table)} title="Ver historial">
                    <FiEye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(table)} title="Editar">
                    <FiEdit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(table.id)} title="Eliminar">
                    <FiTrash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          {editingTable ? "Editar mesa" : "Nueva mesa"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Número de mesa"
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="1"
            />
            <Input
              label="Capacidad (personas)"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="4"
            />
            <Select
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "libre" | "ocupada" | "reservada" })}
              options={[
                { value: "libre", label: "Libre" },
                { value: "ocupada", label: "Ocupada" },
                { value: "reservada", label: "Reservada" },
              ]}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingTable ? "Guardar cambios" : "Crear mesa"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* History Modal */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)}>
        <ModalHeader onClose={() => setIsHistoryModalOpen(false)}>
          Historial de Mesa {selectedTable?.number} (Hoy)
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            {mockOrderHistory.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.time} - {order.items} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${order.total}</p>
                  <Badge variant={order.status === "completada" ? "success" : "destructive"}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsHistoryModalOpen(false)}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}