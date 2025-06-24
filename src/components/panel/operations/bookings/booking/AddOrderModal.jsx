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
import { useGetProductsQuery, useAddPendingOrdersMutation } from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";

export default function AddOrderModal({
  open = false,
  onClose = () => {},
  bookingId = "",
}) {
  const dispatch = useAppDispatch();

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

  const [addPendingOrder, { isLoading: isAddingOrder }] =
    useAddPendingOrdersMutation();

  const handleSubmit = async (e, bookingId, newOrder) => {
    e.preventDefault();
    try {
      if (!newOrder.product || !newOrder.quantity || !newOrder.price) {
        throw new Error("All fields are required", 400);
      }
      const { product, ...rest } = newOrder;
      const order = { productId: product.productId, ...rest };
      const res = await addPendingOrder({ bookingId, order }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Order added",
        })
      );
      onClose();
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to add order",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Order Item</DialogTitle>
      <form onSubmit={(e) => handleSubmit(e, bookingId, form)}>
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
          <Button onClick={onClose} color="inherit" loading={isAddingOrder}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isAddingOrder}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
