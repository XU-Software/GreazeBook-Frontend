import * as React from "react";
import "../globals.css";
import PublicNavbar from "@/components/layout/public/PublicNavbar";

export default function PublicLayout({ children }) {
  return (
    <div>
      <header>
        <PublicNavbar />
      </header>
      <main> {children}</main>
    </div>
  );
}
