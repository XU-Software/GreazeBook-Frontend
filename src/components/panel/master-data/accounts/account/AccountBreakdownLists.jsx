"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chip, Box, Tooltip, Stack, Typography } from "@mui/material";
import { useGetAccountBreakdownListsQuery } from "@/state/services/accountsApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import { formatDate, formatDateWithTime } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import AccountBreakdownSection from "./AccountBreakdownSection";
import ColoredLink from "@/components/Utils/ColoredLink";

//AR column fields
const accountsReceivablesColumns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    render: (value, row) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>{value}</Typography>
        {row.hasActivePendingExcess && (
          <Tooltip title="Please process overpayment in this A/R">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "orange",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(0.9)",
                    opacity: 0.7,
                  },
                  "50%": {
                    transform: "scale(1.3)",
                    opacity: 1,
                  },
                  "100%": {
                    transform: "scale(0.9)",
                    opacity: 0.7,
                  },
                },
              }}
            />
          </Tooltip>
        )}
      </Stack>
    ),
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Invoice Date",
    minWidth: 150,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    minWidth: 150,
  },
  {
    field: "totalSales",
    headerName: "Total Sales",
    minWidth: 150,
  },
  {
    field: "totalPayments",
    headerName: "Total Payments",
    minWidth: 150,
  },
  {
    field: "balance",
    headerName: "Balance",
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    render: (value) => {
      if (value === "Paid") {
        return (
          <Tooltip title="Fully paid">
            <Chip label={value} color="success" size="small" />
          </Tooltip>
        );
      }

      if (value === "Partial") {
        return (
          <Tooltip title="Partial payment received">
            <Chip label={value} color="warning" size="small" />
          </Tooltip>
        );
      }

      if (value === "Unpaid") {
        return (
          <Tooltip title="No payment received">
            <Chip
              label={value}
              color="default" // Grey, less aggressive
              size="small"
            />
          </Tooltip>
        );
      }

      if (value === "Overdue") {
        return (
          <Tooltip title="Payment overdue">
            <Chip label={value} color="error" size="small" />
          </Tooltip>
        );
      }

      return (
        <Tooltip title="A/R Cancelled">
          <Chip label={value} color="error" size="small" />
        </Tooltip>
      );
    },
    minWidth: 150,
  },
];

//Sales columns
const salesColumns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    render: (value, row) => {
      return (
        <ColoredLink
          href={`/operations/accounts-receivables/${row.accountsReceivableId}`}
          linkText={value}
        />
      );
    },
    minWidth: 150,
  },
  {
    field: "productName",
    headerName: "Product",
    minWidth: 150,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    minWidth: 150,
  },
  {
    field: "price",
    headerName: "Unit Price",
    minWidth: 150,
  },
  {
    field: "actionType",
    headerName: "Action Type",
    render: (value) => {
      if (value === "ChangedProduct") {
        return (
          <Tooltip title="Order Changed">
            <Chip label="Changed Product" color="info" size="small" />
          </Tooltip>
        );
      }

      if (value === "Cancelled") {
        return (
          <Tooltip title="Order Cancelled">
            <Chip label="Cancelled" color="error" size="small" />
          </Tooltip>
        );
      }

      return (
        <Tooltip title="Order Fulfilled">
          <Chip label="Fulfilled" color="success" size="small" />
        </Tooltip>
      );
    },
    minWidth: 150,
  },
];

//Payments columns
const paymentsColumns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    render: (value, row) => {
      return (
        <ColoredLink
          href={`/operations/accounts-receivables/${row.accountsReceivableId}`}
          linkText={value}
        />
      );
    },
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Date Processed",
    minWidth: 150,
  },
  {
    field: "createdBy",
    headerName: "Processed By",
    minWidth: 150,
  },
  {
    field: "amount",
    headerName: "Amount",
    minWidth: 150,
  },
  {
    field: "method",
    headerName: "Method",
    minWidth: 150,
  },
  {
    field: "reference",
    headerName: "Reference",
    minWidth: 150,
  },
  {
    field: "note",
    headerName: "Note",
    minWidth: 150,
  },
  {
    field: "isVoid",
    headerName: "Void Status",
    render: (isVoid) =>
      isVoid ? (
        <Chip
          // icon={<Cancel />}
          label="Voided"
          color="error"
          size="small"
          variant="filled"
        />
      ) : (
        "-"
      ),
    minWidth: 150,
  },
  {
    field: "voidBy",
    headerName: "Voided By",
    minWidth: 150,
  },
];

