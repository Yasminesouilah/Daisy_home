import { generateOrderId } from "../utils/generateOrderId.js";
import { api, hasApi } from "./api.js";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createOrder({ customer, lines, subtotal, deliveryFee, total }) {
  if (hasApi()) {
    return api("/orders", {
      method: "POST",
      body: JSON.stringify({
        customer: {
          fullName: customer.fullName,
          phone: customer.phone,
          wilaya: customer.wilaya,
          commune: customer.commune,
          address: customer.address,
          notes: customer.notes || "",
        },
        items: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
          variant: line.variant || null,
        })),
      }),
    });
  }

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