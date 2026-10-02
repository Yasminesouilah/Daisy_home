import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

const PAGE_SIZE = 20;

function parsePage(value) {
  if (typeof value !== "string") throw new ApiError(400, "La page demandée est invalide.");
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger((page - 1) * PAGE_SIZE)) {
    throw new ApiError(400, "La page demandée est invalide.");
  }
  return page;
}

export async function listAdminMessages(req, res) {
  const page = parsePage(req.query.page ?? "1");
  const where = {};

  if (req.query.isRead !== undefined) {
    if (req.query.isRead !== "true" && req.query.isRead !== "false") {
      throw new ApiError(400, "Le filtre de lecture est invalide.");
    }
    where.isRead = req.query.isRead === "true";
  }

  const [items, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.message.count({ where }),
  ]);

  res.json({ items, page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) });
}

export async function markMessageRead(req, res) {
  const existing = await prisma.message.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Message introuvable.");

  const message = await prisma.message.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });

  res.json(message);
}

export async function deleteMessage(req, res) {
  const existing = await prisma.message.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Message introuvable.");

  await prisma.message.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
}