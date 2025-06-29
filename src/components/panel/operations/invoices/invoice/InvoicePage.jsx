"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useGetSingleInvoiceQuery } from "@/state/services/invoicesApi";
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
  Button,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { formatDateWithTime, formatDate } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";

const InvoicePage = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { invoiceId } = params;

  // Get only the first two non-empty segments
  const baseSegments = pathname.split("/").filter(Boolean).slice(0, 2);

  // Join them back into a path
  const basePath = "/" + baseSegments.join("/");

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
  } = invoiceData.data;

  return (
    <>
      <DynamicBreadcrumbs />
      <Box sx={{ p: 2 }} className="container mx-auto">
        {/* Header */}
        <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
          <Typography variant="h4" gutterBottom>
            Invoice #{salesInvoiceNumber}
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
              <Typography>{booking.customerName || "-"}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Order Date
              </Typography>
              <Typography>
                {booking.orderDate ? formatDate(booking.orderDate) : "-"}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Delivery Date
              </Typography>
              <Typography>
                {booking.deliveryDate ? formatDate(booking.deliveryDate) : "-"}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Term
              </Typography>
              <Typography>{booking.term ? booking.term : "-"}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Account Name
              </Typography>
              <Typography>{booking.account.accountName || "-"}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                DSP
              </Typography>
              <Typography>{booking.account.dsp || "-"}</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
              <Typography>{booking.account.location || "-"}</Typography>
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
                    <TableCell align="right">{order.quantity}</TableCell>
                    <TableCell align="right">
                      {formatToLocalCurrency(order.price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatToLocalCurrency(order.quantity * order.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary">No orders found.</Typography>
          )}

          {/* Invoice Total */}

          <Grid container justifyContent="flex-end" marginTop={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1" fontWeight="bold">
                Total Amount:
              </Typography>
              <Typography variant="h6" color="primary">
                {formatToLocalCurrency(totalAmount || 0)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AccountBalanceIcon />}
            onClick={() =>
              router.push(
                `/operations/accounts-receivables/${accountsReceivable.accountsReceivableId}`
              )
            }
          >
            Manage Accounts Receivable
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default InvoicePage;
