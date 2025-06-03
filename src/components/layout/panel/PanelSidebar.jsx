// components/Sidebar.js
"use client";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/app/redux";
import { navigationPageList } from "@/data/navigationData";
import React from "react";

export default function Sidebar() {
  const pathname = usePathname();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <aside
      className={clsx(
        "shadow-sm h-full transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 overflow-hidden bg-white pt-18 z-30",
        isSidebarCollapsed ? "w-0 md:w-24" : "w-76"
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-auto overflow-x-hidden">
        {navigationPageList.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={index}>
              {item.kind === "header" ? (
                !isSidebarCollapsed && (
                  <h2 className="py-2 font-semibold whitespace-nowrap">
                    {item.title}
                  </h2>
                )
              ) : (
                <>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center px-4 py-2 rounded group",
                      isSidebarCollapsed
                        ? "flex-col justify-center gap-0"
                        : "flex-row transition-all duration-300 ease-in-out gap-5",
                      pathname === item.href
                        ? "bg-blue-100 text-blue-500 font-medium hover:bg-blue-200"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <Icon
                      className="shrink-0 transition-all duration-300"
                      sx={{ fontSize: 24 }}
                    />
                    <span
                      className={clsx(
                        "whitespace-nowrap",
                        pathname === item.href
                          ? "text-blue-900"
                          : "text-gray-900",
                        isSidebarCollapsed
                          ? "text-xs truncate max-w-20 mt-1"
                          : "text-lg"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                  {navigationPageList[index + 1]?.kind === "header" &&
                    !isSidebarCollapsed && (
                      <hr className="my-2 border-[1.5] border-gray-200" />
                    )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
