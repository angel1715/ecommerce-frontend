"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";
type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

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
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!name || !address || !card) {
      toast.error("Please fill all fields");
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      if (items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          total,
          shippingAddress: address,
        }),
      });

      toast.success("Order placed successfully!");

      router.push("/orders");
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed");
    }
  };

  if (loading) {
    return <p className="p-6">Loading checkout...</p>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8 grid md:grid-cols-2 gap-10">
        {/* 🧾 ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-600 text-2xl font-bold mb-4">
            Order Summary
          </h2>

          {items.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-3">
              <span className="text-gray-600">
                {item.product.name} x{item.quantity}
              </span>
              <span className="text-gray-600">
                ${item.product.price * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <p className="text-gray-600 text-lg font-bold">Total: ${total}</p>
        </div>

        {/* 💳 PAYMENT FORM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-600 text-2xl font-bold mb-4">
            Payment Details
          </h2>

          <input
            placeholder="Full Name"
            className="text-gray-500 w-full p-3 border rounded mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Shipping Address"
            className="text-gray-500 w-full p-3 border rounded mb-3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            placeholder="Card Number"
            maxLength={16}
            className="text-gray-500 w-full p-3 border rounded mb-4"
          />

          <button
            onClick={handleCheckout}
            disabled={processing}
            className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50 hover:opacity-80 transition"
          >
            {processing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
