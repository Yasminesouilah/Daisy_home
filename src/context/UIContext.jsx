import { createContext, useMemo, useState } from "react";

export const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
    }),
    [isCartOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}