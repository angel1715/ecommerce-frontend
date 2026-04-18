"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export default function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
      );
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must login first");
        return;
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product?._id,
          quantity: 1,
        }),
      });

      alert("Added to cart!");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <button onClick={() => router.back()} className="mb-6 text-gray-600">
        ← Back
      </button>

      <div className="bg-white p-8 rounded-xl shadow-lg grid md:grid-cols-2 gap-10">
        {/* 🖼️ IMAGE */}
        <div className="bg-gray-100 rounded-xl flex items-center justify-center h-80">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full object-contain"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        {/* 📦 INFO */}
        <div>
          <h1 className="text-gray-900 text-3xl font-bold mb-4"></h1>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <p className="text-gray-700 text-2xl font-bold mb-6">
            ${product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            Add to Cart
          </button>

          <button
            onClick={() => router.push("/cart")}
            className="bg-blue-700 ml-4 border px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
