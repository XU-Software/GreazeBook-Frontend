"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, CircularProgress, Paper } from "@mui/material";

export default function GoogleSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/company/dashboard");
    }, 1500); // increased delay for better UX

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex justify-center items-center px-2">
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          Success!
        </Typography>
        <Typography variant="body1" mb={3}>
          You have successfully signed in with Google.
        </Typography>
        <CircularProgress color="primary" />
        <Typography variant="body2" mt={2} color="text.secondary">
          Redirecting to your dashboard...
        </Typography>
      </Paper>
    </div>
  );
}
