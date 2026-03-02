import { FiTrendingUp, FiUsers, FiShoppingBag, FiDollarSign, FiCalendar, FiClock } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "../custom/Card";

// Mock Data (En el futuro esto vendría de una API o Nano Store)
const stats = [
  {
    title: "Ventas del día",
    value: "$1,234",
    change: "+12%",
    icon: <FiDollarSign size={24} />,
    trend: "up",
  },
  {
    title: "Órdenes activas",
    value: "8",
    change: "+3",
    icon: <FiShoppingBag size={24} />,
    trend: "up",
  },
  {
    title: "Reservas hoy",
    value: "12",
    change: "+2",
    icon: <FiCalendar size={24} />,
    trend: "up",
  },
  {
    title: "Mesas ocupadas",
    value: "6/10",
    change: "60%",
    icon: <FiUsers size={24} />,
    trend: "neutral",
  },
];

const recentOrders = [
  { id: "ORD-001", table: "Mesa 3", items: 4, total: "$45.00", status: "En preparación", time: "Hace 5 min" },
  { id: "ORD-002", table: "Mesa 7", items: 2, total: "$28.50", status: "Servido", time: "Hace 12 min" },
  { id: "ORD-003", table: "Mesa 1", items: 6, total: "$89.00", status: "Pendiente pago", time: "Hace 25 min" },
  { id: "ORD-004", table: "Mesa 5", items: 3, total: "$35.00", status: "En preparación", time: "Hace 8 min" },
];

const upcomingReservations = [
  { name: "Carlos García", time: "19:00", guests: 4, table: "Mesa 2" },
  { name: "María López", time: "19:30", guests: 2, table: "Mesa 8" },
  { name: "Juan Pérez", time: "20:00", guests: 6, table: "Mesa 4" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de actividad del restaurante</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 flex items-center gap-1 ${
                    stat.trend === "up" ? "text-success" : "text-muted-foreground"
                  }`}>
                    {stat.trend === "up" && <FiTrendingUp size={14} />}
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiShoppingBag size={20} />
              Órdenes recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.table} - {order.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{order.total}</p>
                    <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                      order.status === "En preparación"
                        ? "bg-warning/20 text-warning-foreground"
                        : order.status === "Servido"
                        ? "bg-success/20 text-success"
                        : "bg-primary/20 text-primary"
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiCalendar size={20} />
              Próximas reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReservations.map((reservation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <FiClock size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{reservation.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.guests} personas - {reservation.table}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{reservation.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}