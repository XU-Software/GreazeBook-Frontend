"use client";

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

const RegisterCompanyForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        router.push("/company/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TextField
        id="outlined-basic"
        label="Company Name"
        variant="outlined"
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        required
      />
      <TextField
        id="outlined-basic"
        label="Your Email"
        variant="outlined"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        id="outlined-basic"
        label="Your Password"
        variant="outlined"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <TextField
        id="outlined-basic"
        label="Your Name"
        variant="outlined"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Button variant="contained" type="submit">
        {loading ? "Submitting..." : "Register"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default RegisterCompanyForm;
