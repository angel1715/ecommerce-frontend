import Navbar from "@/components/Navbar";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
