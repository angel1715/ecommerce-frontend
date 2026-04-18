"use client";

import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // 🔥 ocultar en login/register
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logout successsfully");
  };

  return (
    <div className="p-4 flex justify-between items-center bg-gray-900 text-white">
      <h1 className="font-bold text-lg">E-Commerce</h1>

      <div className="flex gap-4">
        <a href="/products" className="hover:text-gray-300">
          Products
        </a>
        <a href="/cart" className="hover:text-gray-300">
          Cart
        </a>
        <a href="/orders" className="hover:text-gray-300">
          Orders
        </a>
      </div>

      <button
        onClick={logout}
        className="text-red-400 hover:text-red-500 font-semibold"
      >
        Logout
      </button>
    </div>
  );
}
