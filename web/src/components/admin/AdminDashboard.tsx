import { FiUsers, FiShoppingBag, FiDollarSign, FiActivity, FiTrendingUp, FiArrowUp } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "../custom/Card";

// Mock Data Global
const stats = [
  {
    title: "Ingresos Totales",
    value: "$45,231.89",
    change: "+20.1% vs mes anterior",
    icon: <FiDollarSign size={24} />,
    trend: "up",
  },
  {
    title: "Restaurantes Activos",
    value: "24",
    change: "+2 nuevos esta semana",
    icon: <FiShoppingBag size={24} />,
    trend: "up",
  },
  {
    title: "Usuarios Registrados",
    value: "2,350",
    change: "+180 nuevos usuarios",
    icon: <FiUsers size={24} />,
    trend: "up",
  },
  {
    title: "Tasa de Actividad",
    value: "98.5%",
    change: "+4% vs semana pasada",
    icon: <FiActivity size={24} />,
    trend: "up",
  },
];

const recentActivity = [
  { id: 1, text: "Nuevo restaurante registrado: 'La Pizzería'", time: "Hace 2 horas", type: "success" },
  { id: 2, text: "Suscripción renovada: 'Sushi Master'", time: "Hace 5 horas", type: "info" },
  { id: 3, text: "Reporte de error en módulo de pagos", time: "Hace 1 día", type: "warning" },
  { id: 4, text: "Nuevo usuario admin creado: Carlos Admin", time: "Hace 1 día", type: "info" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de SuperAdmin</h1>
        <p className="text-muted-foreground">Visión general del rendimiento de FoodApp</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {stat.icon}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <FiTrendingUp className="mr-1 text-success" />
                  <span className="text-success font-medium">{stat.change}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica simulada (Placeholder) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crecimiento de la Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2 px-2">
              {[40, 60, 45, 70, 85, 60, 75, 50, 65, 80, 95, 100].map((h, i) => (
                <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-500 group-hover:bg-primary/80"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === 'success' ? 'bg-success' : 
                    activity.type === 'warning' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
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