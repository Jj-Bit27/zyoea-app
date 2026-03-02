import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../custom/Modal";
import { Textarea } from "../custom/Textarea";
import { Select } from "../custom/Select";
import { Badge } from "../custom/Badge";
import { addToast } from "../custom/Toast"; // Feedback global

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

const categories = ["Entradas", "Platos fuertes", "Postres", "Bebidas", "Ensaladas"];

const initialProducts: Product[] = [
  { id: "1", name: "Bruschetta", description: "Pan tostado con tomate y albahaca", price: 85, category: "Entradas", image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300", available: true },
  { id: "2", name: "Filete Mignon", description: "Corte premium con guarnición", price: 380, category: "Platos fuertes", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=300", available: true },
  { id: "3", name: "Tiramisú", description: "Postre italiano tradicional", price: 95, category: "Postres", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300", available: true },
  { id: "4", name: "Limonada", description: "Limonada natural fresca", price: 45, category: "Bebidas", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300", available: false },
  { id: "5", name: "Ensalada César", description: "Lechuga, crutones y aderezo césar", price: 120, category: "Ensaladas", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300", available: true },
  { id: "6", name: "Pasta Alfredo", description: "Pasta con salsa cremosa", price: 165, category: "Platos fuertes", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300", available: true },
];

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        available: product.available,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", description: "", price: "", category: "", image: "", available: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      addToast("Completa los campos obligatorios", "error");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300",
      available: formData.available,
    };

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...productData } : p
        )
      );
      addToast("Producto actualizado", "success");
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productData,
      };
      setProducts([...products, newProduct]);
      addToast("Producto creado", "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id));
      addToast("Producto eliminado", "info");
    }
  };

  const toggleAvailability = (id: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const newStatus = !p.available;
          // Feedback sutil
          addToast(`${p.name} ahora está ${newStatus ? 'disponible' : 'agotado'}`, "info");
          return { ...p, available: newStatus };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">Gestiona el menú del restaurante</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FiPlus size={18} />
          Nuevo producto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          options={[
            { value: "", label: "Todas las categorías" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className={`overflow-hidden transition-opacity ${!product.available ? "opacity-75" : ""}`}>
            <div className="relative aspect-video bg-muted">
              {/* Reemplazo de next/image por img estándar con clases de Tailwind */}
              <img
                src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              {!product.available && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[1px]">
                  <Badge variant="destructive" className="text-sm px-3 py-1">No disponible</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1" title={product.name}>{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <p className="font-bold text-primary">${product.price}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[2.5em]">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => toggleAvailability(product.id)}
                  className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                    product.available
                      ? "bg-success/20 text-success hover:bg-success/30"
                      : "bg-destructive/20 text-destructive hover:bg-destructive/30"
                  }`}
                >
                  {product.available ? "Disponible" : "Agotado"}
                </button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(product)}>
                    <FiEdit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                    <FiTrash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader onClose={() => setIsModalOpen(false)}>
          {editingProduct ? "Editar producto" : "Nuevo producto"}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del producto"
            />
            <Input
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
            />
            <Select
              label="Categoría"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: "", label: "Selecciona una categoría" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
            />
            <Input
              label="URL de imagen"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Producto disponible</span>
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingProduct ? "Guardar cambios" : "Crear producto"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}