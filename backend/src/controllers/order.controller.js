import { prisma } from "../lib/prisma.js";
import { WILAYAS } from "../data/wilayas.js";
import { ApiError } from "../utils/ApiError.js";
import { createOrderSchema } from "../validators/order.validator.js";

const FREE_DELIVERY_THRESHOLD = 15000;

export async function createOrder(req, res) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Données invalides.";
    throw new ApiError(400, firstError);
  }

  const { customer, items, deliveryMethod } = parsed.data;
  const wilaya = WILAYAS.find((entry) => entry.code === customer.wilaya);
  if (!wilaya) throw new ApiError(400, "Wilaya invalide.");

  const order = await prisma.$transaction(async (tx) => {
    const deliveryRate = await tx.deliveryRate.findUnique({ where: { code: wilaya.code } });
    if (!deliveryRate) throw new ApiError(400, "Tarifs de livraison indisponibles pour cette wilaya.");

    const requestedQuantities = new Map();
    for (const item of items) {
      requestedQuantities.set(
        item.productId,
        (requestedQuantities.get(item.productId) || 0) + item.quantity,
      );
    }

    const products = await tx.product.findMany({
      where: { id: { in: [...requestedQuantities.keys()] }, isActive: true },
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const productId of requestedQuantities.keys()) {
      if (!productMap.has(productId)) {
        throw new ApiError(400, `Produit introuvable ou indisponible (id: ${productId}).`);
      }
    }

    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);

      if (
        item.variant &&
        !product.variants.some((group) => group.options.includes(item.variant))
      ) {
        throw new ApiError(400, `Variante invalide pour "${product.name}".`);
      }

      return {
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || null,
        price: product.price,
        quantity: item.quantity,
        variant: item.variant || null,
      };
    });

    for (const [productId, quantity] of requestedQuantities) {
      const product = productMap.get(productId);
      if (product.stock < quantity) {
        throw new ApiError(
          409,
          `Stock insuffisant pour "${product.name}" (disponible : ${product.stock}).`,
        );
      }

      const update = await tx.product.updateMany({
        where: { id: productId, isActive: true, stock: { gte: quantity } },
        data: { stock: { decrement: quantity } },
      });

      if (update.count !== 1) {
        throw new ApiError(
          409,
          `Stock insuffisant pour "${product.name}" (disponible : ${product.stock}).`,
        );
      }
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const selectedDeliveryFee = deliveryMethod === "office"
      ? deliveryRate.officeFee
      : deliveryRate.homeFee;
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : selectedDeliveryFee;
    const counter = await tx.counter.upsert({
      where: { id: "orderNumber" },
      update: { seq: { increment: 1 } },
      create: { id: "orderNumber", seq: 1001 },
    });

    return tx.order.create({
      data: {
        orderNumber: `DH-${counter.seq}`,
        customer: { ...customer, wilayaName: wilaya.name },
        items: orderItems,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        deliveryMethod,
        paymentMethod: "COD",
        status: "pending",
      },
    });
  });

  res.status(201).json(order);
}