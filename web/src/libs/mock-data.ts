import type {
  Restaurant,
  Category,
  Product,
  Review,
  Reservation,
  Table,
  Order,
  Ticket,
} from "../types";

// ==================== RESTAURANTES ====================
export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "La Trattoria Italiana",
    description:
      "Autentica cocina italiana con pastas hechas a mano y pizzas al horno de lena. Un ambiente acogedor que te transporta a las calles de Roma.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    address: "Av. Principal 123, Centro",
    phone: "+52 55 1234 5678",
    email: "contacto@trattoria.com",
    rating: 4.8,
    reviewCount: 256,
    openingHours: "Lun-Dom: 12:00 - 23:00",
    cuisine: ["Italiana", "Pizzas", "Pastas"],
    isOpen: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Sakura Sushi Bar",
    description:
      "El mejor sushi de la ciudad con ingredientes frescos importados directamente de Japon. Experiencia omakase disponible.",
    image:
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&q=80",
    address: "Calle Japon 456, Zona Rosa",
    phone: "+52 55 2345 6789",
    email: "reservas@sakura.com",
    rating: 4.9,
    reviewCount: 189,
    openingHours: "Mar-Dom: 13:00 - 22:00",
    cuisine: ["Japonesa", "Sushi", "Ramen"],
    isOpen: true,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    name: "El Asador Argentino",
    description:
      "Carnes premium a la parrilla con el autentico sabor argentino. Cortes importados y vinos seleccionados.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    address: "Blvd. Parrillero 789, Polanco",
    phone: "+52 55 3456 7890",
    email: "info@asador.com",
    rating: 4.7,
    reviewCount: 312,
    openingHours: "Lun-Sab: 14:00 - 00:00",
    cuisine: ["Argentina", "Parrilla", "Carnes"],
    isOpen: false,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    name: "Tacos Don Pancho",
    description:
      "Los tacos mas autenticos de la ciudad. Recetas familiares con mas de 50 anos de tradicion.",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    address: "Plaza Mexico 321, Coyoacan",
    phone: "+52 55 4567 8901",
    email: "tacos@donpancho.com",
    rating: 4.6,
    reviewCount: 523,
    openingHours: "Lun-Dom: 10:00 - 02:00",
    cuisine: ["Mexicana", "Tacos", "Antojitos"],
    isOpen: true,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "5",
    name: "Le Petit Bistro",
    description:
      "Cocina francesa contemporanea en un ambiente intimo y elegante. Menu degustacion disponible.",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
    address: "Rue Francaise 567, Condesa",
    phone: "+52 55 5678 9012",
    email: "bonjour@petitbistro.com",
    rating: 4.9,
    reviewCount: 145,
    openingHours: "Mar-Sab: 19:00 - 23:00",
    cuisine: ["Francesa", "Gourmet", "Vinos"],
    isOpen: true,
    createdAt: new Date("2024-04-01"),
  },
  {
    id: "6",
    name: "Dragon Palace",
    description:
      "Autentica cocina china con dim sum tradicional. Chef especializado de Hong Kong.",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    address: "Chinatown 888, Centro",
    phone: "+52 55 6789 0123",
    email: "reservas@dragonpalace.com",
    rating: 4.5,
    reviewCount: 278,
    openingHours: "Lun-Dom: 11:00 - 22:00",
    cuisine: ["China", "Dim Sum", "Cantonesa"],
    isOpen: true,
    createdAt: new Date("2024-02-15"),
  },
];

// ==================== CATEGORIAS ====================
export const categories: Category[] = [
  {
    id: "1",
    name: "Entradas",
    description: "Para comenzar",
    restaurantId: "1",
    productCount: 8,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Pastas",
    description: "Pastas frescas",
    restaurantId: "1",
    productCount: 12,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Pizzas",
    description: "Pizzas artesanales",
    restaurantId: "1",
    productCount: 10,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Postres",
    description: "Dulces italianos",
    restaurantId: "1",
    productCount: 6,
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Bebidas",
    description: "Vinos y mas",
    restaurantId: "1",
    productCount: 15,
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "Rolls",
    description: "Rolls especiales",
    restaurantId: "2",
    productCount: 20,
    createdAt: new Date(),
  },
  {
    id: "7",
    name: "Sashimi",
    description: "Cortes frescos",
    restaurantId: "2",
    productCount: 12,
    createdAt: new Date(),
  },
  {
    id: "8",
    name: "Ramen",
    description: "Sopas calientes",
    restaurantId: "2",
    productCount: 6,
    createdAt: new Date(),
  },
];

