import { useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiExternalLink, FiMoreVertical } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Badge } from "../custom/Badge";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Select } from "../custom/Select";
import { addToast } from "../custom/Toast";

interface Restaurant {
  id: string;
  name: string;
  ownerEmail: string;
  plan: "basic" | "pro" | "enterprise";
  status: "active" | "inactive" | "pending";
  joinedDate: string;
  revenue: number;
}

const initialRestaurants: Restaurant[] = [
  { id: "1", name: "La Trattoria", ownerEmail: "mario@trattoria.com", plan: "pro", status: "active", joinedDate: "2024-01-10", revenue: 12500 },
  { id: "2", name: "Burger King Center", ownerEmail: "manager@bk.com", plan: "enterprise", status: "active", joinedDate: "2023-11-05", revenue: 45000 },
  { id: "3", name: "Tacos El Paisa", ownerEmail: "paisa@tacos.com", plan: "basic", status: "inactive", joinedDate: "2024-02-01", revenue: 0 },
];

export function RestaurantsManager() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRest, setEditingRest] = useState<Restaurant | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    ownerEmail: "",
    plan: "basic",
    status: "active",
  });

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (restaurant?: Restaurant) => {
    if (restaurant) {
      setEditingRest(restaurant);
      setFormData({
        name: restaurant.name,
        ownerEmail: restaurant.ownerEmail,
        plan: restaurant.plan,
        status: restaurant.status,
      });
    } else {
      setEditingRest(null);
      setFormData({ name: "", ownerEmail: "", plan: "basic", status: "active" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.ownerEmail) {
      addToast("Nombre y Email son obligatorios", "error");
      return;
    }

    if (editingRest) {
      setRestaurants(restaurants.map(r => r.id === editingRest.id ? { ...r, ...formData } as Restaurant : r));
      addToast("Restaurante actualizado", "success");
    } else {
      const newRest: Restaurant = {
        id: Date.now().toString(),
        joinedDate: new Date().toISOString().split('T')[0],
        revenue: 0,
        ...formData as any
      };
      setRestaurants([...restaurants, newRest]);
      addToast("Restaurante registrado exitosamente", "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm("¿Estás seguro? Esto eliminará el acceso del restaurante.")) {
      setRestaurants(restaurants.filter(r => r.id !== id));
      addToast("Restaurante eliminado", "info");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge variant="success">Activo</Badge>;
      case 'inactive': return <Badge variant="destructive">Inactivo</Badge>;
      case 'pending': return <Badge variant="warning">Pendiente</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Restaurantes</h1>
          <p className="text-muted-foreground">Gestiona las suscripciones y accesos</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FiPlus size={18} />
          Registrar Restaurante
        </Button>
      </div>

      {/* Filtros */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Buscar por nombre o email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid de Restaurantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRestaurants.map((rest) => (
          <Card key={rest.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary font-bold text-xl">
                  {rest.name.charAt(0)}
                </div>
                {getStatusBadge(rest.status)}
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-1">{rest.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{rest.ownerEmail}</p>
              
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium capitalize">{rest.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registro:</span>
                  <span>{rest.joinedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ingresos:</span>
                  <span className="font-bold text-success">${rest.revenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={() => handleOpenModal(rest)}>
                  <FiEdit2 className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(rest.id)}>
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          {editingRest ? "Editar Restaurante" : "Nuevo Restaurante"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input 
              label="Nombre del Negocio"
              placeholder="Ej. La Pizzería"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="Email del Dueño"
              placeholder="admin@restaurante.com"
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
            />
            <Select 
              label="Plan de Suscripción"
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value})}
              options={[
                { value: "basic", label: "Básico ($29/mes)" },
                { value: "pro", label: "Pro ($59/mes)" },
                { value: "enterprise", label: "Enterprise ($99/mes)" },
              ]}
            />
            <Select 
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { value: "active", label: "Activo" },
                { value: "inactive", label: "Inactivo (Bloqueado)" },
                { value: "pending", label: "Pendiente de aprobación" },
              ]}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}