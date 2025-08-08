"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetCreditMemosQuery } from "@/state/services/creditMemosApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import ExportExcel from "@/components/Utils/ExportExcel";
import PaginationControls from "@/components/Utils/TablePagination";
import { formatDateWithTime } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatToThousands } from "@/utils/quantityFormatter";
import { usePathname } from "next/navigation";
import ColoredLink from "@/components/Utils/ColoredLink";
import { Chip, Typography } from "@mui/material";

const columns = [
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
    field: "customerNumber",
    headerName: "Customer Number",
    minWidth: 150,
  },
  {
    field: "accountName",
    headerName: "Account Name",
    render: (value, row) => {
      return (
        <ColoredLink
          href={`/master-data/accounts/${row.accountId}`}
          linkText={value}
        />
      );
    },
    minWidth: 150,
  },
  {
    field: "amount",
    headerName: "Amount",
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

const CreditMemosPage = () => {
  const pathName = usePathname();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      sortOrder,
      search,
    }),
    [page, limit, sortOrder, search]
  );

  const {
    data: creditMemosData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCreditMemosQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Handler for only page change
  const handlePageChange = async (event, newPage) => {
    setPage(newPage + 1);
  };

  // Handler for only limit change
  const handleLimitChange = async (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setPage(1);
    setLimit(newLimit);
  };

  const { rows, exportData } = useMemo(() => {
    const rows = [];
    const exportData = [];

    if (!creditMemosData) return { rows, exportData };

    creditMemosData?.data.forEach((cm) => {
      rows.push({
        id: cm.creditMemoId,
        salesInvoiceNumber: cm.pendingExcess.accountsReceivable.invoice
          ? cm.pendingExcess.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        accountsReceivableId:
          cm.pendingExcess.accountsReceivable.accountsReceivableId,
        customerNumber: cm.account.customerNumber,
        accountName: cm.account.accountName,
        accountId: cm.account.accountId,
        amount: formatToLocalCurrency(cm.amount),
        usedAmount: formatToLocalCurrency(cm.usedAmount),
        isFullyUsed: cm.isFullyUsed,
        reason: cm.reason,
        note: cm.note,
        createdAt: formatDateWithTime(cm.createdAt),
        createdBy: cm.createdBy.email,
      });

      exportData.push({
        "Invoice Number": cm.pendingExcess.accountsReceivable.invoice
          ? cm.pendingExcess.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        "Customer Number": cm.account.customerNumber,
        "Account Name": cm.account.accountName,
        Amount: formatToLocalCurrency(cm.amount),
        "Amount Used": formatToLocalCurrency(cm.usedAmount),
        Status: cm.isFullyUsed ? "Consumed" : "Available",
        Reason: cm.reason,
        Note: cm.note,
        "Date Processed": formatDateWithTime(cm.createdAt),
        "Processed By": cm.createdBy.email,
      });
    });

    return { rows, exportData };
  }, [creditMemosData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !creditMemosData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load credit memos"
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="min-h-full">
      <DynamicBreadcrumbs />
      <div className="sticky top-18 z-10 bg-white py-2 px-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 ">
          <div className="w-full lg:w-auto flex justify-between items-center gap-4">
            <SearchBar setSearch={setSearch} setPage={setPage} />
            <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
          <Typography>
            Number of Credit Memos: {formatToThousands(creditMemosData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="credit-memos"
              sheetName="Credit-Memos"
            />
          </div>
        </div>
      </div>
      <Table rows={rows} columns={columns} enableSelection={false} />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={creditMemosData?.page}
        limit={creditMemosData?.limit}
        total={creditMemosData?.total}
      />
    </div>
  );
};

export default CreditMemosPage;