// ==================== PRODUCTOS ====================
export const products: Product[] = [
  // La Trattoria Italiana
  {
    id: "1",
    name: "Bruschetta Clasica",
    description:
      "Pan tostado con tomate fresco, albahaca, ajo y aceite de oliva extra virgen.",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80",
    categoryId: "1",
    restaurantId: "1",
    isAvailable: true,
    ingredients: [
      "Pan italiano",
      "Tomate",
      "Albahaca",
      "Ajo",
      "Aceite de oliva",
    ],
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Carpaccio di Manzo",
    description:
      "Finas laminas de res con rucula, parmesano y vinagreta de limon.",
    price: 185,
    image:
      "https://images.unsplash.com/photo-1608039829572-9e1f6b9e8ada?w=400&q=80",
    categoryId: "1",
    restaurantId: "1",
    isAvailable: true,
    ingredients: ["Res", "Rucula", "Parmesano", "Limon"],
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Spaghetti Carbonara",
    description:
      "Spaghetti con huevo, queso pecorino, guanciale y pimienta negra.",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
    categoryId: "2",
    restaurantId: "1",
    isAvailable: true,
    ingredients: ["Spaghetti", "Huevo", "Pecorino", "Guanciale"],
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Fettuccine Alfredo",
    description: "Fettuccine en cremosa salsa de mantequilla y parmesano.",
    price: 165,
    image:
      "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&q=80",
    categoryId: "2",
    restaurantId: "1",
    isAvailable: true,
    ingredients: ["Fettuccine", "Mantequilla", "Parmesano", "Crema"],
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Pizza Margherita",
    description:
      "Pizza clasica con salsa de tomate, mozzarella fresca y albahaca.",
    price: 195,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80",
    categoryId: "3",
    restaurantId: "1",
    isAvailable: true,
    ingredients: [
      "Masa artesanal",
      "Tomate San Marzano",
      "Mozzarella",
      "Albahaca",
    ],
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "Pizza Quattro Formaggi",
    description:
      "Pizza con cuatro quesos: mozzarella, gorgonzola, fontina y parmesano.",
    price: 225,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
    categoryId: "3",
    restaurantId: "1",
    isAvailable: true,
    ingredients: ["Mozzarella", "Gorgonzola", "Fontina", "Parmesano"],
    createdAt: new Date(),
  },
  {
    id: "7",
    name: "Tiramisu",
    description:
      "Postre italiano clasico con mascarpone, cafe espresso y cacao.",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
    categoryId: "4",
    restaurantId: "1",
    isAvailable: true,
    ingredients: ["Mascarpone", "Cafe", "Cacao", "Savoiardi"],
    createdAt: new Date(),
  },
  // Sakura Sushi Bar
  {
    id: "8",
    name: "Dragon Roll",
    description: "Roll de anguila, aguacate y pepino con salsa de anguila.",
    price: 245,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80",
    categoryId: "6",
    restaurantId: "2",
    isAvailable: true,
    ingredients: ["Anguila", "Aguacate", "Pepino", "Arroz"],
    createdAt: new Date(),
  },
  {
    id: "9",
    name: "Rainbow Roll",
    description: "California roll cubierto con variedad de pescados frescos.",
    price: 285,
    image:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&q=80",
    categoryId: "6",
    restaurantId: "2",
    isAvailable: true,
    ingredients: ["Salmon", "Atun", "Camaron", "Aguacate"],
    createdAt: new Date(),
  },
  {
    id: "10",
    name: "Sashimi de Salmon",
    description: "8 piezas de salmon fresco cortado finamente.",
    price: 195,
    image:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80",
    categoryId: "7",
    restaurantId: "2",
    isAvailable: true,
    ingredients: ["Salmon fresco"],
    createdAt: new Date(),
  },
  {
    id: "11",
    name: "Ramen Tonkotsu",
    description: "Ramen con caldo de cerdo, chashu, huevo y cebollín.",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
    categoryId: "8",
    restaurantId: "2",
    isAvailable: true,
    ingredients: ["Caldo tonkotsu", "Chashu", "Huevo", "Fideos"],
    createdAt: new Date(),
  },
  // El Asador Argentino
  {
    id: "12",
    name: "Bife de Chorizo",
    description: "Corte argentino de 400g a la parrilla con chimichurri.",
    price: 385,
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
    categoryId: "1",
    restaurantId: "3",
    isAvailable: true,
    ingredients: ["Res premium", "Chimichurri", "Sal parrillera"],
    createdAt: new Date(),
  },
  {
    id: "13",
    name: "Entraña",
    description: "Corte jugoso de 350g con papas rusticas.",
    price: 345,
    image:
      "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80",
    categoryId: "1",
    restaurantId: "3",
    isAvailable: true,
    ingredients: ["Entraña", "Papas", "Hierbas"],
    createdAt: new Date(),
  },
  // Tacos Don Pancho
  {
    id: "14",
    name: "Tacos al Pastor",
    description:
      "Orden de 4 tacos con carne al pastor, piña, cilantro y cebolla.",
    price: 85,
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80",
    categoryId: "1",
    restaurantId: "4",
    isAvailable: true,
    ingredients: ["Cerdo marinado", "Piña", "Cilantro", "Cebolla"],
    createdAt: new Date(),
  },
  {
    id: "15",
    name: "Tacos de Carnitas",
    description: "Orden de 4 tacos con carnitas estilo Michoacan.",
    price: 90,
    image:
      "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80",
    categoryId: "1",
    restaurantId: "4",
    isAvailable: true,
    ingredients: ["Carnitas", "Cebolla", "Cilantro", "Salsa verde"],
    createdAt: new Date(),
  },
  {
    id: "16",
    name: "Quesadillas de Flor de Calabaza",
    description: "Quesadillas con queso Oaxaca y flor de calabaza.",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&q=80",
    categoryId: "1",
    restaurantId: "4",
    isAvailable: true,
    ingredients: ["Tortilla", "Queso Oaxaca", "Flor de calabaza"],
    createdAt: new Date(),
  },
];

