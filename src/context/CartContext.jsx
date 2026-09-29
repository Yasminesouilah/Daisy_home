import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { getProductsByIds } from "../services/productService";
import { useUI } from "../hooks/useUI";
import { lineKey } from "../utils/cart";
import {
  CART_STORAGE_KEY,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  MAX_QTY_PER_ITEM,
} from "../config/constants";

export const CartContext = createContext(null);

// The stored cart only holds ids and quantities: [{ productId, variant, quantity }]
function loadItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const clamp = (q) => Math.max(1, Math.min(q, MAX_QTY_PER_ITEM));

function reducer(items, action) {
  switch (action.type) {
    case "ADD": {
      const { productId, variant, quantity } = action;
      const key = lineKey(productId, variant);
      const exists = items.some((i) => lineKey(i.productId, i.variant) === key);
      if (exists) {
        return items.map((i) =>
          lineKey(i.productId, i.variant) === key
            ? { ...i, quantity: clamp(i.quantity + quantity) }
            : i
        );
      }
      return [...items, { productId, variant: variant || null, quantity: clamp(quantity) }];
    }
    case "REMOVE":
      return items.filter((i) => lineKey(i.productId, i.variant) !== action.key);
    case "SET_QTY":
      return items.map((i) =>
        lineKey(i.productId, i.variant) === action.key
          ? { ...i, quantity: clamp(action.quantity) }
          : i
      );
    case "CLEAR":
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadItems);
  const [catalog, setCatalog] = useState({}); // productId -> product (or null if not found)
  const { openCart } = useUI();

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable, ignore */
    }
  }, [items]);

  // Load product details for cart items we don't know yet
  useEffect(() => {
    const missing = [...new Set(items.map((i) => i.productId))].filter(
      (id) => !(id in catalog)
    );
    if (missing.length === 0) return;

    let cancelled = false;
    getProductsByIds(missing).then((found) => {
      if (cancelled) return;
      setCatalog((prev) => {
        const next = { ...prev };
        missing.forEach((id) => (next[id] = null));
        found.forEach((p) => (next[p.id] = p));
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [items, catalog]);

  const value = useMemo(() => {
    const lines = items
      .map((i) => ({
        ...i,
        key: lineKey(i.productId, i.variant),
        product: catalog[i.productId],
      }))
      .filter((l) => l.product); // hides unknown or still-loading products

    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

    return {
      lines,
      count,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      loading: items.some((i) => !(i.productId in catalog)),
      addItem: (productId, { quantity = 1, variant = null } = {}) => {
        dispatch({ type: "ADD", productId, variant, quantity });
        openCart();
      },
      removeItem: (key) => dispatch({ type: "REMOVE", key }),
      updateQuantity: (key, quantity) => dispatch({ type: "SET_QTY", key, quantity }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [items, catalog, openCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}