"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import HomeButton from "@/components/Utils/HomeButton";

const InvitePage = ({ token = "" }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMsg("");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.name) {
      setError("Name field required");
      return;
    }

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await axios.post("/company/onboard-user", {
        token,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const data = response.data;

      if (data.success) {
        setSuccessMsg("Success! Redirecting to signin page...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError("Failed to accept invitation. Please try again.");
      }
    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  console.log(token);

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
            Onboarding Invitation
          </Typography>
          <Typography>
            Please enter your details to accept the onboarding invitation and to
            create your account on GreazeBook
          </Typography>
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
            Enter Details
          </Typography>

          <Typography textAlign="center">
            Please enter required fields
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
            label="Name"
            variant="outlined"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            autoFocus
          />

          <FormControl variant="outlined" size="small" fullWidth required>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
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
              autoFocus
            />
          </FormControl>

          <FormControl variant="outlined" size="small" fullWidth required>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Accept and Create"
            )}
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Already have an account?{" "}
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

export default InvitePage;
