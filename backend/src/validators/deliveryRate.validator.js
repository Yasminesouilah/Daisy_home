import { z } from "zod";

export const updateDeliveryRateSchema = z.object({
  homeFee: z.number().int().min(0, "Le tarif domicile doit être positif ou nul."),
  officeFee: z.number().int().min(0, "Le tarif bureau doit être positif ou nul."),
});