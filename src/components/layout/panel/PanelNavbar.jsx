// components/Navbar.js
"use client";

import React, { useState } from "react";
import { api } from "@/state/api";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/state/services/authApi";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import { setIsSidebarCollapsed } from "@/state";
import {
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Switch,
  CircularProgress,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
// import { Menu, MenuOpen, Notifications, Settings } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function SettingsMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.replace("/login");
      setTimeout(() => {
        dispatch(api.util.resetApiState());
      }, 1000); // clear *everything* cached, invalidates all of the tags
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message: error.data?.message || error.message || "Failed to logout",
        })
      );
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <IconButton
        size="medium"
        aria-label="Settings menu"
        onClick={handleClick}
      >
        <SettingsIcon sx={{ fontSize: 26 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
          <ListItemIcon>
            {isLoggingOut ? (
              <CircularProgress size={20} />
            ) : (
              <LogoutIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>

        {/* <MenuItem>
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dark Mode" />
          <Switch checked={darkMode} onChange={onToggleDarkMode} />
        </MenuItem> */}
      </Menu>
    </>
  );
}

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const userData = useAppSelector((state) => state.global.userData); //Initial state is null, so safeguard every extraction from this data

  return (
    <header className="flex items-center justify-between px-6 py-2 shadow-sm bg-white z-40 fixed w-full h-18">
      <div className="flex items-center gap-8 truncate">
        <Tooltip title="Toggle sidebar">
          <IconButton
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            aria-label="Toggle sidebar"
            size="medium"
          >
            {isSidebarCollapsed ? (
              <MenuIcon sx={{ fontSize: 26 }} />
            ) : (
              <MenuOpenIcon sx={{ fontSize: 26 }} />
            )}
          </IconButton>
        </Tooltip>
        <h1 className="hidden md:block text-md md:text-2xl font-semibold text-blue-500">
          {userData?.data?.company?.name || "Company"}
        </h1>
      </div>
      <div className="flex items-center md:gap-2">
        <Tooltip title="Notifications" arrow>
          <IconButton size="medium" color="inherit">
            <NotificationsIcon sx={{ fontSize: 26 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile" arrow>
          <IconButton size="medium" color="inherit">
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={userData?.data?.profilePicture}
              alt={userData?.data?.name || "Profile Picture"}
            >
              {userData?.data?.email.charAt(0).toUpperCase() || "User Email"}
            </Avatar>
          </IconButton>
        </Tooltip>
        <span className="text-sm font-medium text-gray-500 hidden md:block truncate max-w-[120px]">
          {userData?.data?.name || "Username"}
        </span>
        <Tooltip title="Settings" arrow>
          {/* <IconButton size="medium" color="inherit">
            <SettingsIcon sx={{ fontSize: 26 }} />
          </IconButton> */}
          <SettingsMenu />
        </Tooltip>
      </div>
    </header>
  );
}
