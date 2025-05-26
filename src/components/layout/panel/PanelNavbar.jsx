// components/Navbar.js
"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { IconButton, Tooltip, Avatar } from "@mui/material";
import axios from "@/lib/axios";
import { Menu, MenuOpen, Notifications, Settings } from "@mui/icons-material";

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
        <Tooltip title="Toggle sidebar">
          <IconButton
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            aria-label="Toggle sidebar"
            size="medium"
          >
            {isSidebarCollapsed ? (
              <Menu sx={{ fontSize: 26 }} />
            ) : (
              <MenuOpen sx={{ fontSize: 26 }} />
            )}
          </IconButton>
        </Tooltip>
        <h1 className="hidden md:block text-md md:text-2xl font-semibold text-blue-500">
          {loading
            ? "loading..."
            : error
            ? error
            : companyData?.company?.name || "Company"}
        </h1>
      </div>
      <div className="flex items-center md:gap-2">
        <Tooltip title="Notifications" arrow>
          <IconButton size="medium" color="inherit">
            <Notifications sx={{ fontSize: 26 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile" arrow>
          <IconButton size="medium" color="inherit">
            <Avatar sx={{ width: 32, height: 32 }} alt="Xyron Uy">
              JD
            </Avatar>
          </IconButton>
        </Tooltip>
        <span className="text-sm font-medium text-gray-500 hidden md:block truncate max-w-[120px]">
          Xyron Uy
        </span>
        <Tooltip title="Settings" arrow>
          <IconButton size="medium" color="inherit">
            <Settings sx={{ fontSize: 26 }} />
          </IconButton>
        </Tooltip>
      </div>
    </header>
  );
}
