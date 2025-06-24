"use client";

import React from "react";
import Link from "next/link";

const ColoredLink = ({ href, linkText = "" }) => {
  return (
    <Link href={href} className="underline text-blue-600 hover:text-blue-800">
      {linkText}
    </Link>
  );
};

export default ColoredLink;