// ==================== RESENAS ====================
export const reviews: Review[] = [
  {
    id: "1",
    userId: "1",
    user: {
      id: "1",
      email: "user@demo.com",
      name: "Carlos Martinez",
      role: "user",
      createdAt: new Date(),
    },
    restaurantId: "1",
    rating: 5,
    title: "Excelente experiencia!",
    content:
      "La mejor pasta que he probado fuera de Italia. El ambiente es increible y el servicio impecable. Definitivamente volvere pronto.",
    createdAt: new Date("2025-12-15"),
    updatedAt: new Date("2025-12-15"),
  },
  {
    id: "2",
    userId: "2",
    user: {
      id: "2",
      email: "maria@example.com",
      name: "Maria Garcia",
      role: "user",
      createdAt: new Date(),
    },
    restaurantId: "1",
    rating: 4,
    title: "Muy bueno pero un poco caro",
    content:
      "La comida es deliciosa y la presentacion es hermosa. El unico punto negativo son los precios, aunque la calidad lo justifica.",
    createdAt: new Date("2025-12-10"),
    updatedAt: new Date("2025-12-10"),
  },
  {
    id: "3",
    userId: "3",
    user: {
      id: "3",
      email: "juan@example.com",
      name: "Juan Lopez",
      role: "user",
      createdAt: new Date(),
    },
    restaurantId: "2",
    rating: 5,
    title: "El mejor sushi de la ciudad",
    content:
      "Increible frescura en todos los cortes. El chef sabe lo que hace y se nota en cada pieza. La experiencia omakase es imperdible.",
    createdAt: new Date("2025-12-20"),
    updatedAt: new Date("2025-12-20"),
  },
  {
    id: "4",
    userId: "1",
    user: {
      id: "1",
      email: "user@demo.com",
      name: "Carlos Martinez",
      role: "user",
      createdAt: new Date(),
    },
    restaurantId: "2",
    rating: 4,
    title: "Muy recomendable",
    content:
      "El Dragon Roll es espectacular y el Ramen muy autentico. El servicio es un poco lento en horas pico pero vale la pena la espera.",
    createdAt: new Date("2025-12-18"),
    updatedAt: new Date("2025-12-18"),
  },
  {
    id: "5",
    userId: "4",
    user: {
      id: "4",
      email: "ana@example.com",
      name: "Ana Fernandez",
      role: "user",
      createdAt: new Date(),
    },
    restaurantId: "4",
    rating: 5,
    title: "Tacos autenticos!",
    content:
      "Los tacos al pastor son los mejores que he probado. El trompo esta perfectamente cocido y las salsas son increibles. Precios muy accesibles.",
    createdAt: new Date("2025-12-22"),
    updatedAt: new Date("2025-12-22"),
  },
];

