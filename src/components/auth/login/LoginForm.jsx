"use client";

import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

const LoginForm = () => {
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
    <form
      className="w-full md:w-[50%] flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <h1 className="font-semibold text-3xl">Welcome back</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Please enter your details
      </p>
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        size="small"
      />
      <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          required
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          size="small"
        />
      </FormControl>
      <Link href="/auth/forgot-password">Forgot password?</Link>
      <Button variant="contained" type="submit">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <Button variant="contained" onClick={handleGoogleSignin}>
        Sign in with Google
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default LoginForm;
