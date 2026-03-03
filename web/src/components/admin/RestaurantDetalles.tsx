import { useState } from "react";
import { FiArrowLeft, FiEdit2, FiPlus, FiTrash2, FiStar, FiMapPin, FiPhone, FiMail, FiUsers, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../custom/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Badge } from "../custom/Badge";

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "activo" | "inactivo";
}

const mockRestaurant = {
  id: "1",
  name: "La Trattoria",
  description: "Auténtica cocina italiana con ingredientes frescos y recetas tradicionales traídas directamente de Italia.",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  address: "Av. Reforma 123, Col. Centro, CDMX",
  phone: "+52 555 123 4567",
  email: "contacto@latrattoria.mx",
  rating: 4.8,
  totalOrders: 1542,
  totalRevenue: 185430,
  status: "activo" as const,
};

const mockAdmins: Admin[] = [
  { id: "1", name: "Mario Rossi", email: "mario@latrattoria.mx", phone: "+52 555 111 2222", status: "activo" },
  { id: "2", name: "Luigi Bianchi", email: "luigi@latrattoria.mx", phone: "+52 555 333 4444", status: "activo" },
];

export default function RestauranteDetalle({ id }: { id: string }) {
  const [restaurant, setRestaurant] = useState(mockRestaurant);
  const [admins, setAdmins] = useState(mockAdmins);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({ ...restaurant });
  const [adminFormData, setAdminFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "activo" as "activo" | "inactivo",
  });

  const handleSaveRestaurant = () => {
    setRestaurant({ ...restaurant, ...formData });
    setIsEditModalOpen(false);
  };

  const handleOpenAdminModal = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setAdminFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        status: admin.status,
      });
    } else {
      setEditingAdmin(null);
      setAdminFormData({ name: "", email: "", phone: "", status: "activo" });
    }
    setIsAdminModalOpen(true);
  };

  const handleSaveAdmin = () => {
    if (editingAdmin) {
      setAdmins(
        admins.map((a) =>
          a.id === editingAdmin.id ? { ...a, ...adminFormData } : a
        )
      );
    } else {
      const newAdmin: Admin = {
        id: Date.now().toString(),
        ...adminFormData,
      };
      setAdmins([...admins, newAdmin]);
    }
    setIsAdminModalOpen(false);
  };

  const handleDeleteAdmin = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este administrador?")) {
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a href="/admin/restaurants">
          <Button variant="ghost" size="sm">
            <FiArrowLeft size={18} />
            Volver
          </Button>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
          <p className="text-muted-foreground">Gestiona la información del restaurante ID: {id}</p>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-48 md:h-64">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={restaurant.status === "activo" ? "success" : "destructive"}>
                {restaurant.status}
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{restaurant.name}</h2>
                <p className="text-muted-foreground mt-2">{restaurant.description}</p>
                {/* ... (Iconos de MapPin, Phone, Mail iguales) */}
              </div>
              <Button onClick={() => setIsEditModalOpen(true)}>
                <FiEdit2 size={16} />
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid y Seccion de Admins se mantienen igual con tus clases de Tailwind */}
      {/* ... */}
      
      {/* Modales se mantienen igual, usando client:load de Astro para funcionar */}
    </div>
  );
}