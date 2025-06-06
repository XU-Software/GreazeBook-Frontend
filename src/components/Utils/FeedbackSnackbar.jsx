"use client";

import { Snackbar, Alert } from "@mui/material";

function FeedbackSnackbar({
  open = false,
  onClose = () => {},
  message = "",
  severity = "success",
}) {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default FeedbackSnackbar;
