import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { ORDER_STATUSES, updateStatusSchema } from "../../validators/orderStatus.validator.js";

const PAGE_SIZE = 20;
const SEARCH_LIMIT = 200;

function queryString(value, label) {
  if (value === undefined) return "";
  if (typeof value !== "string") throw new ApiError(400, `${label} invalide.`);
  return value.trim();
}

function paginationValue(value) {
  if (typeof value !== "string") throw new ApiError(400, "La page demandée est invalide.");
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger((page - 1) * PAGE_SIZE)) {
    throw new ApiError(400, "La page demandée est invalide.");
  }
  return page;
}

export async function listAdminOrders(req, res) {
  const status = queryString(req.query.status, "Le statut");
  const query = queryString(req.query.q, "La recherche");
  const page = paginationValue(req.query.page ?? "1");

  if (status && !ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, "Statut de commande invalide.");
  }

  const where = {};
  if (status) where.status = status;
  if (query) where.orderNumber = { contains: query };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ items, page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) });
}

export async function searchAdminOrders(req, res) {
  const query = queryString(req.query.q, "La recherche");
  if (!query) return res.json({ items: [] });

  const needle = query.toLocaleLowerCase();
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: SEARCH_LIMIT,
  });
  const items = recentOrders.filter((order) => {
    const customer = order.customer;
    return (
      customer?.fullName?.toLocaleLowerCase().includes(needle) ||
      customer?.phone?.includes(query) ||
      order.orderNumber.toLocaleLowerCase().includes(needle)
    );
  });

  res.json({ items: items.slice(0, PAGE_SIZE) });
}

export async function getAdminOrder(req, res) {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) throw new ApiError(404, "Commande introuvable.");
  res.json(order);
}

export async function updateOrderStatus(req, res) {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Statut invalide.");
  }

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new ApiError(404, "Commande introuvable.");

    if (existing.status === "cancelled" && parsed.data.status !== "cancelled") {
      throw new ApiError(409, "Une commande annulée ne peut plus être réactivée.");
    }

    const changed = await tx.order.updateMany({
      where: { id: existing.id, status: existing.status },
      data: { status: parsed.data.status },
    });
    if (changed.count !== 1) {
      throw new ApiError(409, "La commande a été modifiée par une autre requête. Réessayez.");
    }

    if (parsed.data.status === "cancelled" && existing.status !== "cancelled") {
      const items = Array.isArray(existing.items) ? existing.items : [];
      await Promise.all(
        items
          .filter((item) => item?.productId && Number.isInteger(item.quantity) && item.quantity > 0)
          .map((item) =>
            tx.product.updateMany({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            }),
          ),
      );
    }

    return tx.order.findUnique({ where: { id: existing.id } });
  });

  res.json(order);
}