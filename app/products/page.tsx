"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Obtener productos
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // 🔥 Add to Cart
  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must login first");
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      alert("Added to cart");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart");
    }
  };

  // 🔥 Loading UI
  if (loading) {
    return (
      <ProtectedRoute>
        <p className="p-6">Loading products...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-2xl p-4 hover:scale-105 transition"
          >
            <h2 className="text-gray-600 text-xl font-semibold">
              {product.name}
            </h2>

            <p className="text-gray-600 mt-2">${product.price}</p>

            <button
              onClick={() => addToCart(product._id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-4 rounded-xl w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}
