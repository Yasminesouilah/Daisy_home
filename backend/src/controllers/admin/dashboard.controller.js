import { prisma } from "../../lib/prisma.js";

const LOW_STOCK_THRESHOLD = 5;

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfWeek() {
  const date = startOfToday();
  date.setDate(date.getDate() - date.getDay());
  return date;
}

export async function getDashboardStats(req, res) {
  const todayStart = startOfToday();
  const weekStart = startOfWeek();

  const [
    ordersToday,
    ordersThisWeek,
    pendingOrders,
    revenue,
    lowStockProducts,
    unreadMessages,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.aggregate({
      where: { status: { not: "cancelled" } },
      _sum: { total: true },
    }),
    prisma.product.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD }, isActive: true },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true, images: true },
    }),
    prisma.message.count({ where: { isRead: false } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
        customer: true,
      },
    }),
  ]);

  res.json({
    ordersToday,
    ordersThisWeek,
    pendingOrders,
    totalRevenue: revenue._sum.total || 0,
    lowStockProducts,
    unreadMessages,
    recentOrders,
  });
}