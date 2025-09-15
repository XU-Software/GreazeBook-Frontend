"use client";

// components/InvoiceNumberModal.js
import React, { useState, useRef } from "react";
import { useApproveBookingMutation } from "@/state/services/bookingsApi";
import { useGetInvoiceTemplateQuery } from "@/state/services/invoicesApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import InvoicePrintCanvas from "./InvoicePrintCanvas";
import {
  mapTemplateFields,
  mapTableData,
} from "@/utils/invoiceTemplateHelpers";
import ColoredLink from "@/components/Utils/ColoredLink";

const GenerateAndPrintInvoiceModal = ({ bookingData, bookingId = "" }) => {
  const dispatch = useAppDispatch();
  const contentRef = useRef(null);

  const mmToPt = (mm) => (parseFloat(mm) || 0) * 2.83465; // for print for fontSizes for device independent fontSize using points: `${mmToPt(fontSizeInMm)}pt`
  const mmToPx = (mm) => (parseFloat(mm) || 0) * 3.78; // Initial dimensions and data and even inputs should be in mm then convert to px in canvas section for preview

  // Toggle state of invoice number modal
  const [toggleInvoiceAndPrintModal, setToggleInvoiceAndPrintModal] =
    useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [message, setMessage] = useState("");

  const {
    data: invoiceTemplateData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInvoiceTemplateQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const onClose = () => setToggleInvoiceAndPrintModal(false);

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `@page { size: ${invoiceTemplateData?.data?.pageWidthMM}mm ${invoiceTemplateData?.data?.pageHeightMM}mm; margin: 0; }
    body { margin: 0; }`,
  });

  const [approveBooking, { isLoading: isApprovingBooking }] =
    useApproveBookingMutation();

  const handleApproveAndPrint = async (e) => {
    e.preventDefault();

    if (!invoiceNumber.trim()) throw new Error("Invoice number required", 400);

    if (!invoiceTemplateData?.success || !invoiceTemplateData?.data) {
      setMessage(
        <>
          Your company does not have invoice printing format yet. Please go to{" "}
          <ColoredLink
            href={`/formats/invoice-calibration`}
            linkText="Invoice Print Format"
          />{" "}
          page to set it up.
        </>
      );
      return;
    }

    // Trigger print first
    handlePrint();

    // Wait a bit so the print dialog opens before confirmation appears
    setTimeout(() => {
      const confirmed = window.confirm(
        "Did the invoice print successfully? This will finalize the booking."
      );

      if (!confirmed) return;

      approveBooking({
        bookingId,
        salesInvoiceNumber: invoiceNumber,
      })
        .unwrap()
        .then((res) => {
          dispatch(
            setShowSnackbar({
              severity: "success",
              message: res.message || "Invoice generated and printed",
            })
          );

          setInvoiceNumber("");
          onClose();
        })
        .catch((error) => {
          dispatch(
            setShowSnackbar({
              severity: "error",
              message:
                error.data?.message ||
                error.message ||
                "Failed to generate and print invoice",
            })
          );
        });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !invoiceTemplateData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load invoice template"
        }
        onRetry={refetch}
      />
    );
  }

  let template;

  let mappedFields;
  let tableRows;

  // Invoice template backend response differ
  // Response with success true and data field if template exist
  // Response with success false and no data field if no template exist yet
  if (invoiceTemplateData?.success && invoiceTemplateData?.data) {
    template = invoiceTemplateData?.data;
    mappedFields = mapTemplateFields(template.fields, bookingData.data);
    tableRows = mapTableData(template.table, bookingData.data);
  }

  return (
    <>
      {bookingData.data.status === "Pending" && (
        <Button
          variant="contained"
          color="primary"
          loading={isApprovingBooking}
          onClick={() => setToggleInvoiceAndPrintModal(true)}
        >
          Generate And Print Invoice
        </Button>
      )}

      <Dialog open={toggleInvoiceAndPrintModal} onClose={onClose}>
        <DialogTitle>Enter Invoice Number</DialogTitle>
        <Divider />

        {message && (
          <Box
            sx={{
              bgcolor: "warning.light",
              color: "warning.contrastText",
              p: 1.5,
              borderRadius: 1,
              fontSize: 14,
              textAlign: "center",
            }}
            role="alert"
          >
            {message}
          </Box>
        )}

        <form onSubmit={handleApproveAndPrint}>
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
            <Button
              onClick={onClose}
              variant="outlined"
              loading={isApprovingBooking || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isApprovingBooking || isLoading}
              disabled={!invoiceNumber.trim()}
            >
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {invoiceTemplateData?.success && invoiceTemplateData?.data && (
        <div style={{ display: "none" }}>
          <InvoicePrintCanvas
            ref={contentRef}
            paperSize={{
              width: template.pageWidthMM,
              height: template.pageHeightMM,
            }}
            fields={mappedFields} // built in modal using your helpers
            table={{
              ...template.table,
              rows: tableRows, // built in modal using your helpers
            }}
            mmToPx={mmToPx}
            mmToPt={mmToPt}
          />
        </div>
      )}
    </>
  );
};

export default GenerateAndPrintInvoiceModal;
