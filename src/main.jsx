import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/home.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UIProvider>
        <CartProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </CartProvider>
      </UIProvider>
    </BrowserRouter>
  </StrictMode>
);