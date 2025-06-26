"use client";

import React, { useState } from "react";
import { useGetSingleAccountsReceivableQuery } from "@/state/api";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  WarningAmber,
  Cancel,
  ChangeCircle,
  LocalShippingOutlined,
  AccessTime,
} from "@mui/icons-material";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import ColoredLink from "@/components/Utils/ColoredLink";
import PaymentModal from "./PaymentModal";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatDate, formatDateWithTime } from "@/utils/dateFormatter";

// Helper chips
const getStatusChip = (status) => {
  switch (status) {
    case "Unpaid":
      return <Chip label="Unpaid" color="default" size="small" />;
    case "Partial":
      return <Chip label="Partial" color="warning" size="small" />;
    case "Paid":
      return <Chip label="Paid" color="success" size="small" />;
    default:
      return <Chip label={status} size="small" />;
  }
};

const getFulfillmentChip = (actionType) => {
  switch (actionType) {
    case "Fulfilled":
      return (
        <Chip
          icon={<CheckCircle />}
          label="Fulfilled"
          color="success"
          size="small"
        />
      );
    case "Cancelled":
      return (
        <Chip icon={<Cancel />} label="Cancelled" color="error" size="small" />
      );
    case "ChangedProduct":
      return (
        <Chip
          icon={<ChangeCircle />}
          label="Changed Product"
          color="info"
          size="small"
        />
      );
    default:
      return <Chip label={actionType} size="small" />;
  }
};

const getDeliveryStatusChip = (status) => {
  switch (status) {
    case "Delivered":
      return (
        <Chip
          icon={<CheckCircle sx={{ fontSize: 18 }} />}
          label="Delivered"
          color="success"
          size="small"
        />
      );
    case "Undelivered":
      return (
        <Chip
          icon={<LocalShippingOutlined sx={{ fontSize: 18 }} />}
          label="Undelivered"
          color="default"
          size="small"
        />
      );
    default:
      return <Chip label={status} size="small" />;
  }
};

const getAgingChip = (dueDate) => {
  const today = new Date();
  const diffMs = today.getTime() - new Date(dueDate).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return (
      <Chip label={`${diffDays} days overdue`} color="error" size="small" />
    );
  } else {
    return (
      <Chip
        label={`Due in ${Math.abs(diffDays)} days`}
        color="info"
        size="small"
      />
    );
  }
};

