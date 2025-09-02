"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HomeButton from "@/components/Utils/HomeButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const RegisterCompanyPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [success, setSuccess] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState({
    email: "",
    name: "",
    companyName: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/company/register", formData);
      const data = response.data;

      if (data.success) {
        // router.push("/company/dashboard");
        setRegistrationDetails(data.data);
        setSuccess(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    // Success confirmation screen
    return (
      <div className="min-h-screen flex justify-center items-center px-2">
        <Box
          sx={{
            maxWidth: 600,
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 3,
            p: 6,
            textAlign: "center",
          }}
        >
          <CheckCircleOutlineIcon
            sx={{ fontSize: 80, mb: 2 }}
            color="primary"
          />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Registration Request Submitted
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Thank you <b>{registrationDetails.name || "<Name>"}</b> for
            registering your company{" "}
            <b>{registrationDetails.companyName || "<Company Name>"}</b>. Your
            request has been submitted and is pending approval. You will receive
            an email to <b>{registrationDetails.email || "<Email>"}</b> once
            your request has been reviewed.
          </Typography>
          <Button
            href="/login"
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
          >
            Go to Login
          </Button>
        </Box>
      </div>
    );
  }

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
            Register Your Company
          </Typography>
          <Typography mb={2}>
            Create your business account to manage your company and get started
            quickly.
          </Typography>
          <Typography>
            After the registration, you can onboard your members by sending an
            email invitation from our system and together you can manage your
            business
          </Typography>
          {/* Optional: add illustration here */}
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
            Sign Up Your Business
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={1}
          >
            Please enter your details to continue
          </Typography>
          <Typography>Company Detail</Typography>
          <TextField
            label="Company Name"
            variant="outlined"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            autoFocus
          />
          <Typography>Owner/Admin Details</Typography>
          <TextField
            label="Your Email"
            variant="outlined"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            size="small"
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

          <TextField
            label="Your Name"
            variant="outlined"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            size="small"
          />

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

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>

          <Typography variant="body2" textAlign="center" mt={2}>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign in here
            </a>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default RegisterCompanyPage;
