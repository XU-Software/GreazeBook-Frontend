"use client";

import React, { useState } from "react";
import { useAccountsReceivableCancelSaleMutation } from "@/state/services/accountsReceivablesApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";

const cancellationReasons = [
  { value: "Customer changed mind", restock: true },
  { value: "Input error / Wrong entry", restock: true },
  { value: "Delivery issue / Failed delivery", restock: true },
  { value: "Duplicate entry", restock: true },
  { value: "Pricing error / Incorrect pricing", restock: true },
  { value: "Damaged product / Unsellable", restock: false },
  { value: "Product expired / Quality issue", restock: false },
  { value: "Inventory discrepancy / Stock count error", restock: false },
  { value: "Other", restock: false }, // Free text notes can clarify
];

const CancelSaleModal = ({
  open = false,
  onClose = () => {},
  accountsReceivableId = "",
  saleId = "",
}) => {
  const dispatch = useAppDispatch();

  const [cancellationDetails, setCancellationDetails] = useState({
    reason: "",
    note: "",
  });

  const handleChange = (e) => {
    setCancellationDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setCancellationDetails({
      reason: "",
      note: "",
    });
    onClose();
  };

  const [accountsReceivableCancelSale, { isLoading: isCancellingSale }] =
    useAccountsReceivableCancelSaleMutation();

  const handleCancelSale = async (
    accountsReceivableId,
    saleId,
    cancellationDetails
  ) => {
    try {
      if (!cancellationDetails.reason) {
        throw new Error("Reason for cancellation required", 400);
      }
      const res = await accountsReceivableCancelSale({
        accountsReceivableId,
        saleId,
        cancellationDetails,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Sale record cancellation successful",
        })
      );
      handleClose();
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to cancel sales record",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cancel Sale Confirmation</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom color="error">
          ⚠️ Please choose the cancellation reason carefully.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Your selection determines whether the product stocks will be
          replenished or not.
        </Typography>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Cancellation Reason</InputLabel>
          <Select
            value={cancellationDetails.reason}
            name="reason"
            onChange={handleChange}
            label="Cancellation Reason"
          >
            {cancellationReasons.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.value}{" "}
                {item.restock ? " (Will Restock)" : " (No Restock)"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {cancellationDetails.reason === "Other" && (
          <TextField
            label="Additional Notes (Optional)"
            value={cancellationDetails.note}
            name="note"
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={() =>
            handleCancelSale(accountsReceivableId, saleId, cancellationDetails)
          }
          variant="contained"
          color="error"
          disabled={!cancellationDetails.reason}
          loading={isCancellingSale}
        >
          Confirm Cancellation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelSaleModal;
