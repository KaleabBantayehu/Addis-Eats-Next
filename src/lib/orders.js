const globalStore = globalThis;

if (!globalStore.__addisEatsOrders) {
  globalStore.__addisEatsOrders = [];
}

const orders = globalStore.__addisEatsOrders;

export function createOrder(data) {
  const order = {
    id: crypto.randomUUID(),
    status: "placed",
    createdAt: new Date().toISOString(),
    ...data,
  };

  orders.unshift(order);

  return order;
}

export function getOrderById(id) {
  return orders.find(
    (order) => order.id === id
  );
}

export function getOrdersByOwner(ownerId) {
  return orders.filter(
    (order) => order.ownerId === ownerId
  );
}

export function markOrderCancelled(id) {
  const order = getOrderById(id);

  if (!order) {
    return null;
  }

  order.status = "cancelled";
  order.cancelledAt =
    new Date().toISOString();

  return order;
}

export function updateOrderStatus(id, status) {
  const order = getOrderById(id);

  if (!order) return null;

  order.status = status;
  order.updatedAt = new Date().toISOString();

  return order;
}

export function getAllOrders() {
  return [...orders];
}