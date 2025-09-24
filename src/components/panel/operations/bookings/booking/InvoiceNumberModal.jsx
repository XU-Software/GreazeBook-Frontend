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
  Typography,
  Button,
} from "@mui/material";
import ColoredLink from "@/components/Utils/ColoredLink";

const InvoiceNumberModal = ({
  bookingId = "",
  disabled,
  invoiceNumberSeriesData,
}) => {
  const dispatch = useAppDispatch();

  // Toggle state of invoice number modal
  const [toggleInvoiceNumberModal, setToggleInvoiceNumberModal] =
    useState(false);

  const onClose = () => setToggleInvoiceNumberModal(false);

  const [invoiceBooking, { isLoading: isInvoicing }] =
    useInvoiceBookingMutation();

  const handleInvoiceBooking = async (e, bookingId) => {
    e.preventDefault();
    try {
      const res = await invoiceBooking({
        bookingId,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Booking invoiced",
        })
      );
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
        {invoiceNumberSeriesData.success ? (
          <>
            <DialogTitle>Generate And Print Invoice</DialogTitle>
            <DialogContent dividers>
              <Typography sx={{ mb: 2 }} textAlign="center">
                Invoice Number will increment automatically by each invoice
                generation based on the invoice number entry point provided. You
                can also change the invoice number entry point in{" "}
                <ColoredLink
                  href={`/formats/invoice-calibration`}
                  linkText="Invoice Number Entry Point."
                />
              </Typography>
              <Typography sx={{ mb: 2 }} textAlign="center">
                Current Invoice Number to be used:{" "}
                <b>
                  {invoiceNumberSeriesData.data.prefix ?? ""}{" "}
                  {invoiceNumberSeriesData.data.currentNumber}
                </b>
              </Typography>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle>
              Please Set The Invoice Number Entry Point first
            </DialogTitle>
            <DialogContent dividers>
              <Typography sx={{ mb: 2 }} textAlign="center" color="warning">
                Cannot proceed invoice generation. Please set the invoice number
                entry point first before an invoice be generated. Setup here{" "}
                <ColoredLink
                  href={`/formats/invoice-calibration`}
                  linkText="Invoice Number Entry Point."
                />
              </Typography>
            </DialogContent>
          </>
        )}

        <DialogActions>
          <Button onClick={onClose} variant="outlined" loading={isInvoicing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleInvoiceBooking(e, bookingId)}
            loading={isInvoicing}
            disabled={!invoiceNumberSeriesData.success}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvoiceNumberModal;
