"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductsPage() {
  type Product = {
    _id: string;
    name: string;
    price: number;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      toast.error("You must login first");
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

      toast.success("Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Error adding to cart");
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

            <div className="flex gap-2 mt-4">
              {/* 🔍 VER PRODUCTO */}
              <button
                onClick={() => router.push(`/products/${product._id}`)}
                className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-xl"
              >
                View
              </button>

              {/* 🛒 ADD TO CART */}
              <button
                onClick={() => addToCart(product._id)}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}
