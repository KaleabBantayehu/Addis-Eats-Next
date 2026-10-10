import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string().min(1, {
    error: "Dish id is required.",
  }),

  quantity: z
    .number()
    .int({
      error: "Quantity must be a whole number.",
    })
    .min(1, {
      error: "Quantity must be at least 1.",
    })
    .max(20, {
      error: "Maximum quantity is 20.",
    }),
});

export const orderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      error: "Name must be at least 2 characters.",
    })
    .max(80, {
      error: "Name is too long.",
    }),

  phone: z
    .string()
    .trim()
    .regex(/^(?:\+251|0)(?:7|9)\d{8}$/, {
      error:
        "Enter a valid Ethiopian phone number.",
    }),

  area: z
    .string()
    .trim()
    .min(2, {
      error: "Delivery area is required.",
    })
    .max(80, {
      error: "Delivery area is too long.",
    }),

  notes: z
    .string()
    .trim()
    .max(300, {
      error: "Notes cannot exceed 300 characters.",
    })
    .optional()
    .default(""),

  items: z
    .array(orderItemSchema)
    .min(1, {
      error: "Your cart is empty.",
    }),
});

export function getFieldErrors(error) {
  return z.flattenError(error).fieldErrors;
}