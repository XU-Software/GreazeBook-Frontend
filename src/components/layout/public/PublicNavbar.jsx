"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Resources", href: "/resources" },
  { title: "Pricing", href: "/pricing" },
];

const authLinks = [
  { title: "Login", href: "/login" },
  { title: "Register Company", href: "/register-company" },
];

export default function PublicNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navLinks.map(({ title, href }) => (
          // <ListItem button key={title} component={Link} href={href}>
          //   <ListItemText primary={title} />
          // </ListItem>

          <ListItem key={title} disablePadding>
            <ListItemButton component={Link} href={href}>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        {authLinks.map(({ title, href }) => (
          // <ListItem button key={title} component={Link} href={href}>
          //   <ListItemText primary={title} />
          // </ListItem>

          <ListItem key={title} disablePadding>
            <ListItemButton component={Link} href={href}>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            GreazeBook
          </Typography>

          {/* Desktop nav links - hidden on xs */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {navLinks.map(({ title, href }) => (
              <Button
                key={title}
                component={Link}
                href={href}
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                {title}
              </Button>
            ))}
          </Box>

          {/* Desktop auth links - hidden on xs */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {authLinks.map(({ title, href }) => (
              <Button
                key={title}
                component={Link}
                href={href}
                variant="outlined"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                {title}
              </Button>
            ))}
          </Box>

          {/* Hamburger icon - only show on xs */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </div>
  );
}
