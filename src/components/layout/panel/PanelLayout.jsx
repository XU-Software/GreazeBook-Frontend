"use client";

import React from "react";
import clsx from "clsx";
import StoreProvider from "@/app/redux";
import Navbar from "./PanelNavbar";
import Sidebar from "./PanelSidebar";
import { useAppSelector } from "@/app/redux";

const PageWrapper = ({ children }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  return (
    <div
      className={clsx(
        "h-full w-full pt-18 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "md:pl-24" : "md:pl-76"
      )}
    >
      <div className="h-full w-full p-4">{children}</div>
    </div>
  );
};

const PanelLayout = ({ children }) => {
  return (
    <StoreProvider>
      <Navbar />
      <Sidebar />
      <PageWrapper>{children}</PageWrapper>
    </StoreProvider>
  );
};

export default PanelLayout;