const AccountsReceivablePage = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { accountsReceivableId } = params;

  // Get only the first two non-empty segments
  const baseSegments = pathname.split("/").filter(Boolean).slice(0, 2);

  // Join them back into a path
  const basePath = "/" + baseSegments.join("/");

  const [togglePaymentModal, setTogglePaymentModal] = useState(false);

  const {
    data: arData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleAccountsReceivableQuery(accountsReceivableId, {
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

  if (isError || !arData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load accounts receivable"
        }
        onRetry={refetch}
      />
    );
  }

  const {
    dueDate,
    createdAt,
    updatedAt,
    invoiceId,
    accountId,
    createdBy,
    account,
    invoice,
    sales,
    payments,
    pendingExcess,
    totalSalesAmount,
    totalPayments,
    balance,
    status,
  } = arData.data;

  return (
    <Box sx={{ p: 2, mx: "auto" }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Accounts Receivable:{" "}
        <ColoredLink
          href={`/operations/invoices/${invoice.invoiceId}`}
          linkText={`#${invoice.salesInvoiceNumber}`}
        />
      </Typography>

      {/* Actions */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setTogglePaymentModal(true)}
        >
          Record Payment
        </Button>
        {/* <Button variant="outlined" color="warning">
          Adjust Sale
        </Button>
        <Button variant="outlined" color="success">
          Issue Refund
        </Button> */}
      </Stack>

      {/* Summary */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6">Summary</Typography>
        <Grid container columnSpacing={4} rowSpacing={1} mt={1}>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="body2" color="text.secondary">
              Total Sales
            </Typography>
            <Typography variant="h6">
              {formatToLocalCurrency(totalSalesAmount)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="body2" color="text.secondary">
              Total Payments
            </Typography>
            <Typography variant="h6">
              {formatToLocalCurrency(totalPayments)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="body2" color="text.secondary">
              Balance
            </Typography>
            <Typography variant="h6">
              {formatToLocalCurrency(balance)}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            {getStatusChip(status)}
          </Grid>
          <Grid
            item
            xs={6}
            sm={2.4}
            sx={{ display: "flex", flexDirection: "column", gap: 0.7 }}
          >
            <Typography variant="body2" color="text.secondary">
              Invoice Date
            </Typography>
            {formatDate(invoice.createdAt)}
          </Grid>
          <Grid
            item
            xs={6}
            sm={2.4}
            sx={{ display: "flex", flexDirection: "column", gap: 0.7 }}
          >
            <Typography variant="body2" color="text.secondary">
              Due Date
            </Typography>
            <span>{formatDate(dueDate)}</span>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Typography variant="body2" color="text.secondary">
              Aging
            </Typography>
            {status !== "Paid" ? getAgingChip(dueDate) : "-"}
          </Grid>
        </Grid>
      </Paper>
      {/* Customer Details */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6">Customer Details</Typography>
        <Grid container columnSpacing={4} rowSpacing={1} mt={1}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Customer Number
            </Typography>
            <Typography>{account.customerNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Account Name
            </Typography>
            <Typography>
              <ColoredLink
                href={`/master-data/accounts/${account.accountId}`}
                linkText={account.accountName}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Customer Name
            </Typography>
            <Typography>{invoice.booking.customerName}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Trade Type
            </Typography>
            <Typography>{account.tradeType}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Location
            </Typography>
            <Typography>{account.location}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              DSP
            </Typography>
            <Typography>{account.dsp}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Sales */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6" gutterBottom>
          Sales
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell>Delivery Status</TableCell>
                <TableCell>Action Type</TableCell>
                <TableCell>Changed From</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => {
                const originalSale = sales.find(
                  (s) => s.saleId === sale.originalSaleId
                );
                return (
                  <TableRow key={sale.saleId}>
                    <TableCell>{sale.order.product.productName}</TableCell>
                    <TableCell align="right">{sale.order.quantity}</TableCell>
                    <TableCell align="right">
                      {formatToLocalCurrency(sale.order.price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatToLocalCurrency(
                        sale.order.quantity * sale.order.price
                      )}
                    </TableCell>
                    <TableCell>{getDeliveryStatusChip(sale.status)}</TableCell>
                    <TableCell>{getFulfillmentChip(sale.actionType)}</TableCell>
                    <TableCell>
                      {originalSale ? (
                        <Chip
                          size="small"
                          label={originalSale.order.product.productName}
                          variant="outlined"
                          color="info"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {sale.status === "Undelivered" ? (
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined" color="primary">
                            Cancel
                          </Button>
                          <Button variant="outlined" color="primary">
                            Change
                          </Button>
                        </Stack>
                      ) : sale.status === "Delivered" ? (
                        <Button size="small" color="error" variant="outlined">
                          Return
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      {/* Payments */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Typography variant="h6" gutterBottom>
          Payments
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No payments made yet. Click on the Record Payment button
                      to proceed payment.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.paymentId}>
                    <TableCell>{formatDateWithTime(p.createdAt)}</TableCell>
                    <TableCell>{formatToLocalCurrency(p.amount)}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell>{p.reference}</TableCell>
                    <TableCell>{p.note}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      {/* Pending Excess */}
      {/* {ar.pendingExcess.amount > 0 && (
        <Paper sx={{ p: 2 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Pending Excess
          </Typography>
          <Typography>
            Amount: <strong>{ar.pendingExcess.amount.toLocaleString()}</strong>
          </Typography>
          <Stack direction="row" spacing={2} mt={1}>
            <Button size="small" variant="outlined" color="primary">
              Convert to Credit Memo
            </Button>
            <Button size="small" variant="outlined" color="secondary">
              Issue Refund
            </Button>
          </Stack>
        </Paper>
      )} */}
      <PaymentModal
        open={togglePaymentModal}
        onClose={() => setTogglePaymentModal(false)}
        accountsReceivableId={accountsReceivableId}
      />
    </Box>
  );
};

export default AccountsReceivablePage;
