// One cart line = one product + one variant
export const lineKey = (productId, variant) => `${productId}::${variant || ""}`;