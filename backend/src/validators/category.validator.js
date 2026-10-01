import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Le nom de la catégorie est requis."),
  slug: z
    .string()
    .trim()
    .min(2, "Le slug est requis.")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets."),
});