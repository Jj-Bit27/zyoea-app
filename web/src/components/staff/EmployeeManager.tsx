import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMail, FiPhone } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Badge } from "../custom/Badge";
import { Select } from "../custom/Select";
import { Avatar } from "../custom/Avatar";
import { addToast } from "../custom/Toast"; // Feedback global

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "empleado" | "admin";
  status: "activo" | "inactivo";
  avatar?: string;
}

const initialEmployees: Employee[] = [
  { id: "1", name: "Carlos García", email: "carlos@foodapp.com", phone: "+52 555 123 4567", role: "admin", status: "activo" },
  { id: "2", name: "María López", email: "maria@foodapp.com", phone: "+52 555 234 5678", role: "empleado", status: "activo" },
  { id: "3", name: "Juan Pérez", email: "juan@foodapp.com", phone: "+52 555 345 6789", role: "empleado", status: "activo" },
  { id: "4", name: "Ana Martínez", email: "ana@foodapp.com", phone: "+52 555 456 7890", role: "empleado", status: "inactivo" },
];

export function EmployeesManager() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "empleado" as "empleado" | "admin",
    status: "activo" as "activo" | "inactivo",
  });

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        status: employee.status,
      });
    } else {
      setEditingEmployee(null);
      setFormData({ name: "", email: "", phone: "", role: "empleado", status: "activo" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Validación básica
    if (!formData.name || !formData.email) {
      addToast("Nombre y email son requeridos", "error");
      return;
    }

    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
        )
      );
      addToast("Empleado actualizado correctamente", "success");
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
      };
      setEmployees([...employees, newEmployee]);
      addToast("Empleado registrado correctamente", "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
      addToast("Empleado eliminado", "info");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empleados</h1>
          <p className="text-muted-foreground">Gestiona el personal del restaurante</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FiPlus size={18} />
          Nuevo empleado
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Buscar empleados..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar name={employee.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{employee.name}</h3>
                    <Badge variant={employee.role === "admin" ? "default" : "secondary"}>
                      {employee.role}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <FiMail size={14} />
                      <span className="truncate">{employee.email}</span>
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <FiPhone size={14} />
                      {employee.phone}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant={employee.status === "activo" ? "success" : "destructive"}>
                      {employee.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(employee)}>
                        <FiEdit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(employee.id)}>
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          {editingEmployee ? "Editar empleado" : "Nuevo empleado"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ingresa el nombre"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+52 555 000 0000"
            />
            <Select
              label="Rol"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as "empleado" | "admin" })}
              options={[
                { value: "empleado", label: "Empleado" },
                { value: "admin", label: "Administrador" },
              ]}
            />
            <Select
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "activo" | "inactivo" })}
              options={[
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" },
              ]}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingEmployee ? "Guardar cambios" : "Crear empleado"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}