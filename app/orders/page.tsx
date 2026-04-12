"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Orders</h1>

        {orders.map((order) => (
          <div key={order._id} className="border p-4 mb-2">
            <p>{new Date(order.createdAt).toLocaleString()}</p>

            {order.items.map((item: any) => (
              <div key={item.product._id}>
                <p>{item.product.name}</p>
                <p>
                  ${item.price} x {item.quantity}
                </p>
              </div>
            ))}

            <h2>Total: ${order.total}</h2>
          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}
