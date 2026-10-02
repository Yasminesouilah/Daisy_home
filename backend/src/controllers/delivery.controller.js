import { prisma } from "../lib/prisma.js";

export async function getDeliveryFees(req, res) {
  const rates = await prisma.deliveryRate.findMany({ orderBy: { code: "asc" } });
  res.json(rates.map((rate) => ({ ...rate, fee: rate.homeFee })));
}