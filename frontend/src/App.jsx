import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import CartDrawer from "./components/layout/CartDrawer/CartDrawer";
import WhatsAppButton from "./components/layout/WhatsAppButton/WhatsAppButton";
import PageTransition from "./components/layout/PageTransition/PageTransition";

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="admin-auth-loading">Chargement...</div>}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Aller au contenu</a>
      <Navbar />
      <ScrollToTop />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}