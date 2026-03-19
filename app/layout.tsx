import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "רשימת קניות | Grocery List",
  description: "Shared smart grocery list",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-dvh font-sans bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
