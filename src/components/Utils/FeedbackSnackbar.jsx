"use client";

import { Snackbar, Alert } from "@mui/material";

function FeedbackSnackbar({
  open = false,
  onClose = () => {},
  message = "",
  severity = "success",
}) {
  const lines = message.split("\n");

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </Alert>
    </Snackbar>
  );
}

export default FeedbackSnackbar;
