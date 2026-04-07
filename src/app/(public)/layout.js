import * as React from "react";
import "../globals.css";
import PublicNavbar from "@/components/layout/public/PublicNavbar";
import PublicFooter from "@/components/layout/public/PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <div>
      <header>
        <PublicNavbar />
      </header>
      <main> {children}</main>
      <footer>
        <PublicFooter />
      </footer>
    </div>
  );
}
