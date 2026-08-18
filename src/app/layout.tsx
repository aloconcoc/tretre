import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { NotificationsProvider } from "@/context/notifications-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TRETRE - Nghệ Thuật Đan Lát Truyền Thống Việt Nam",
  description: "TRETRE - Sản phẩm thủ công từ chất liệu tự nhiên, kết hợp nghệ thuật đan lát truyền thống và thiết kế hiện đại.",
};

import ChatWidget from "@/components/ChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <ChatWidget />
              <Footer />
            </CartProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
