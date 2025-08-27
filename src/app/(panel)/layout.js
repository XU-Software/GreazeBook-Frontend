import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import * as React from "react";
import PanelLayout from "@/components/layout/panel/PanelLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Panel",
  robots: "noindex, nofollow",
};

export default async function AppLayout({ children }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PanelLayout>{children}</PanelLayout>
      </body>
    </html>
  );
}
