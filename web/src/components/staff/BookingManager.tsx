import { useState } from "react";
import { FiSearch, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import { Input } from "../custom/Input";
import { Card, CardContent } from "../custom/Card";
import { Badge } from "../custom/Badge";
import { Select } from "../custom/Select";

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  table: string;
  status: "pendiente" | "confirmada" | "completada" | "cancelada";
  notes?: string;
}

const initialReservations: Reservation[] = [
  { id: "1", customerName: "Carlos García", customerPhone: "+52 555 123 4567", date: "2024-01-15", time: "19:00", guests: 4, table: "Mesa 2", status: "confirmada", notes: "Cumpleaños" },
  { id: "2", customerName: "María López", customerPhone: "+52 555 234 5678", date: "2024-01-15", time: "19:30", guests: 2, table: "Mesa 8", status: "pendiente" },
  { id: "3", customerName: "Juan Pérez", customerPhone: "+52 555 345 6789", date: "2024-01-15", time: "20:00", guests: 6, table: "Mesa 4", status: "confirmada" },
  { id: "4", customerName: "Ana Martínez", customerPhone: "+52 555 456 7890", date: "2024-01-16", time: "13:00", guests: 3, table: "Mesa 5", status: "pendiente" },
  { id: "5", customerName: "Roberto Sánchez", customerPhone: "+52 555 567 8901", date: "2024-01-14", time: "20:30", guests: 2, table: "Mesa 1", status: "completada" },
  { id: "6", customerName: "Laura Torres", customerPhone: "+52 555 678 9012", date: "2024-01-14", time: "19:00", guests: 4, table: "Mesa 3", status: "cancelada" },
];

const statusColors = {
  pendiente: "warning",
  confirmada: "success",
  completada: "secondary",
  cancelada: "destructive",
} as const;

export function BookingsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredReservations = initialReservations.filter((res) => {
    const matchesSearch = res.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || res.status === filterStatus;
    const matchesDate = !filterDate || res.date === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const groupedByDate = filteredReservations.reduce((acc, res) => {
    if (!acc[res.date]) acc[res.date] = [];
    acc[res.date].push(res);
    return acc;
  }, {} as Record<string, Reservation[]>);

  const formatDate = (dateStr: string) => {
    // Truco para evitar problemas de zona horaria al parsear fechas YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
        <p className="text-muted-foreground">Visualiza las reservas del restaurante</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-auto"
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: "", label: "Todos los estados" },
            { value: "pendiente", label: "Pendiente" },
            { value: "confirmada", label: "Confirmada" },
            { value: "completada", label: "Completada" },
            { value: "cancelada", label: "Cancelada" },
          ]}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{filteredReservations.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{filteredReservations.filter(r => r.status === "pendiente").length}</p>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{filteredReservations.filter(r => r.status === "confirmada").length}</p>
            <p className="text-sm text-muted-foreground">Confirmadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{filteredReservations.filter(r => r.status === "cancelada").length}</p>
            <p className="text-sm text-muted-foreground">Canceladas</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservations grouped by date */}
      <div className="space-y-6">
        {Object.entries(groupedByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, reservations]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 capitalize">
                <FiCalendar size={18} />
                {formatDate(date)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((reservation) => (
                    <Card key={reservation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{reservation.customerName}</h3>
                            <p className="text-sm text-muted-foreground">{reservation.customerPhone}</p>
                          </div>
                          <Badge variant={statusColors[reservation.status]}>
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FiClock size={14} />
                            {reservation.time}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FiUsers size={14} />
                            {reservation.guests} personas
                          </div>
                          <div className="text-muted-foreground">
                            {reservation.table}
                          </div>
                        </div>
                        {reservation.notes && (
                          <p className="mt-3 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            Nota: {reservation.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {Object.keys(groupedByDate).length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FiCalendar size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No hay reservas</p>
            <p className="text-muted-foreground">No se encontraron reservas con los filtros seleccionados</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}