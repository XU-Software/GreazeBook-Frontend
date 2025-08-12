"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetRefundsQuery } from "@/state/services/refundsApi";
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
import { formatNumber } from "@/utils/quantityFormatter";
import { usePathname } from "next/navigation";
import ColoredLink from "@/components/Utils/ColoredLink";
import { Typography } from "@mui/material";

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

const RefundsPage = () => {
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
    data: refundsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRefundsQuery(queryArgs, {
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

    if (!refundsData) return { rows, exportData };

    refundsData?.data.forEach((refund) => {
      rows.push({
        id: refund.refundId,
        salesInvoiceNumber: refund.pendingExcess.accountsReceivable.invoice
          ? refund.pendingExcess.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        accountsReceivableId:
          refund.pendingExcess.accountsReceivable.accountsReceivableId,
        customerNumber: refund.account.customerNumber,
        accountName: refund.account.accountName,
        accountId: refund.account.accountId,
        amount: formatToLocalCurrency(refund.amount),
        method: refund.method,
        reason: refund.reason,
        reference: refund.reference,
        note: refund.note,
        createdAt: formatDateWithTime(refund.createdAt),
        createdBy: refund.createdBy.email,
      });

      exportData.push({
        "Invoice Number": refund.pendingExcess.accountsReceivable.invoice
          ? refund.pendingExcess.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        "Customer Number": refund.account.customerNumber,
        "Account Name": refund.account.accountName,
        Amount: formatToLocalCurrency(refund.amount),
        Method: refund.method,
        Reason: refund.reason,
        Reference: refund.reference,
        Note: refund.note,
        "Date Processed": formatDateWithTime(refund.createdAt),
        "Processed By": refund.createdBy.email,
      });
    });

    return { rows, exportData };
  }, [refundsData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !refundsData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load refunds"
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
            Number of Refunded: {formatNumber(refundsData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="refunds"
              sheetName="Refunds"
            />
          </div>
        </div>
      </div>
      <Table rows={rows} columns={columns} enableSelection={false} />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={refundsData?.page}
        limit={refundsData?.limit}
        total={refundsData?.total}
      />
    </div>
  );
};

export default RefundsPage;
