"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const data = await res.json();
      setProducts(data.slice(0, 4));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* 🔥 NAVBAR */}
      <nav className="flex justify-between items-center p-5 shadow-md">
        <h1 className="text-2xl font-bold text-black">E-Shop</h1>

        <div className="flex gap-6 text-gray-600">
          <button onClick={() => router.push("/products")}>Products</button>
          <button onClick={() => router.push("/cart")}>Cart</button>
          <button
            onClick={() => router.push("/login")}
            className="bg-green-700 text-white px-4 py-1 rounded-lg hover:opacity-80 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-blue-800 text-white px-4 py-1 rounded-lg hover:opacity-80 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* 🚀 HERO */}
      <section className="text-center py-20 bg-gradient-to-r from-gray-100 to-gray-200">
        <h2 className="text-5xl font-bold mb-4">Shop Smart. Shop Easy.</h2>
        <p className="text-gray-600 mb-6">
          Discover high-quality products at unbeatable prices
        </p>

        <button
          onClick={() => router.push("/products")}
          className="bg-black text-white px-8 py-3 rounded-xl hover:scale-105 transition"
        >
          Browse Products
        </button>
      </section>

      {/* 🛍️ FEATURED */}
      <section className="p-10">
        <h3 className="text-black text-3xl font-bold mb-8 text-center">
          Featured Products
        </h3>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border rounded-xl p-4 hover:shadow-xl transition"
              >
                <div className="h-40 bg-gray-100 mb-4 flex items-center justify-center rounded-lg">
                  {product.image ? (
                    <img src={product.image} className="h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <h4 className="font-semibold text-lg">{product.name}</h4>
                <p className="text-gray-500">${product.price}</p>

                <button
                  onClick={() => router.push("/products")}
                  className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 💥 CTA */}
      <section className="bg-black text-white text-center py-16">
        <h3 className="text-3xl font-bold mb-4">
          Ready to upgrade your lifestyle?
        </h3>

        <button
          onClick={() => router.push("/products")}
          className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition"
        >
          Start Shopping
        </button>
      </section>

      {/* 🧾 FOOTER */}
      <footer className="text-center text-gray-500 py-6">
        © 2026 E-Shop. All rights reserved.
      </footer>
    </div>
  );
}
