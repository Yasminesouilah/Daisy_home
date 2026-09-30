import { prisma } from "../lib/prisma.js";
import { contactSchema } from "../validators/contact.validator.js";
import { ApiError } from "../utils/ApiError.js";

export async function sendMessage(req, res) {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Données invalides.";
    throw new ApiError(400, firstError);
  }

  const message = await prisma.message.create({ data: parsed.data });

  res.status(201).json({ ok: true, id: message.id });
}