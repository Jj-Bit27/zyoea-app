import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiGrid, FiPackage } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Textarea } from "../custom/Textarea";
import { addToast } from "../custom/Toast"; // ¡Usamos el sistema de notificaciones global!

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  image?: string;
}

const initialCategories: Category[] = [
  { id: "1", name: "Entradas", description: "Aperitivos y entradas para comenzar", productCount: 8 },
  { id: "2", name: "Platos fuertes", description: "Platos principales del menú", productCount: 15 },
  { id: "3", name: "Postres", description: "Deliciosos postres para terminar", productCount: 6 },
  { id: "4", name: "Bebidas", description: "Refrescos, jugos y bebidas frías", productCount: 12 },
  { id: "5", name: "Bebidas calientes", description: "Café, té y más", productCount: 8 },
  { id: "6", name: "Ensaladas", description: "Ensaladas frescas y saludables", productCount: 5 },
];

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Validación simple
    if (!formData.name.trim()) {
      addToast("El nombre es requerido", "error");
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        )
      );
      addToast("Categoría actualizada correctamente", "success");
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0,
      };
      setCategories([...categories, newCategory]);
      addToast("Categoría creada correctamente", "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
      addToast("Categoría eliminada", "info");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
          <p className="text-muted-foreground">Organiza los productos por categoría</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FiPlus size={18} />
          Nueva categoría
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <FiGrid size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <FiPackage size={14} />
                      {category.productCount} productos
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(category)}>
                    <FiEdit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                    <FiTrash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {category.description}
              </p>
              
              {/* Reemplazo de Link por <a> tag estándar de Astro */}
              <a
                href={`/staff/categorias/${category.id}`}
                className="inline-block mt-4 text-sm text-primary hover:underline"
              >
                Ver productos
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          {editingCategory ? "Editar categoría" : "Nueva categoría"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre de la categoría"
            />
            <Textarea
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la categoría"
              rows={3}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingCategory ? "Guardar cambios" : "Crear categoría"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}