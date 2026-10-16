// src/data/orders.js

export const orders = [
  {
    id: "ORD-1001",
    customerName: "Abebe Bikila",
    area: "Bole",
    items: ["Special Kitfo", "Soft Drink"],
    total: 360,
    status: "Delivered",
    createdAt: "2026-10-01T12:30:00Z",
  },
  {
    id: "ORD-1002",
    customerName: "Tigist Assefa",
    area: "Kazanchis",
    items: ["Doro Wat", "Tella"],
    total: 490,
    status: "Delivered",
    createdAt: "2026-10-01T13:15:00Z",
  },
  {
    id: "ORD-1003",
    customerName: "Yared Negu",
    area: "Megenagna",
    items: ["Beef Tibs", "Mineral Water"],
    total: 410,
    status: "Delivered",
    createdAt: "2026-10-02T18:45:00Z",
  },
  {
    id: "ORD-1004",
    customerName: "Marta Gelana",
    area: "Bole",
    items: ["Vegetarian Firfir"],
    total: 220,
    status: "Preparing",
    createdAt: "2026-10-02T19:10:00Z",
  },
  {
    id: "ORD-1005",
    customerName: "Dawit Chernet",
    area: "Piassa",
    items: ["Special Kitfo", "Beef Tibs"],
    total: 700,
    status: "Delivered",
    createdAt: "2026-10-03T11:20:00Z",
  },
  {
    id: "ORD-1006",
    customerName: "Sifan Hassan",
    area: "Kazanchis",
    items: ["Chicken Pizza"],
    total: 450,
    status: "Delivered",
    createdAt: "2026-10-03T14:00:00Z",
  },
  {
    id: "ORD-1007",
    customerName: "Ermias Amelga",
    area: "CMC",
    items: ["Beef Pepperoni Pizza", "Soft Drink"],
    total: 520,
    status: "Cancelled",
    createdAt: "2026-10-04T12:00:00Z",
  },
  {
    id: "ORD-1008",
    customerName: "Bethlehem Tilahun",
    area: "Bole",
    items: ["Doro Wat", "Special Kitfo"],
    total: 770,
    status: "Delivered",
    createdAt: "2026-10-04T20:30:00Z",
  },
  {
    id: "ORD-1009",
    customerName: "Lidya Tafesse",
    area: "Megenagna",
    items: ["Vegetarian Firfir"],
    total: 220,
    status: "Delivered",
    createdAt: "2026-10-05T08:15:00Z",
  },
  {
    id: "ORD-1010",
    customerName: "Kenenisa Bekele",
    area: "CMC",
    items: ["Beef Tibs", "Doro Wat"],
    total: 830,
    status: "Delivered",
    createdAt: "2026-10-05T13:40:00Z",
  },
  {
    id: "ORD-1011",
    customerName: "Helina Tilaye",
    area: "Piassa",
    items: ["Special Kitfo"],
    total: 320,
    status: "Delivered",
    createdAt: "2026-10-06T12:10:00Z",
  },
  {
    id: "ORD-1012",
    customerName: "Bruk Tesfaye",
    area: "Kazanchis",
    items: ["Chicken Pizza", "Soft Drink"],
    total: 490,
    status: "Preparing",
    createdAt: "2026-10-06T18:00:00Z",
  },
];

// Helper to fetch orders with mock network delay for testing loading skeletons
export async function getOrders() {
  // Simulate a 500ms server response delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return orders;
}