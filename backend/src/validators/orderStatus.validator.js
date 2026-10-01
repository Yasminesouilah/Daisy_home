import { z } from "zod";

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});