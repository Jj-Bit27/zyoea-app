import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Badge } from "../custom/Badge";
import { Select } from "../custom/Select";
import { Spinner } from "../custom/Spinner";
import { addToast } from "../custom/Toast";
import { useTables } from "../../hooks/useTables";
import { useAuth } from "../../context/AuthContext";
import { ApolloWrapper } from "../ApolloWrapper";

const statusColors: Record<string, any> = {
  libre: "success",
  available: "success",
  ocupada: "warning",
  occupied: "warning",
  reservada: "primary",
  reserved: "primary",
};

function TablesManagerContent() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId || "";
  const { tables, loading, error, createTable, updateTable, deleteTable } = useTables(restaurantId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [formData, setFormData] = useState({ number: "", capacity: "", status: "available" });

  if (!restaurantId) return (
    <div className="p-6 bg-muted rounded-lg text-center">
      <p className="text-muted-foreground">No hay restaurante asociado a tu cuenta.</p>
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (error) return <div className="p-6 bg-destructive/10 text-destructive rounded-lg">{error.message}</div>;

  const handleOpenModal = (table?: any) => {
    if (table) {
      setEditingTable(table);
      setFormData({ number: String(table.number), capacity: String(table.capacity), status: table.status });
    } else {
      setEditingTable(null);
      const maxNumber = Math.max(...tables.map((t: any) => t.number), 0);
      setFormData({ number: String(maxNumber + 1), capacity: "4", status: "available" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.number || !formData.capacity) {
      addToast("Número y capacidad son requeridos", "error");
      return;
    }
    const input = {
      restaurant: parseInt(restaurantId),
      number: parseInt(formData.number),
      capacity: parseInt(formData.capacity),
      status: formData.status,
    };
    if (editingTable) {
      updateTable(editingTable.id, input);
    } else {
      createTable(input);
    }
    setIsModalOpen(false);
  };

  const stats = {
    total: tables.length,
    libre: tables.filter((t: any) => t.status === "libre" || t.status === "available").length,
    ocupada: tables.filter((t: any) => t.status === "ocupada" || t.status === "occupied").length,
    reservada: tables.filter((t: any) => t.status === "reservada" || t.status === "reserved").length,
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
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-success">{stats.libre}</p>
          <p className="text-sm text-muted-foreground">Libres</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-warning">{stats.ocupada}</p>
          <p className="text-sm text-muted-foreground">Ocupadas</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{stats.reservada}</p>
          <p className="text-sm text-muted-foreground">Reservadas</p>
        </CardContent></Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tables.sort((a: any, b: any) => a.number - b.number).map((table: any) => (
          <Card key={table.id} className={`overflow-hidden transition-all hover:shadow-md ${
            table.status === "ocupada" || table.status === "occupied" ? "border-warning" :
            table.status === "reservada" || table.status === "reserved" ? "border-primary" : "border-success"
          }`}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl font-bold mb-3 ${
                  (table.status === "libre" || table.status === "available") ? "bg-success/20 text-success" :
                  (table.status === "ocupada" || table.status === "occupied") ? "bg-warning/20 text-warning" :
                  "bg-primary/20 text-primary"
                }`}>{table.number}</div>
                <Badge variant={statusColors[table.status] || "secondary"} className="mb-2">{table.status}</Badge>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <FiUsers size={14} />{table.capacity} personas
                </p>
              </div>
              <div className="flex justify-center gap-1 mt-3">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(table)}>
                  <FiEdit2 size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteTable(table.id)}>
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
            <Input label="Número de mesa" type="number" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} placeholder="1" />
            <Input label="Capacidad (personas)" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="4" />
            <Select label="Estado" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[
              { value: "available", label: "Libre" },
              { value: "occupied", label: "Ocupada" },
              { value: "reserved", label: "Reservada" },
            ]} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{editingTable ? "Guardar cambios" : "Crear mesa"}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export function TablesManager() {
  return (
    <ApolloWrapper>
      <TablesManagerContent />
    </ApolloWrapper>
  );
}
