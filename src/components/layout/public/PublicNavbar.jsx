"use client";

import React, { useState, useEffect } from "react";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import OpacityIcon from "@mui/icons-material/Opacity";
import Link from "next/link";

const authLinks = [
  { title: "Login", href: "/login" },
  { title: "Register Company", href: "/register-company" },
];

export default function PublicNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    // Check immediately in case page loads already scrolled
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <>
      {/*
        All scroll-sensitive styles live in the <style> tag below as plain CSS.
        This means SSR renders the same static HTML every time (no Emotion hash
        mismatch), and the .scrolled class is toggled purely on the client after
        mount — React never has to reconcile dynamic sx props between server and
        client renders.
      */}
      <style>{`
        .gb-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          background-color: transparent;
          border-bottom: 1px solid transparent;
          box-shadow: none;
          transition:
            background-color 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            backdrop-filter 0.3s ease;
        }
        .gb-navbar.scrolled {
          background-color: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(21, 101, 192, 0.12);
          box-shadow: 0 1px 12px rgba(21, 101, 192, 0.08);
        }
        .gb-navbar-inner {
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
        }
        @media (max-width: 900px) {
          .gb-navbar-inner {
            padding: 0 24px;
          }
        }
        .gb-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .gb-logo-icon {
          width: 34px;
          height: 34px;
          background-color: #1976D2;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .gb-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: -0.4px;
          color: #0D47A1;
          line-height: 1;
          user-select: none;
        }
        .gb-nav-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 899px) {
          .gb-nav-buttons {
            display: none;
          }
        }
        .gb-hamburger {
          display: none !important;
        }
        @media (max-width: 899px) {
          .gb-hamburger {
            display: flex !important;
          }
        }
        .gb-spacer {
          height: 64px;
        }
      `}</style>

      <header className={`gb-navbar${scrolled ? " scrolled" : ""}`}>
        <div className="gb-navbar-inner">
          {/* Logo */}
          <Link href="/" className="gb-logo">
            <div className="gb-logo-icon">
              <OpacityIcon sx={{ color: "white", fontSize: 18 }} />
            </div>

            <span className="gb-logo-text">GreazeBook</span>
          </Link>

          {/* Desktop auth buttons */}
          <div className="gb-nav-buttons">
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              sx={{
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                borderColor: "#1976D2",
                color: "#1976D2",
                borderRadius: "8px",
                height: 38,
                px: 2.5,
                "&:hover": {
                  backgroundColor: "#E3F2FD",
                  borderColor: "#1976D2",
                },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              href="/register-company"
              variant="contained"
              disableElevation
              sx={{
                textTransform: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                backgroundColor: "#1976D2",
                borderRadius: "8px",
                height: 38,
                px: 2.5,
                "&:hover": {
                  backgroundColor: "#0D47A1",
                },
              }}
            >
              Register Company
            </Button>
          </div>

          {/* Hamburger — mobile only */}
          <IconButton
            edge="end"
            aria-label="open menu"
            onClick={toggleDrawer(true)}
            className="gb-hamburger"
            sx={{ color: "#1976D2" }}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </header>

      {/* Spacer so content isn't hidden under the fixed navbar */}
      <div className="gb-spacer" />

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 260, pt: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {authLinks.map(({ title, href }) => (
              <ListItem key={title} disablePadding>
                <ListItemButton component={Link} href={href}>
                  <ListItemText primary={title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