// ==================== RESERVAS ====================
export const reservations: Reservation[] = [
  {
    id: "1",
    userId: "1",
    restaurantId: "1",
    restaurant: restaurants[0],
    date: new Date("2026-02-10"),
    time: "20:00",
    guests: 4,
    status: "confirmed",
    notes: "Mesa cerca de la ventana si es posible",
    createdAt: new Date(),
  },
  {
    id: "2",
    userId: "1",
    restaurantId: "2",
    restaurant: restaurants[1],
    date: new Date("2026-02-15"),
    time: "19:30",
    guests: 2,
    status: "pending",
    createdAt: new Date(),
  },
];

// ==================== MESAS ====================
export const tables: Table[] = [
  { id: "1", restaurantId: "1", number: 1, capacity: 2, status: "available" },
  {
    id: "2",
    restaurantId: "1",
    number: 2,
    capacity: 2,
    status: "occupied",
    currentOrderId: "1",
  },
  { id: "3", restaurantId: "1", number: 3, capacity: 4, status: "reserved" },
  { id: "4", restaurantId: "1", number: 4, capacity: 4, status: "available" },
  { id: "5", restaurantId: "1", number: 5, capacity: 6, status: "available" },
  {
    id: "6",
    restaurantId: "1",
    number: 6,
    capacity: 6,
    status: "occupied",
    currentOrderId: "2",
  },
  { id: "7", restaurantId: "1", number: 7, capacity: 8, status: "available" },
  { id: "8", restaurantId: "1", number: 8, capacity: 8, status: "reserved" },
];

// ==================== ORDENES ====================
export const orders: Order[] = [
  {
    id: "1",
    userId: "1",
    restaurantId: "1",
    restaurant: restaurants[0],
    items: [
      {
        id: "1",
        productId: "3",
        product: products[2],
        quantity: 2,
        price: 175,
      },
      {
        id: "2",
        productId: "5",
        product: products[4],
        quantity: 1,
        price: 195,
      },
    ],
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "card",
    tableId: "2",
    total: 545,
    createdAt: new Date("2026-01-28"),
    updatedAt: new Date("2026-01-28"),
  },
  {
    id: "2",
    userId: "1",
    restaurantId: "2",
    restaurant: restaurants[1],
    items: [
      {
        id: "3",
        productId: "8",
        product: products[7],
        quantity: 2,
        price: 245,
      },
      {
        id: "4",
        productId: "11",
        product: products[10],
        quantity: 1,
        price: 175,
      },
    ],
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "cash",
    total: 665,
    createdAt: new Date("2026-01-25"),
    updatedAt: new Date("2026-01-25"),
  },
];

// ==================== TICKETS ====================
export const tickets: Ticket[] = [
  {
    id: "1",
    orderId: "1",
    order: orders[0],
    userId: "1",
    restaurantName: "La Trattoria Italiana",
    items: orders[0].items,
    subtotal: 495,
    tax: 50,
    total: 545,
    paymentMethod: "card",
    createdAt: new Date("2026-01-28"),
  },
  {
    id: "2",
    orderId: "2",
    order: orders[1],
    userId: "1",
    restaurantName: "Sakura Sushi Bar",
    items: orders[1].items,
    subtotal: 605,
    tax: 60,
    total: 665,
    paymentMethod: "cash",
    cashReceived: 700,
    change: 35,
    createdAt: new Date("2026-01-25"),
  },
];

// ==================== ESTADISTICAS DASHBOARD ====================
export const dashboardStats = {
  totalRestaurants: 6,
  totalUsers: 1250,
  totalOrders: 3456,
  totalRevenue: 567890,
  ordersToday: 45,
  revenueToday: 12500,
  topRestaurants: restaurants.slice(0, 3),
  recentOrders: orders,
};
