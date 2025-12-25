"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product._id === product._id &&
          item.product.selectedSize === product.selectedSize
      );

      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id &&
          item.product.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
        },
      ];
    });
  };
  const clearCart = () => setCart([]);

  const removeFromCart = (productId, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product._id === productId && item.product.selectedSize === size
          )
      )
    );
  };

  const increaseQuantity = (productId, size) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId && item.product.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId, size) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product._id === productId && item.product.selectedSize === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
