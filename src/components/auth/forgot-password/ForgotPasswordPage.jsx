"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "@/lib/axios";
import HomeButton from "@/components/Utils/HomeButton";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await axios.post("/auth/forgot-password", { email });

      const data = response.data;

      if (data.success) {
        setSuccessMsg("Check your email for password reset instructions.");
      } else {
        setError(
          "Failed to send reset email. Please check the email you provided and try again."
        );
      }
    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-2">
      <Box
        sx={{
          maxWidth: 900,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
        }}
      >
        {/* Left accent panel */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            display: { xs: "none", md: "flex" },
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Forgot Your Password?
          </Typography>
          <Typography>
            Enter your email address and we’ll send you instructions to reset
            your password.
          </Typography>
          {/* Optional: add an illustration or icon here */}
        </Box>

        {/* Form area */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            p: { xs: 4, sm: 6 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
          noValidate
          autoComplete="off"
        >
          <HomeButton />
          <Typography variant="h5" fontWeight="600" textAlign="center">
            Reset Password
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={2}
          >
            Please enter your registered email below.
          </Typography>

          {error && (
            <Box
              sx={{
                bgcolor: "error.light",
                color: "error.contrastText",
                p: 1.5,
                borderRadius: 1,
                fontSize: 14,
                textAlign: "center",
              }}
              role="alert"
            >
              {error}
            </Box>
          )}

          {successMsg && (
            <Box
              sx={{
                bgcolor: "success.light",
                color: "success.contrastText",
                p: 1.5,
                borderRadius: 1,
                fontSize: 14,
                textAlign: "center",
              }}
              role="alert"
            >
              {successMsg}
            </Box>
          )}

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            autoFocus
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign In
            </a>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default ForgotPasswordPage;