//CreditMemo columns
const creditMemoColumns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    render: (value, row) => {
      return (
        <ColoredLink
          href={`/operations/accounts-receivables/${row.accountsReceivableId}`}
          linkText={value}
        />
      );
    },
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Date Issued",
    minWidth: 150,
  },
  {
    field: "createdBy",
    headerName: "Issued By",
    minWidth: 150,
  },
  {
    field: "amount",
    headerName: "Amount Available",
    minWidth: 150,
  },
  {
    field: "usedAmount",
    headerName: "Amount Used",
    minWidth: 150,
  },
  {
    field: "isFullyUsed",
    headerName: "Status",
    render: (isFullyUsed) =>
      isFullyUsed ? (
        <Chip label="Consumed" color="default" size="small" variant="filled" />
      ) : (
        <Chip label="Available" color="success" size="small" variant="filled" />
      ),
    minWidth: 150,
  },
  {
    field: "reason",
    headerName: "Reason",
    minWidth: 150,
  },
  {
    field: "note",
    headerName: "Note",
    minWidth: 150,
  },

  {
    field: "updatedAt",
    headerName: "Date Last Used",
    minWidth: 150,
  },
];

//Refunds columns
const refundsColumns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    render: (value, row) => {
      return (
        <ColoredLink
          href={`/operations/accounts-receivables/${row.accountsReceivableId}`}
          linkText={value}
        />
      );
    },
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Date Issued",
    minWidth: 150,
  },
  {
    field: "createdBy",
    headerName: "Issued By",
    minWidth: 150,
  },
  {
    field: "amount",
    headerName: "Amount Refunded",
    minWidth: 150,
  },
  {
    field: "method",
    headerName: "Method",
    minWidth: 150,
  },
  {
    field: "reason",
    headerName: "Reason",
    minWidth: 150,
  },
  {
    field: "reference",
    headerName: "Reference",
    minWidth: 150,
  },
  {
    field: "note",
    headerName: "Note",
    minWidth: 150,
  },
];

