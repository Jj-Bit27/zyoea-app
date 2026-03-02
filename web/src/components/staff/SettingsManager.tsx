import { useState } from "react";
import { FiSave, FiClock, FiMapPin, FiPhone, FiMail, FiGlobe } from "react-icons/fi";
import { Button } from "../custom/Button";
import { Input } from "../custom/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../custom/Card";
import { Textarea } from "../custom/Textarea";
import { addToast } from "../custom/Toast"; // Importamos la acción directa

interface RestaurantConfig {
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

const initialConfig: RestaurantConfig = {
  name: "La Trattoria",
  description: "Auténtica cocina italiana con ingredientes frescos y recetas tradicionales.",
  logo: "",
  coverImage: "",
  address: "Av. Reforma 123, Col. Centro, CDMX",
  phone: "+52 555 123 4567",
  email: "contacto@latrattoria.mx",
  website: "www.latrattoria.mx",
  openingHours: {
    monday: { open: "12:00", close: "22:00", closed: false },
    tuesday: { open: "12:00", close: "22:00", closed: false },
    wednesday: { open: "12:00", close: "22:00", closed: false },
    thursday: { open: "12:00", close: "22:00", closed: false },
    friday: { open: "12:00", close: "23:00", closed: false },
    saturday: { open: "13:00", close: "23:00", closed: false },
    sunday: { open: "13:00", close: "21:00", closed: false },
  },
};

const dayNames = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export function ConfigManager() {
  const [config, setConfig] = useState<RestaurantConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Usamos la función global de Nano Stores
    addToast("Configuración guardada correctamente", "success");
  };

  const updateOpeningHours = (
    day: keyof RestaurantConfig["openingHours"],
    field: "open" | "close" | "closed",
    value: string | boolean
  ) => {
    setConfig({
      ...config,
      openingHours: {
        ...config.openingHours,
        [day]: {
          ...config.openingHours[day],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">Personaliza la información del restaurante</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <FiSave size={18} />
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nombre del restaurante"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="Nombre del restaurante"
            />
            <Textarea
              label="Descripción"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="Descripción del restaurante"
              rows={3}
            />
            <Input
              label="URL del logo"
              value={config.logo}
              onChange={(e) => setConfig({ ...config, logo: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="URL de imagen de portada"
              value={config.coverImage}
              onChange={(e) => setConfig({ ...config, coverImage: e.target.value })}
              placeholder="https://..."
            />
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <FiMapPin className="absolute left-3 top-9 text-muted-foreground" size={18} />
              <Input
                label="Dirección"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="Dirección completa"
                className="pl-10"
              />
            </div>
            <div className="relative">
              <FiPhone className="absolute left-3 top-9 text-muted-foreground" size={18} />
              <Input
                label="Teléfono"
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                placeholder="+52 555 000 0000"
                className="pl-10"
              />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3 top-9 text-muted-foreground" size={18} />
              <Input
                label="Email"
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="pl-10"
              />
            </div>
            <div className="relative">
              <FiGlobe className="absolute left-3 top-9 text-muted-foreground" size={18} />
              <Input
                label="Sitio web"
                value={config.website}
                onChange={(e) => setConfig({ ...config, website: e.target.value })}
                placeholder="www.ejemplo.com"
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiClock size={20} />
              Horario de atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(Object.keys(dayNames) as Array<keyof typeof dayNames>).map((day) => (
                <div
                  key={day}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="w-32">
                    <span className="font-medium text-foreground">{dayNames[day]}</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.openingHours[day].closed}
                      onChange={(e) => updateOpeningHours(day, "closed", e.target.checked)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">Cerrado</span>
                  </label>
                  {!config.openingHours[day].closed && (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={config.openingHours[day].open}
                        onChange={(e) => updateOpeningHours(day, "open", e.target.value)}
                        className="w-auto"
                      />
                      <span className="text-muted-foreground">a</span>
                      <Input
                        type="time"
                        value={config.openingHours[day].close}
                        onChange={(e) => updateOpeningHours(day, "close", e.target.value)}
                        className="w-auto"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}