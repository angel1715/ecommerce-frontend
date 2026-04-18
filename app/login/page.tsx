"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);

      toast.success("Login successful");
      router.push("/products");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-green-500 text-white px-4 py-2">Login</button>
    </form>
  );
}
