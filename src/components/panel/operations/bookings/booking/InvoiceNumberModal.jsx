"use client";

// components/InvoiceNumberModal.js
import React, { useState } from "react";
import { useInvoiceBookingMutation } from "@/state/services/invoicesApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const InvoiceNumberModal = ({ bookingId = "", disabled }) => {
  const dispatch = useAppDispatch();

  // Toggle state of invoice number modal
  const [toggleInvoiceNumberModal, setToggleInvoiceNumberModal] =
    useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  const onClose = () => setToggleInvoiceNumberModal(false);

  const [invoiceBooking, { isLoading: isInvoicing }] =
    useInvoiceBookingMutation();

  const handleInvoiceBooking = async (e, bookingId, salesInvoiceNumber) => {
    e.preventDefault();
    try {
      if (!salesInvoiceNumber.trim())
        throw new Error("Invoice number required", 400);
      const res = await invoiceBooking({
        bookingId,
        salesInvoiceNumber,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Booking invoiced",
        })
      );
      setInvoiceNumber("");
      onClose();
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to invoice booking",
        })
      );
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        loading={isInvoicing}
        onClick={() => setToggleInvoiceNumberModal(true)}
        disabled={disabled}
      >
        Generate Invoice
      </Button>

      <Dialog open={toggleInvoiceNumberModal} onClose={onClose}>
        <DialogTitle>Enter Invoice Number</DialogTitle>
        <form
          onSubmit={(e) => handleInvoiceBooking(e, bookingId, invoiceNumber)}
        >
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Invoice Number"
              fullWidth
              variant="outlined"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="outlined" loading={isInvoicing}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isInvoicing}
              disabled={!invoiceNumber.trim()}
            >
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default InvoiceNumberModal;
