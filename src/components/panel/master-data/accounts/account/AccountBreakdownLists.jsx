"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chip, Box, Tooltip } from "@mui/material";
import { useGetAccountBreakdownListsQuery } from "@/state/services/accountsApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import AccountBreakdownSection from "./AccountBreakdownSection";

//AR column fields
const accountsReceivablesColumns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
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

      return (
        <Tooltip title="Payment overdue">
          <Chip
            label={value}
            color="error" // Grey, less aggressive
            size="small"
          />
        </Tooltip>
      );
    },
    minWidth: 150,
  },
];

//Sales columns
const salesColumns = [
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
    minWidth: 150,
  },
  {
    field: "voidBy",
    headerName: "Voided By",
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
];

//CreditMemo columns
const creditMemoColumns = [
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
    headerName: "Fully Consumed",
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
    field: "updatedAt",
    headerName: "Date Last Used",
    minWidth: 150,
  },
];

//Refunds columns
const refundsColumns = [
  {
    field: "amount",
    headerName: "Amount Refunded",
    minWidth: 150,
  },
  {
    field: "reason",
    headerName: "Reason",
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
];

const AccountBreakdownLists = ({
  arStatusCounts = {},
  accountId = "",
  startDate = "",
  endDate = "",
}) => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [search, setSearch] = useState("");

  const [accumulatedData, setAccumulatedData] = useState({
    accountsReceivables: [],
    sales: [],
    payments: [],
    creditMemos: [],
    refunds: [],
  });

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
            salesInvoiceNumber: ar.salesInvoiceNumber,
            createdAt: formatDate(ar.createdAt),
            dueDate: formatDate(ar.dueDate),
            totalSales: formatToLocalCurrency(ar.totalSales),
            balance: formatToLocalCurrency(ar.balance),
            status: ar.status,
          })) || []),
        ],
        sales: [
          ...prev.sales,
          ...(accountDetailsData.sales.map((sale) => ({
            id: sale.saleId,
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
            amount: formatToLocalCurrency(p.amount),
            method: p.method,
            reference: p.reference ? p.reference : "-",
            note: p.note ? p.note : "-",
            isVoid: p.isVoid,
            voidBy: p.voidBy ? p.voidBy.email : "-",
            createdAt: formatDate(p.createdAt),
            createdBy: p.createdBy.email,
          })) || []),
        ],
        creditMemos: [
          ...prev.creditMemos,
          ...(accountDetailsData.creditMemos.map((cm) => ({
            id: cm.creditMemoId,
            amount: formatToLocalCurrency(cm.amount),
            usedAmount: formatToLocalCurrency(cm.usedAmount),
            isFullyUsed: cm.isFullyUsed,
            reason: cm.reason,
            note: cm.note ? cm.note : "-",
            createdAt: formatDate(cm.createdAt),
            createdBy: cm.createdBy.email,
            updatedAt: cm.updatedAt,
          })) || []),
        ],
        refunds: [
          ...prev.refunds,
          ...(accountDetailsData.refunds.map((refund) => ({
            id: refund.refundId,
            amount: formatToLocalCurrency(refund.amount),
            reason: refund.reason,
            createdAt: formatDate(refund.createdAt),
            createdBy: refund.createdBy.email,
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
        ]}
        rows={accumulatedData.accountsReceivables}
        columns={accountsReceivablesColumns}
        enableSearch={true}
        setSearch={setSearch}
        setPage={setPage}
        handleFetchNext={handleFetchNext}
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
