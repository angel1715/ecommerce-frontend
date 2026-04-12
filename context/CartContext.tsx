"use client";

import { createContext, useContext, useState } from "react";

interface CartContextType {
  cart: any;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any>(null);

  const fetchCart = async () => {
    const res = await fetch("http://localhost:4000/api/cart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setCart(data);
  };

  const addToCart = async (productId: string) => {
    await fetch("http://localhost:4000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext)!;
};
