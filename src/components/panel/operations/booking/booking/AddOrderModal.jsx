"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import SearchableSelect from "@/components/Utils/SearchableSelect";
import { useGetProductsQuery } from "@/state/api";

export default function AddOrderModal({ open = false, onClose = () => {} }) {
  const [form, setForm] = useState({ product: null, quantity: "", price: "" });

  useEffect(() => {
    if (open) setForm({ product: null, quantity: "", price: "" }); // Reset form on open
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (product) => {
    setForm((prev) => ({ ...prev, product }));
  };

  const handleSubmit = () => {
    if (!form.product || !form.quantity || !form.price) return;
    // onSubmit(form);
    onClose();
  };

  console.log(form);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Order Item</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <SearchableSelect
            label="Choose Product"
            queryHook={useGetProductsQuery}
            getOptionKey={(option) => option?.productId || ""}
            getOptionLabel={(option) => option?.productName || ""}
            onSelect={(option) => handleProductSelect(option)}
            value={form.product}
            isOptionEqualToValue={(option, value) =>
              option?.productId === value?.productId
            }
          />

          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
