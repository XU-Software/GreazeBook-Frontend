"use client";

// components/InvoiceNumberModal.js
import React, { useState } from "react";
import { useApproveBookingMutation } from "@/state/api";
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

const InvoiceNumberModal = ({ bookingData, bookingId = "" }) => {
  const dispatch = useAppDispatch();

  // Toggle state of invoice number modal
  const [toggleInvoiceNumberModal, setToggleInvoiceNumberModal] =
    useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  const onClose = () => setToggleInvoiceNumberModal(false);

  const [approveBooking, { isLoading: isApprovingBooking }] =
    useApproveBookingMutation();

  const handleApproveBooking = async (e, bookingId, salesInvoiceNumber) => {
    e.preventDefault();
    try {
      if (!salesInvoiceNumber.trim())
        throw new Error("Invoice number required", 400);
      const res = await approveBooking({
        bookingId,
        salesInvoiceNumber,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Booking approved",
        })
      );
      setInvoiceNumber("");
      onClose();
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to approve booking",
        })
      );
    }
  };

  return (
    <>
      {bookingData.data.status === "Pending" && (
        <Button
          variant="outlined"
          color="primary"
          loading={isApprovingBooking}
          onClick={() => setToggleInvoiceNumberModal(true)}
        >
          Generate Invoice
        </Button>
      )}

      <Dialog open={toggleInvoiceNumberModal} onClose={onClose}>
        <DialogTitle>Enter Invoice Number</DialogTitle>
        <form
          onSubmit={(e) => handleApproveBooking(e, bookingId, invoiceNumber)}
        >
          <DialogContent>
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
            <Button
              onClick={onClose}
              variant="outlined"
              loading={isApprovingBooking}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isApprovingBooking}
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
