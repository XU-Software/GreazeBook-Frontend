import React from "react";
import Link from "next/link";

const PublicNavbar = () => {
  return (
    <div className="w-full flex flex-row justify-between p-5">
      <h1 className="text-4xl">GreazeBook</h1>
      <div className="flex items-center gap-5 text-xl">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/pricing">Pricing</Link>
      </div>
      <div className="flex items-center gap-5 text-xl">
        <Link href="/login">Login</Link>
        <Link href="/register-company">Register company</Link>
      </div>
    </div>
  );
};

export default PublicNavbar;
