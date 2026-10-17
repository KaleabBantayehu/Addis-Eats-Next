"use server";

import { revalidatePath } from "next/cache";

import {
  getFieldErrors,
  orderSchema,
} from "../lib/schema";

import {
  getSession,
} from "../lib/session";

import {
  getOrderById,
  markOrderCancelled,
  updateOrderStatus,
} from "../lib/orders";

import { createOrderFromInput } from "../lib/order-service";

function parseItems(value) {
  try {
    return JSON.parse(
      String(value ?? "[]")
    );
  } catch {
    return [];
  }
}

export async function placeOrder(
  previousState,
  formData
) {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      message: "Sign in before placing an order.",
      fieldErrors: {},
      orderId: null,
    };
  }

  const rawOrder = {
    name: String(
      formData.get("name") ?? ""
    ),

    phone: String(
      formData.get("phone") ?? ""
    ),

    area: String(
      formData.get("area") ?? ""
    ),

    notes: String(
      formData.get("notes") ?? ""
    ),

    items: parseItems(
      formData.get("items")
    ),
  };

  const validation =
    orderSchema.safeParse(rawOrder);

  if (!validation.success) {
    return {
      success: false,

      message:
        "Please correct the invalid fields.",

      fieldErrors: getFieldErrors(
        validation.error
      ),

      orderId: null,
    };
  }

  const result = await createOrderFromInput(
    validation.data,
    session.id
  );

  if (!result.ok) {
    return {
      success: false,

      message:
        "The order contains invalid dishes.",

      fieldErrors:
        result.fieldErrors,

      orderId: null,
    };
  }

  revalidatePath("/orders");

  return {
    success: true,

    message:
      "Your order was placed successfully.",

    fieldErrors: {},

    orderId: result.order.id,
  };
}


export async function cancelOrder(
  formData
) {
  const orderId = String(
    formData.get("orderId") ?? ""
  );

  const session =
    await getSession();

  if (!session) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      message:
        "You must have a valid session.",
    };
  }

  const order = await getOrderById(orderId);

  if (!order || order.ownerId !== session.id) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "Order not found.",
    };
  }

  if (order.status === "cancelled" || order.status === "delivered") {
    return {
      success: false,
      code: "ORDER_CLOSED",
      message:
        "This order can no longer be cancelled.",
    };
  }

  const cancelled = await markOrderCancelled(order.id);
  if (!cancelled) {
    return {
      success: false,
      code: "ORDER_CLOSED",
      message: "This order can no longer be cancelled.",
    };
  }

  revalidatePath("/orders");

  return {
    success: true,
    message:
      "Order cancelled successfully.",
  };
}

export async function updateOrderStatusAction(formData) {
  const session = await getSession();

  if (!session || session.role !== "staff") {
    return {
      success: false,
      code: "FORBIDDEN",
      message: "Staff access is required.",
    };
  }

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowedTransitions = {
    placed: ["preparing"],
    preparing: ["out-for-delivery"],
    "out-for-delivery": ["delivered"],
  };
  const order = await getOrderById(orderId);

  if (!order) {
    return {
      success: false,
      code: "NOT_FOUND",
      message: "Order not found.",
    };
  }

  if (!allowedTransitions[order.status]?.includes(status)) {
    return {
      success: false,
      code: "INVALID_STATUS",
      message: "That status is not the next valid status for this order.",
    };
  }

  const updated = await updateOrderStatus(orderId, status);
  if (!updated) {
    return {
      success: false,
      code: "INVALID_STATUS",
      message: "That status is not the next valid status for this order.",
    };
  }
  revalidatePath("/kitchen");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true, message: "Order status updated." };
}
