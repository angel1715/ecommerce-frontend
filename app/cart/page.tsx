"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setItems(data.items);

      // 🔥 calcular total
      const totalPrice = data.items.reduce(
        (acc: number, item: CartItem) =>
          acc + item.product.price * item.quantity,
        0,
      );

      setTotal(totalPrice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    fetchCart();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-gray-600 text-3xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* 🛒 ITEMS */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-gray-600 font-bold">{item.product.name}</h2>
                    <p className="text-gray-500">${item.product.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.product._id, item.quantity - 1);
                        }
                      }}
                      className="bg-gray-900 px-3 py-1 rounded hover:bg-gray-700"
                    >
                      -
                    </button>

                    <span className="text-gray-700">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="bg-gray-900 px-3 py-1 rounded hover:bg-gray-700"
                    >
                      +
                    </button>

                    <button
                      onClick={() => updateQuantity(item.product._id, 0)}
                      className="text-red-500 text-sm ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 💰 SUMMARY */}
            <div className="bg-white p-6 rounded-xl shadow h-fit">
              <h2 className="text-gray-600 text-xl font-bold mb-4">Order Summary</h2>

              <p className="text-gray-500 mb-4">
                Total: <span className="text-gray-600font-bold">${total}</span>
              </p>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-black text-white py-3 rounded-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
