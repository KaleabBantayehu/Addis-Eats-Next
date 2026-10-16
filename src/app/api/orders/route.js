import {
  getFieldErrors,
  orderSchema,
} from "../../../lib/schema";

import { getSession } from "../../../lib/session";

import { createOrderFromInput } from "../../../lib/order-service";

export async function POST(request) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Sign in before placing an order.",
        },
      },
      { status: 401 },
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: {
          code: "INVALID_JSON",
          message:
            "Request body must contain valid JSON.",
        },
      },
      {
        status: 400,
      }
    );
  }

  const validation =
    orderSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Please correct the invalid fields.",
        },

        fieldErrors: getFieldErrors(
          validation.error
        ),
      },
      {
        status: 422,
      }
    );
  }

  const result = await createOrderFromInput(
    validation.data,
    session.id
  );

  if (!result.ok) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message:
            "The order contains invalid dishes.",
        },

        fieldErrors:
          result.fieldErrors,
      },
      {
        status: 422,
      }
    );
  }

  return Response.json(
    {
      data: result.order,
    },
    {
      status: 201,
    }
  );
}
