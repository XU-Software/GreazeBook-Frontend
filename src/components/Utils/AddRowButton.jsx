"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";

export default function AddRowButton({
  buttonLabel = "Add",
  title = "Add New",
  description = "",
  descriptionColor = "default",
  columns = [],
  initialValues = {},
  onSubmit,
  isLoading = false,
  isDisabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialValues || {});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpen = () => {
    setForm(initialValues); // Reset form
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        startIcon={<Add />}
        loading={isLoading}
        disabled={isDisabled}
      >
        {buttonLabel}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {description && (
              <Typography gutterBottom color={descriptionColor}>
                {description}
              </Typography>
            )}
            {columns.map((col) => (
              <TextField
                key={col.field}
                label={col.headerName}
                fullWidth
                margin="dense"
                variant="outlined"
                value={form[col.field] || ""}
                onChange={(e) => handleChange(col.field, e.target.value)}
                type={col.type || "text"}
                required
                slotProps={
                  col.type === "date" ? { inputLabel: { shrink: true } } : {}
                }
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit" loading={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isLoading}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
