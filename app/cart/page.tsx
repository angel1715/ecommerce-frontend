"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  if (!cart) return <p className="p-6">Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Cart</h1>

        {cart.items.map((item: any) => (
          <div key={item.product._id}>
            <p>{item.product.name}</p>
            <p>{item.quantity}</p>
          </div>
        ))}

        <h2>Total: ${cart.total}</h2>
      </div>
    </ProtectedRoute>
  );
}
