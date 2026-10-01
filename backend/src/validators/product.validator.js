import { z } from "zod";

const variantGroupSchema = z.object({
  label: z.string().trim().min(1, "Le nom de variante est requis."),
  options: z.array(z.string().trim().min(1)).min(1, "Ajoutez au moins une option."),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis."),
  slug: z
    .string()
    .trim()
    .min(2, "Le slug est requis.")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets."),
  category: z
    .string()
    .trim()
    .min(2, "La catégorie est requise.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "La catégorie doit être un slug en minuscules, chiffres et tirets."),
  price: z.number().positive("Le prix doit être positif."),
  oldPrice: z.number().positive().nullable().optional(),
  description: z.string().trim().optional().default(""),
  variants: z.array(variantGroupSchema).optional().default([]),
  isNew: z.boolean().optional().default(false),
  stock: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const productUpdateSchema = productSchema.partial();