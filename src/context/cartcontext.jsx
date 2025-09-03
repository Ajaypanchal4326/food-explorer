import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const getUniqueKey = (item) => {
    return (
      item.code || item._id || item.product_name || `product_${Math.random()}`
    );
  };

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, { ...product }]);
  };

  const removeFromCart = (uniqueKey) => {
    setCartItems((prev) =>
      prev.filter((item) => getUniqueKey(item) !== uniqueKey)
    );
  };

  const updateQuantity = (uniqueKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(uniqueKey);
      return;
    }

    const existingItem = cartItems.find(
      (item) => getUniqueKey(item) === uniqueKey
    );
    if (!existingItem) {
      return;
    }

    const filteredItems = cartItems.filter(
      (item) => getUniqueKey(item) !== uniqueKey
    );

    const newItems = Array(newQuantity)
      .fill()
      .map(() => ({ ...existingItem }));

    setCartItems([...filteredItems, ...newItems]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getGroupedItems = () => {
    return cartItems.reduce((acc, item) => {
      const key = getUniqueKey(item);
      if (acc[key]) {
        acc[key].quantity += 1;
      } else {
        acc[key] = { ...item, quantity: 1, uniqueKey: key };
      }
      return acc;
    }, {});
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getGroupedItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
