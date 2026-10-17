import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in to view this order." } },
      { status: 401 },
    );
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order || order.ownerId !== session.id) {
    return Response.json(
      { error: { code: "NOT_FOUND", message: "Order not found." } },
      { status: 404 },
    );
  }

  return Response.json(
    {
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
