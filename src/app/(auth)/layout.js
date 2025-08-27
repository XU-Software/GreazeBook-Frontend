import * as React from "react";
import "../globals.css";

export const metadata = {
  title: "Authentication",
  robots: "noindex, nofollow",
};

export default function AuthLayout({ children }) {
  return <div>{children}</div>;
}
