import { z } from "zod";

const customerSchema = z.object({
  fullName: z.string().trim().min(3, "Le nom complet est requis."),
  phone: z
    .string()
    .trim()
    .regex(
      /^0[5-7](\s|-)?\d{2}(\s|-)?\d{2}(\s|-)?\d{2}(\s|-)?\d{2}$/,
      "Numéro de téléphone invalide.",
    ),
  wilaya: z.string().trim().min(1, "La wilaya est requise."),
  commune: z.string().trim().min(1, "La commune est requise."),
  address: z.string().trim().min(8, "L'adresse est trop courte."),
  notes: z.string().trim().optional().default(""),
});

const itemSchema = z.object({
  productId: z.string().min(1, "Identifiant produit invalide."),
  quantity: z.number().int().min(1).max(10),
  variant: z.string().nullable().optional().default(null),
});

export const createOrderSchema = z.object({
  customer: customerSchema,
  items: z.array(itemSchema).min(1, "Le panier est vide."),
});