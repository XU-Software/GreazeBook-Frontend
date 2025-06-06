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

const DeleteSelectedButton = ({ selected = [], onDelete = () => {} }) => {
  const [open, setOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(selected);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        onClick={() => setOpen(true)}
        disabled={selected.length === 0}
      >
        Delete Selected ({selected.length})
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selected.length}</strong>{" "}
            {selected.length === 1 ? "item" : "items"}? This action cannot be
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
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteSelectedButton;
