import { createContext, useEffect, useMemo, useState } from "react";
import { ORDER_STORAGE_KEY } from "../config/constants";

export const OrderContext = createContext(null);

function loadOrder() {
  try {
    return JSON.parse(sessionStorage.getItem(ORDER_STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function OrderProvider({ children }) {
  const [lastOrder, setLastOrderState] = useState(loadOrder);

  useEffect(() => {
    try {
      if (lastOrder) sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      else sessionStorage.removeItem(ORDER_STORAGE_KEY);
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }, [lastOrder]);

  const value = useMemo(() => ({
    lastOrder,
    setLastOrder: setLastOrderState,
    clearLastOrder: () => setLastOrderState(null),
    lastPlacedOrder: lastOrder,
    setLastPlacedOrder: setLastOrderState,
  }), [lastOrder]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}