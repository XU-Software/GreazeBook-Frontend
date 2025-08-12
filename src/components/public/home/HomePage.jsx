"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import DashboardIcon from "@mui/icons-material/Dashboard";

const features = [
  {
    title: "Order Booking & Approval",
    description:
      "Distributors' sales personnel can book orders easily; Admin can approve and manage them efficiently.",
    icon: <LocalShippingIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: "Invoice & Accounts Receivable",
    description:
      "Generate invoices and track accounts receivable seamlessly to maintain smooth cash flow.",
    icon: <ReceiptLongIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: "Stock & Product Management",
    description:
      "Manage inventory with real-time stock updates and maintain detailed stock history records.",
    icon: <InventoryIcon color="primary" sx={{ fontSize: 40 }} />,
  },
  {
    title: "Sales & Transaction Tracking",
    description:
      "Monitor sales performance, transaction history, refunds, overpayments, and credit memos all in one place.",
    icon: <DashboardIcon color="primary" sx={{ fontSize: 40 }} />,
  },
];

const HomePage = () => {
  const theme = useTheme();

  return (
    <div>
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          py: { xs: 6, md: 10 },
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        <Container maxWidth="lg">
          {/* Hero/Banner */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: 4,
              mb: 8,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                GreazeBook
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 500 }}
              >
                Streamlined order booking and sales management tailored for oil
                & lubricant distributors.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Button
                  variant="contained"
                  href="/login"
                  size="large"
                  sx={{ minWidth: 140 }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  href="/register-company"
                  size="large"
                  sx={{ minWidth: 160 }}
                >
                  Register Company
                </Button>
              </Box>
            </Box>
            <Box
              component="img"
              src="/banner/GreazeBook-Banner-Svg.svg" // replace with your image or SVG
              alt="Oil and Lubricants Distribution"
              sx={{
                flex: 1,
                maxWidth: 450,
                width: "100%",
                userSelect: "none",
              }}
            />
          </Box>

          {/* Features Section */}
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 5, textAlign: "center" }}
          >
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {features.map(({ title, description, icon }, i) => (
              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: "100%",
                    minHeight: 250, // Ensure consistent height
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  {icon}
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, mb: 1, fontWeight: "600" }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ flexGrow: 1 }}
                  >
                    {description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default HomePage;
