import { generateOrderId } from "../utils/generateOrderId.js";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createOrder({ customer, lines, subtotal, deliveryFee, total }) {
  await delay();
  return {
    orderNumber: generateOrderId(),
    customer,
    items: lines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      image: line.product.images?.[0] ?? line.product.image,
      price: line.product.price,
      quantity: line.quantity,
      variant: line.variant,
    })),
    subtotal,
    deliveryFee,
    total,
    paymentMethod: "COD",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}