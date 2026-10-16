import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";

export const dynamic = "force-dynamic";

// Standard delivery coordinates for Addis Ababa neighborhoods
const AREA_COORDINATES = {
  Bole: [8.9950, 38.7890],
  Kazanchis: [9.0180, 38.7690],
  Megenagna: [9.0210, 38.8020],
  Piassa: [9.0350, 38.7520],
  CMC: [9.0150, 38.8350],
};

const RESTAURANT_COORDS = [9.0200, 38.7600]; // Addis Eats HQ / Kitchen location

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "UNAUTHORIZED" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await params;
  const order = getOrderById(id);

  if (!order || (order.ownerId !== session.id && session.role !== "staff" && session.role !== "admin")) {
    return new Response(JSON.stringify({ error: "NOT_FOUND" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const targetCoords = AREA_COORDINATES[order.area] || [9.0100, 38.7700];

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Progress counter for simulating courier movement towards delivery location
      let step = 0;
      const totalSteps = 10;

      // Seed initial status from server
      const currentOrder = getOrderById(id) || order;
      sendEvent({
        id: currentOrder.id,
        status: currentOrder.status,
        area: currentOrder.area || "Addis Ababa",
        total: currentOrder.total,
        items: currentOrder.items || [],
        createdAt: currentOrder.createdAt,
        updatedAt: currentOrder.updatedAt || currentOrder.createdAt,
        restaurantLocation: RESTAURANT_COORDS,
        deliveryLocation: targetCoords,
        courierLocation: RESTAURANT_COORDS,
        etaMinutes: currentOrder.status === "delivered" ? 0 : 25,
      });

      // If already terminal state (delivered or cancelled), close stream after seeding
      if (currentOrder.status === "delivered" || currentOrder.status === "cancelled") {
        controller.close();
        return;
      }

      const intervalId = setInterval(() => {
        const freshOrder = getOrderById(id);
        if (!freshOrder) {
          clearInterval(intervalId);
          controller.close();
          return;
        }

        step = Math.min(step + 1, totalSteps);
        const progress = step / totalSteps;

        // Interpolate courier coordinates from restaurant to delivery
        const courierLat = RESTAURANT_COORDS[0] + (targetCoords[0] - RESTAURANT_COORDS[0]) * progress;
        const courierLng = RESTAURANT_COORDS[1] + (targetCoords[1] - RESTAURANT_COORDS[1]) * progress;

        const eta = Math.max(0, Math.round(25 * (1 - progress)));

        sendEvent({
          id: freshOrder.id,
          status: freshOrder.status,
          area: freshOrder.area || "Addis Ababa",
          total: freshOrder.total,
          items: freshOrder.items || [],
          createdAt: freshOrder.createdAt,
          updatedAt: new Date().toISOString(),
          restaurantLocation: RESTAURANT_COORDS,
          deliveryLocation: targetCoords,
          courierLocation: [Number(courierLat.toFixed(5)), Number(courierLng.toFixed(5))],
          etaMinutes: freshOrder.status === "delivered" ? 0 : eta,
        });

        if (freshOrder.status === "delivered" || freshOrder.status === "cancelled" || step >= totalSteps) {
          clearInterval(intervalId);
          controller.close();
        }
      }, 4000);

      request.signal?.addEventListener("abort", () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
