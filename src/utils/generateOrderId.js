export function generateOrderId() {
  const number = 1000 + Math.floor(Math.random() * 9000);
  return `DH-${number}`;
}