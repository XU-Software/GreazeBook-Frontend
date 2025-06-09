"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Breadcrumbs, Link, Typography } from "@mui/material";

export default function DynamicBreadcrumbs() {
  const pathname = usePathname();

  // Split path and remove empty strings
  const pathnames = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ padding: 1 }}>
      {pathnames.map((segment, index) => {
        const fullPath = "/" + pathnames.slice(0, index + 1).join("/");

        const isFirst = index === 0;
        const isLast = index === pathnames.length - 1;

        // Format label
        const label = decodeURIComponent(segment.replace(/-/g, " ")).replace(
          /^\w/,
          (c) => c.toUpperCase()
        );

        return isFirst || isLast ? (
          <Typography
            color={isFirst ? "inherit" : "primary"}
            key={fullPath}
            sx={{ fontWeight: "bold" }}
          >
            {label}
          </Typography>
        ) : (
          <Link
            component={NextLink}
            href={fullPath}
            underline="hover"
            color="inherit"
            key={fullPath}
            sx={{ cursor: "pointer" }}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