const AccountBreakdownLists = ({
  arStatusCounts = {},
  accountId = "",
  startDate = "",
  endDate = "",
  page = "",
  setPage = () => {},
  pageSize = 20,
  search = "",
  setSearch = () => {},
  accumulatedData = {
    accountsReceivables: [],
    sales: [],
    payments: [],
    creditMemos: [],
    refunds: [],
  },
  setAccumulatedData = () => {},
}) => {
  const router = useRouter();

  const queryArgs = useMemo(
    () => ({
      accountId,
      startDate,
      endDate,
      page,
      pageSize,
      search,
    }),
    [accountId, startDate, endDate, page, pageSize, search]
  );

  const {
    data: accountDetailsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAccountBreakdownListsQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Reset accumulated data when accountId, startDate, endDate, or search changes
  useEffect(() => {
    setAccumulatedData({
      accountsReceivables: [],
      sales: [],
      payments: [],
      creditMemos: [],
      refunds: [],
    });
    setPage(1); // Reset pagination
  }, [accountId, startDate, endDate, search]);

  // Accumulate data for infinite scroll
  useEffect(() => {
    if (accountDetailsData) {
      setAccumulatedData((prev) => ({
        accountsReceivables: [
          ...prev.accountsReceivables,
          ...(accountDetailsData.accountsReceivables.map((ar) => ({
            id: ar.accountsReceivableId,
            salesInvoiceNumber: ar.salesInvoiceNumber
              ? ar.salesInvoiceNumber
              : "Opening A/R",
            createdAt: formatDate(ar.createdAt),
            dueDate: formatDate(ar.dueDate),
            totalSales: formatToLocalCurrency(ar.totalSales),
            totalPayments: formatToLocalCurrency(ar.totalPayments),
            balance: formatToLocalCurrency(ar.balance),
            status: ar.status,
            hasActivePendingExcess: ar.hasActivePendingExcess,
          })) || []),
        ],
        sales: [
          ...prev.sales,
          ...(accountDetailsData.sales.map((sale) => ({
            id: sale.saleId,
            salesInvoiceNumber: sale.salesInvoiceNumber,
            accountsReceivableId: sale.accountsReceivableId,
            productName: sale.order.product.productName,
            quantity: sale.order.quantity,
            price: formatToLocalCurrency(sale.order.price),
            actionType: sale.actionType,
          })) || []),
        ],
        payments: [
          ...prev.payments,
          ...(accountDetailsData.payments.map((p) => ({
            id: p.paymentId,
            salesInvoiceNumber: p.salesInvoiceNumber
              ? p.salesInvoiceNumber
              : "Opening A/R",
            accountsReceivableId: p.accountsReceivableId,
            createdAt: formatDateWithTime(p.createdAt),
            createdBy: p.createdBy.email,
            amount: formatToLocalCurrency(p.amount),
            method: p.method,
            reference: p.reference ? p.reference : "-",
            note: p.note ? p.note : "-",
            isVoid: p.isVoid,
            voidBy: p.voidBy ? p.voidBy.email : "-",
          })) || []),
        ],
        creditMemos: [
          ...prev.creditMemos,
          ...(accountDetailsData.creditMemos.map((cm) => ({
            id: cm.creditMemoId,
            salesInvoiceNumber: cm.salesInvoiceNumber
              ? cm.salesInvoiceNumber
              : "Opening A/R",
            accountsReceivableId: cm.accountsReceivableId,
            createdAt: formatDateWithTime(cm.createdAt),
            createdBy: cm.createdBy.email,
            amount: formatToLocalCurrency(cm.amount),
            usedAmount: formatToLocalCurrency(cm.usedAmount),
            isFullyUsed: cm.isFullyUsed,
            reason: cm.reason,
            note: cm.note ? cm.note : "-",
            updatedAt: formatDateWithTime(cm.updatedAt),
          })) || []),
        ],
        refunds: [
          ...prev.refunds,
          ...(accountDetailsData.refunds.map((refund) => ({
            id: refund.refundId,
            salesInvoiceNumber: refund.salesInvoiceNumber
              ? refund.salesInvoiceNumber
              : "Opening A/R",
            accountsReceivableId: refund.accountsReceivableId,
            createdAt: formatDateWithTime(refund.createdAt),
            createdBy: refund.createdBy.email,
            amount: formatToLocalCurrency(refund.amount),
            method: refund.method,
            reason: refund.reason,
            reference: refund.reference ? refund.reference : "-",
            note: refund.note ? refund.note : "-",
          })) || []),
        ],
      }));
    }
  }, [accountDetailsData]);

  const handleFetchNext = () => {
    if (
      accountDetailsData &&
      page < accountDetailsData.totalPages &&
      !isFetching
    ) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if ((isError && page === 1) || !accountDetailsData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load account breakdown lists"
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <Box>
      <AccountBreakdownSection
        title="Accounts Receivables"
        subtitleChips={[
          { label: "Unpaid", count: arStatusCounts.unpaid, color: "default" },
          { label: "Partial", count: arStatusCounts.partial, color: "warning" },
          { label: "Paid", count: arStatusCounts.paid, color: "success" },
          { label: "Overdue", count: arStatusCounts.overdue, color: "error" },
          {
            label: "Cancelled A/R",
            count: arStatusCounts.cancelled,
            color: "error",
          },
        ]}
        rows={accumulatedData.accountsReceivables}
        columns={accountsReceivablesColumns}
        enableSearch={true}
        setSearch={setSearch}
        setPage={setPage}
        handleFetchNext={handleFetchNext}
        hasMore={page < accountDetailsData.totalPages}
        onRowClick={(arId) =>
          router.push(`/operations/accounts-receivables/${arId}`)
        }
      />

      <AccountBreakdownSection
        title="Sales Orders"
        rows={accumulatedData.sales}
        columns={salesColumns}
        handleFetchNext={handleFetchNext}
      />

      <AccountBreakdownSection
        title="Payments History"
        rows={accumulatedData.payments}
        columns={paymentsColumns}
        handleFetchNext={handleFetchNext}
      />

      <AccountBreakdownSection
        title="Credit Memos"
        rows={accumulatedData.creditMemos}
        columns={creditMemoColumns}
        handleFetchNext={handleFetchNext}
      />

      <AccountBreakdownSection
        title="Refunds History"
        rows={accumulatedData.refunds}
        columns={refundsColumns}
        handleFetchNext={handleFetchNext}
      />
    </Box>
  );
};

export default AccountBreakdownLists;
