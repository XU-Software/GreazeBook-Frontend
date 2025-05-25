// components/Navbar.js
"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { IconButton } from "@mui/material";
import axios from "@/lib/axios";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function Navbar() {
  const [companyData, setCompanyData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComppanyData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/company/name");
      const data = response.data;

      setCompanyData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComppanyData();
  }, []);

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <header className="flex items-center justify-between px-6 py-2 shadow-sm bg-white z-40 fixed w-full h-18">
      <div className="flex items-center justify-center gap-8">
        <IconButton
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          aria-label="Toggle sidebar"
          size="medium"
        >
          {isSidebarCollapsed ? (
            <MenuIcon sx={{ fontSize: 24 }} />
          ) : (
            <MenuOpenIcon sx={{ fontSize: 24 }} />
          )}
        </IconButton>
        <h1 className="text-md md:text-2xl font-semibold text-blue-500">
          {loading
            ? "loading..."
            : error
            ? error
            : companyData?.company?.name || "Company"}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded">
          <NotificationsNoneOutlinedIcon size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <AccountCircleOutlinedIcon size={24} />
        </button>
      </div>
    </header>
  );
}
