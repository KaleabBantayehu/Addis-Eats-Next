import "server-only";

import { createClient } from "@/lib/supabase/server";

const ORDER_COLUMNS =
  "id, owner_id, name, phone, area, notes, status, total, created_at, updated_at, order_items(id, dish_id, dish_name, unit_price, quantity, line_total)";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeOrder(order) {
  return {
    id: order.id,
    ownerId: order.owner_id,
    name: order.name,
    phone: order.phone,
    area: order.area,
    notes: order.notes ?? "",
    status: order.status,
    total: Number(order.total),
    createdAt: order.created_at,
    updatedAt: order.updated_at ?? order.created_at,
    items: (order.order_items ?? []).map((item) => ({
      id: String(item.dish_id),
      name: item.dish_name,
      price: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    })),
  };
}

export async function getOrderById(id) {
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Could not load the order:", error);
    throw new Error("This order is temporarily unavailable.");
  }

  return data ? normalizeOrder(data) : null;
}

export async function getOrdersByOwner(ownerId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load the user's orders:", error);
    throw new Error("Your orders are temporarily unavailable.");
  }

  return (data ?? []).map(normalizeOrder);
}

export async function getAllOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load orders for the kitchen:", error);
    throw new Error("Kitchen orders are temporarily unavailable.");
  }

  return (data ?? []).map(normalizeOrder);
}

export async function markOrderCancelled(id) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cancel_order", {
    p_order_id: id,
  });

  if (error) {
    console.error("Could not cancel the order:", error);
    throw new Error("This order could not be cancelled.");
  }

  return data === true;
}

export async function updateOrderStatus(id, status) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("advance_order_status", {
    p_order_id: id,
    p_next_status: status,
  });

  if (error) {
    console.error("Could not update the order status:", error);
    throw new Error("The order status could not be updated.");
  }

  return data === true;
}
