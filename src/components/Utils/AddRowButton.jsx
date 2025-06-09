"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";

export default function AddRowButton({
  buttonLabel = "Add",
  title = "Add New",
  columns = [],
  initialValues = {},
  onSubmit,
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
      >
        {buttonLabel}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
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
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
