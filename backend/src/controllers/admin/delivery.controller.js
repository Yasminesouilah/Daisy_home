import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { updateDeliveryRateSchema } from "../../validators/deliveryRate.validator.js";

export async function listAdminDeliveryRates(req, res) {
  const rates = await prisma.deliveryRate.findMany({ orderBy: { code: "asc" } });
  res.json(rates);
}

export async function updateAdminDeliveryRate(req, res) {
  const parsed = updateDeliveryRateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Tarif invalide.");
  }

  const existing = await prisma.deliveryRate.findUnique({ where: { code: req.params.code } });
  if (!existing) throw new ApiError(404, "Tarif de livraison introuvable.");

  const rate = await prisma.deliveryRate.update({
    where: { code: req.params.code },
    data: parsed.data,
  });
  res.json(rate);
}