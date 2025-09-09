"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  useGetSingleInvoiceQuery,
  useCancelInvoiceMutation,
} from "@/state/services/invoicesApi";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Button,
  Chip,
} from "@mui/material";
import { EastOutlined } from "@mui/icons-material";
import { formatDateWithTime, formatDate } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import {
  calculateLessVat,
  calculateAmountNetOfVat,
} from "@/utils/vatCalculator";
import ConfirmationModal from "@/components/Utils/ConfirmationModal";

const InvoicePage = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { invoiceId } = params;

  const dispatch = useAppDispatch();

  // Get only the first two non-empty segments
  const baseSegments = pathname.split("/").filter(Boolean).slice(0, 2);

  // Join them back into a path
  const basePath = "/" + baseSegments.join("/");

  const userData = useAppSelector((state) => state.global.userData);
  const role = userData?.data?.role || "user";

  const [openCancelInvoiceModal, setOpenCancelInvoiceModal] = useState(false);

  const {
    data: invoiceData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleInvoiceQuery(invoiceId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [cancelInvoice, { isLoading: isCancelling }] =
    useCancelInvoiceMutation();

  const handleCancelInvoice = async (invoiceId) => {
    try {
      if (!invoiceId) {
        throw new Error("Invoice ID required", 400);
      }

      const res = await cancelInvoice(invoiceId).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Invoice cancelled successfully",
        })
      );
      setOpenCancelInvoiceModal(false);
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to cancel invoice",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !invoiceData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load invoice"
        }
        onRetry={refetch}
      />
    );
  }

  const {
    salesInvoiceNumber,
    createdAt,
    createdBy,
    booking,
    accountsReceivable,
    totalAmount,
    isCancelled,
  } = invoiceData.data;

  return (
    <>
      <DynamicBreadcrumbs />
      <Box sx={{ p: 2 }} className="container mx-auto">
        {/* Header */}
        <Paper sx={{ p: 2, pb: 10, mb: 3 }} elevation={3}>
          <Typography variant="h4" gutterBottom>
            Invoice Number: {salesInvoiceNumber}{" "}
            {isCancelled && <Chip label="Cancelled" color="error" />}
          </Typography>
          <Typography color="text.secondary">
            Invoice Date: {formatDateWithTime(createdAt)}
          </Typography>
          <Typography color="text.secondary">
            Invoiced By: {createdBy.name}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Booking Info */}

          <Typography variant="h6">Booking Details</Typography>
          <Grid container spacing={6} mt={1}>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Customer Name
              </Typography>
              <Typography>{booking.customerName}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Order Date
              </Typography>
              <Typography>{formatDate(booking.orderDate)}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Delivery Date
              </Typography>
              <Typography>{formatDate(booking.deliveryDate)}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Term
              </Typography>
              <Typography>{formatNumber(booking.term)}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Account Name
              </Typography>
              <Typography>{booking.account.accountName}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                DSP
              </Typography>
              <Typography>{booking.account.dsp}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
              <Typography>{booking.account.location}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Order Items */}

          <Typography variant="h6" gutterBottom>
            Orders
          </Typography>
          {booking.orders && booking.orders.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {booking.orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.product.productName}</TableCell>
                    <TableCell align="right">
                      {formatNumber(order.quantity)}
                    </TableCell>
                    <TableCell align="right">
                      {formatToLocalCurrency(order.price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatToLocalCurrency(order.quantity * order.price)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Fill with empty rows if less than 15 */}
                {booking.orders.length < 15 &&
                  Array.from({ length: 15 - booking.orders.length }).map(
                    (_, i) => (
                      <TableRow key={`empty-${i}`}>
                        <TableCell colSpan={4}>-</TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>

              {/* Invoice Total */}

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography fontWeight="bold">
                      Total Sales (VAT Inclusive)
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="primary">
                      {formatToLocalCurrency(totalAmount || 0)}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography fontWeight="bold">Less VAT</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="primary">
                      {formatToLocalCurrency(
                        calculateLessVat(totalAmount) || 0
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography fontWeight="bold">Amount Net of VAT</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="primary">
                      {formatToLocalCurrency(
                        calculateAmountNetOfVat(totalAmount) || 0
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography fontWeight="bold">Total Amount Due:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="primary">
                      {formatToLocalCurrency(totalAmount || 0)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          ) : (
            <Typography color="text.secondary">No orders found.</Typography>
          )}

          {/* <Grid container justifyContent="flex-end" marginTop={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1" fontWeight="bold">
                Total Amount:
              </Typography>
              <Typography variant="h6" color="primary">
                {formatToLocalCurrency(totalAmount || 0)}
              </Typography>
            </Grid>
          </Grid> */}
        </Paper>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}
        >
          {(role === "admin" || role === "superadmin") && (
            <>
              <Button
                variant="outlined"
                color="error"
                loading={isCancelling}
                disabled={isCancelled}
                onClick={() => setOpenCancelInvoiceModal(true)}
              >
                Cancel Invoice
              </Button>
              <ConfirmationModal
                open={openCancelInvoiceModal}
                onClose={() => setOpenCancelInvoiceModal(false)}
                onConfirm={() => handleCancelInvoice(invoiceId)}
                title={`Cancel Invoice: ${salesInvoiceNumber}`}
                message="Are you sure you want to cancel this invoice? Cancelling this invoice will cancel all of it's related sales and each will return corresponding product stocks."
                confirmText="Confirm"
                confirmButtonColor="primary"
                cancelText="Cancel"
                cancelButtonColor="error"
              />
            </>
          )}

          <Button
            variant="outlined"
            color="primary"
            endIcon={<EastOutlined />}
            onClick={() =>
              router.push(
                `/operations/accounts-receivables/${accountsReceivable.accountsReceivableId}`
              )
            }
          >
            {role === "admin" || role === "superadmin"
              ? "Manage Accounts Receivable"
              : "View Accounts Receivable"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default InvoicePage;
