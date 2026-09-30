import { z } from "zod";

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Le nom est requis."),
    phone: z.string().trim().optional().default(""),
    email: z.string().trim().email("Email invalide.").optional().or(z.literal("")),
    message: z.string().trim().min(10, "Le message est trop court."),
  })
  .refine((data) => data.phone || data.email, {
    message: "Indiquez un téléphone ou un email.",
    path: ["phone"],
  });