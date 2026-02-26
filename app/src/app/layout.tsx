import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estate（仮称）- 賃貸管理SaaS",
  description: "賃貸管理会社向けSaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Sidebar />
        <main className="ml-[240px] min-h-screen p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
