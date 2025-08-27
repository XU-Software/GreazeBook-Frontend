import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "GreazeBook",
    template: "%s - GreazeBook",
  },
  description:
    "A modern Accounting Software System to manage your business finances, records, and inventory efficiently and seamlessly.",
  icons: {
    icon: [
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  robots: "index, follow",
  siteName: "GreazeBook",
  type: "website",
  other: {
    "apple-mobile-web-app-title": "GreazeBook",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
