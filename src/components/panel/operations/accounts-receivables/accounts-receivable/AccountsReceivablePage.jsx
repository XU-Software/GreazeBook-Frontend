"use client";

import React, { useState } from "react";
import {
  useGetSingleAccountsReceivableQuery,
  useAccountsReceivableVoidPaymentMutation,
} from "@/state/services/accountsReceivablesApi";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Tooltip,
  TableFooter,
} from "@mui/material";
import {
  CheckCircle,
  WarningAmber,
  Cancel,
  ChangeCircle,
  Check,
} from "@mui/icons-material";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import ColoredLink from "@/components/Utils/ColoredLink";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatDate, formatDateWithTime } from "@/utils/dateFormatter";
import PaymentModal from "./PaymentModal";
import ConfirmationModal from "@/components/Utils/ConfirmationModal";
import CancelSaleModal from "./CancelSaleModal";
import ChangeSaleModal from "./ChangeSaleModal";
import ProcessOverpaymentModal from "./ProcessPendingExcessModal";

// Helper chips
const getStatusChip = (status) => {
  switch (status) {
    case "Unpaid":
      return <Chip label="Unpaid" color="default" size="small" />;
    case "Partial":
      return <Chip label="Partial" color="warning" size="small" />;
    case "Paid":
      return <Chip label="Paid" color="success" size="small" />;
    case "Overdue":
      return <Chip label="Overdue" color="error" size="small" />;
    default:
      return <Chip label="Cancelled" color="error" size="small" />;
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

const getAgingChip = (dueDate) => {
  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const due = new Date(dueDate);
  const dueDateOnly = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  );

  const diffMs = todayDateOnly.getTime() - dueDateOnly.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return (
      <Chip
        label={`${diffDays} day${diffDays > 1 ? "s" : ""} overdue`}
        color="error"
        size="small"
      />
    );
  } else if (diffDays === 0) {
    return <Chip label="Due today" color="warning" size="small" />;
  } else {
    return (
      <Chip
        label={`Due in ${Math.abs(diffDays)} day${
          Math.abs(diffDays) > 1 ? "s" : ""
        }`}
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

  const dispatch = useAppDispatch();

  // Get only the first two non-empty segments
  const baseSegments = pathname.split("/").filter(Boolean).slice(0, 2);

  // Join them back into a path
  const basePath = "/" + baseSegments.join("/");

  // Toggling payment functionality modal
  const [togglePaymentModal, setTogglePaymentModal] = useState(false);

  // Toggling and data of voiding payment modal
  const [toggleVoidPaymentModal, setToggleVoidPaymentModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  // Toggling and data of cancelling sale modal
  const [toggleCancelSaleModal, setToggleCancelSaleModal] = useState(false);
  const [saleId, setSaleId] = useState("");

  // Toggling change order and data of order to be changed
  const [toggleChangeSaleModal, setToggleChangeSaleModal] = useState(false);
  const [saleToChange, setSaleToChange] = useState("");

  // Toggling process overpayment modal
  const [toggleProcessOverpaymentModal, setToggleProcessOverpaymentModal] =
    useState(false);
  const [pendingExcessId, setPendingExcessId] = useState("");

  const userData = useAppSelector((state) => state.global.userData);
  const role = userData?.data?.role || "user";

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

  const handleCloseVoidModal = () => {
    setPaymentId("");
    setToggleVoidPaymentModal(false);
  };

  const [accountsReceivableVoidPayment, { isLoading: isVoidingPayment }] =
    useAccountsReceivableVoidPaymentMutation();

  const handleVoidPayment = async (accountsReceivableId, paymentId) => {
    try {
      const res = await accountsReceivableVoidPayment({
        accountsReceivableId,
        paymentId,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Void payment successful",
        })
      );
      handleCloseVoidModal();
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to void payment",
        })
      );
    }
  };

  const handleCloseCancelSaleModal = () => {
    setSaleId("");
    setToggleCancelSaleModal(false);
  };

  const handleCloseChangeSaleModal = () => {
    setSaleToChange("");
    setToggleChangeSaleModal(false);
  };

  const handleCloseProcessOverpaymentModal = () => {
    setPendingExcessId("");
    setToggleProcessOverpaymentModal(false);
  };

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
    totalSalesAmount,
    totalVolume,
    totalPayments,
    activePendingExcess, //can be null
    refund, //can be null
    creditMemo, //can be null
    balance,
    status,
    type,
  } = arData.data;

  return (
    <>
      <DynamicBreadcrumbs />
      <Box sx={{ p: 2, mx: "auto" }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          Accounts Receivable:{" "}
          {invoice ? (
            <ColoredLink
              href={`/operations/invoices/${invoice.invoiceId}`}
              linkText={`#${invoice.salesInvoiceNumber}`}
            />
          ) : (
            "Opening A/R"
          )}
        </Typography>

        {/* Actions */}
        {role === "admin" && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
            {status === "Paid" ? (
              <Tooltip title="AR is already paid">
                <span>
                  <Button variant="contained" color="primary" disabled>
                    Record Payment
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Make a payment">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setTogglePaymentModal(true)}
                >
                  Record Payment
                </Button>
              </Tooltip>
            )}
            {activePendingExcess && (
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  setPendingExcessId(activePendingExcess?.pendingExcessId);
                  setToggleProcessOverpaymentModal(true);
                }}
              >
                Manage Overpayment
              </Button>
            )}
          </Stack>
        )}

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
                Balance
              </Typography>
              <Typography variant="h6">
                {formatToLocalCurrency(balance)}
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
            {activePendingExcess && (
              <Tooltip title="Please process the excess by either converting it into a credit memo or issuing a refund.">
                <Grid item xs={6} sm={2.4}>
                  <Typography variant="body2" color="text.secondary">
                    Unprocessed Overpayment
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <WarningAmber fontSize="small" color="warning" />
                    <Typography variant="h6" color="warning.main">
                      {formatToLocalCurrency(activePendingExcess?.amount)}
                    </Typography>
                  </Stack>
                </Grid>
              </Tooltip>
            )}
            {refund && (
              <Tooltip title="This amount has been processed to refund">
                <Grid item xs={6} sm={2.4}>
                  <Typography variant="body2" color="text.secondary">
                    Amount Refunded
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Check fontSize="small" color="success" />
                    <Typography variant="h6" color="success.main">
                      {formatToLocalCurrency(refund?.amount)}
                    </Typography>
                  </Stack>
                </Grid>
              </Tooltip>
            )}
            {creditMemo && (
              <Tooltip title="This amount has been processed to refund">
                <Grid item xs={6} sm={2.4}>
                  <Typography variant="body2" color="text.secondary">
                    Amount Transferred To Credit Memo
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Check fontSize="small" color="success" />
                    <Typography variant="h6" color="success.main">
                      {formatToLocalCurrency(creditMemo?.amount)}
                    </Typography>
                  </Stack>
                </Grid>
              </Tooltip>
            )}
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
                {invoice ? "Invoice Date" : "Created At"}
              </Typography>
              {invoice ? formatDate(invoice.createdAt) : formatDate(createdAt)}
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
              {status !== "Paid" && status !== "Cancelled"
                ? getAgingChip(dueDate)
                : "-"}
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
              <Typography>
                {invoice ? invoice.booking.customerName : "-"}
              </Typography>
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
                  <TableCell>UOM</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="center">Action Type</TableCell>
                  <TableCell>Changed To</TableCell>
                  <TableCell>Reason</TableCell>
                  {role === "admin" && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {type === "Opening" ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="textSecondary">
                        This is an Opening A/R and doesn't include system
                        generated sales
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((sale) => {
                    const changedTo = sales.find(
                      (s) => s.saleId === sale?.replacementSale?.saleId
                    );
                    return (
                      <TableRow key={sale.saleId}>
                        <TableCell>{sale.order.product.productName}</TableCell>
                        <TableCell>{sale.order.product.uom}</TableCell>
                        <TableCell align="right">
                          {sale.order.quantity}
                        </TableCell>
                        <TableCell align="right">
                          {formatToLocalCurrency(sale.order.price)}
                        </TableCell>
                        <TableCell align="right">
                          {formatToLocalCurrency(
                            sale.order.quantity * sale.order.price
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {sale.order.product.uom * sale.order.quantity}
                        </TableCell>
                        <TableCell align="center">
                          {getFulfillmentChip(sale.actionType)}
                        </TableCell>
                        <TableCell>
                          {changedTo ? (
                            <Chip
                              size="small"
                              label={changedTo.order.product.productName}
                              variant="outlined"
                              color="info"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {sale.cancellationReason
                            ? sale.cancellationReason
                            : sale.changeReason
                            ? sale.changeReason
                            : "-"}
                        </TableCell>
                        {role === "admin" && (
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                color="error"
                                disabled={sale.actionType !== "Fulfilled"}
                                onClick={() => {
                                  setSaleId(sale.saleId);
                                  setToggleCancelSaleModal(true);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                disabled={sale.actionType !== "Fulfilled"}
                                onClick={() => {
                                  setSaleToChange(sale);
                                  setToggleChangeSaleModal(true);
                                }}
                              >
                                Change
                              </Button>
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography fontWeight="bold">Total</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">
                      {formatToLocalCurrency(totalSalesAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">{totalVolume}</Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
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
                  <TableCell>Void Status</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Note</TableCell>
                  {role === "admin" && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
                      <TableCell>
                        {p.isVoid ? (
                          <Chip
                            icon={<Cancel />}
                            label="Voided"
                            color="error"
                            size="small"
                            variant="filled"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{p.reference}</TableCell>
                      <TableCell>{p.note}</TableCell>
                      {role === "admin" && (
                        <TableCell>
                          {!p.isVoid ? (
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => {
                                setPaymentId(p.paymentId);
                                setToggleVoidPaymentModal(true);
                              }}
                            >
                              Void
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
        <PaymentModal
          open={togglePaymentModal}
          onClose={() => setTogglePaymentModal(false)}
          accountsReceivableId={accountsReceivableId}
        />
        <ConfirmationModal
          open={toggleVoidPaymentModal}
          onClose={handleCloseVoidModal}
          onConfirm={() => handleVoidPayment(accountsReceivableId, paymentId)}
          title="Void Payment"
          message="Are you sure you want to void this payment? This action is irreversible and will permanently mark the payment as voided in the system."
          confirmText="Void"
          confirmButtonColor="error"
          cancelText="Cancel"
          cancelButtonColor="primary"
        />
        {type === "System" && (
          <>
            <CancelSaleModal
              open={toggleCancelSaleModal}
              onClose={handleCloseCancelSaleModal}
              accountsReceivableId={accountsReceivableId}
              saleId={saleId}
            />
            <ChangeSaleModal
              open={toggleChangeSaleModal}
              onClose={handleCloseChangeSaleModal}
              accountsReceivableId={accountsReceivableId}
              sale={saleToChange}
            />
          </>
        )}

        <ProcessOverpaymentModal
          open={toggleProcessOverpaymentModal}
          onClose={handleCloseProcessOverpaymentModal}
          accountsReceivableId={accountsReceivableId}
          pendingExcessId={pendingExcessId}
          accountName={account.accountName}
        />
      </Box>
    </>
  );
};

export default AccountsReceivablePage;
