import "../globals.css";
import * as React from "react";
import PanelLayout from "@/components/layout/panel/PanelLayout";

export const metadata = {
  title: "Panel",
  robots: "noindex, nofollow",
};

export default function AppLayout({ children }) {
  return (
    <div className="h-full">
      <PanelLayout>{children}</PanelLayout>
    </div>
  );
}
