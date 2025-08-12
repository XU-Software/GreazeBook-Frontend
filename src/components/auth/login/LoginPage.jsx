"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/auth/signin", formData);

      const data = response.data;

      if (data.success) {
        setFormData({
          email: "",
          password: "",
        });
        router.push("/company/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = () =>
    (window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/google`);

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
        {/* Left illustration / accent panel */}
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
            Welcome Back!
          </Typography>
          <Typography>
            Sign in to manage your account, access your dashboard, and stay
            productive.
          </Typography>
          {/* Optional: add an SVG illustration or image here */}
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
        >
          <Typography variant="h5" fontWeight="600" textAlign="center">
            Sign In
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={1}
          >
            Please enter your details to continue
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

          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            autoFocus
          />

          <FormControl variant="outlined" size="small" fullWidth required>
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Box textAlign="right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mt: 1 }}
          >
            OR
          </Typography>

          <Button
            variant="outlined"
            onClick={handleGoogleSignin}
            startIcon={<GoogleIcon color="primary" />}
            sx={{
              textTransform: "none",
              py: 1.5,
              fontWeight: "bold",
              borderColor: "grey.400",
              color: "grey.700",
              "&:hover": {
                borderColor: "grey.600",
                backgroundColor: "grey.100",
              },
            }}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Don’t have an account? Receive an invitation from your company, or{" "}
            <Link
              href="/register-company"
              className="text-blue-600 hover:underline font-semibold"
            >
              Register your business
            </Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
