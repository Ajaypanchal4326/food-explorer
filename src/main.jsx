import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage"; // ✅ You'll add this page
import { CartProvider } from "./context/cartcontext"; // ✅ Create this file

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter basename="/food-explorer">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/product/:barcode" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} /> {/* ✅ New Cart Page */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
