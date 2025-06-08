"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

const DeleteSelectedButton = ({
  selected = new Set(),
  setSelected = () => {},
  handleDeleteSelected = () => {},
  isDeleting = false,
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirmDelete = () => {
    const selectedArray = Array.from(selected);
    handleDeleteSelected(selectedArray);
    setSelected(new Set());
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        onClick={() => setOpen(true)}
        disabled={selected.size === 0}
        loading={isDeleting}
      >
        Delete Selected ({selected.size})
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selected.size}</strong>{" "}
            {selected.size === 1 ? "item" : "items"}? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            loading={isDeleting}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteSelectedButton;
