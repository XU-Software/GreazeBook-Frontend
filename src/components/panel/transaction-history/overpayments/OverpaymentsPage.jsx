"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetPendingExcessesQuery } from "@/state/services/pendingExcessesApi";
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
import { usePathname } from "next/navigation";
import ColoredLink from "@/components/Utils/ColoredLink";
import { Chip, Typography } from "@mui/material";

const columns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Processed From",
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
    field: "reason",
    headerName: "Reason",
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    render: (value, row) => {
      if (value === "Pending") {
        return (
          <Chip
            // icon={<Cancel />}
            label={value}
            color="warning"
            size="small"
            variant="filled"
          />
        );
      } else if (value === "TransferredToRefund") {
        return (
          <Chip
            // icon={<Cancel />}
            label="Refunded"
            color="success"
            size="small"
            variant="filled"
          />
        );
      } else if (value === "TransferredToCreditMemo") {
        return (
          <Chip
            // icon={<Cancel />}
            label="Transferred To Credit Memo"
            color="info"
            size="small"
            variant="filled"
          />
        );
      } else {
        return (
          <Chip
            // icon={<Cancel />}
            label={value}
            color="default"
            size="small"
            variant="filled"
          />
        );
      }
    },
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Date Occurred",
    minWidth: 150,
  },
  {
    field: "createdBy",
    headerName: "From Payment Processed By",
    minWidth: 150,
  },
];

const OverpaymentsPage = () => {
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
    data: pendingExcessData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPendingExcessesQuery(queryArgs, {
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

    if (!pendingExcessData) return { rows, exportData };

    pendingExcessData?.data.forEach((pe) => {
      rows.push({
        id: pe.pendingExcessId,
        salesInvoiceNumber: pe.accountsReceivable.invoice
          ? pe.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        accountsReceivableId: pe.accountsReceivableId,
        customerNumber: pe.accountsReceivable.account.customerNumber,
        accountName: pe.accountsReceivable.account.accountName,
        accountId: pe.accountsReceivable.account.accountId,
        amount: formatToLocalCurrency(pe.amount),
        reason: pe.reason,
        status: pe.status,
        createdAt: formatDateWithTime(pe.createdAt),
        createdBy: pe.createdBy.email,
      });

      exportData.push({
        "Processed From": pe.accountsReceivable.invoice
          ? pe.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        "Customer Number": pe.accountsReceivable.account.customerNumber,
        "Account Name": pe.accountsReceivable.account.accountName,
        Amount: formatToLocalCurrency(pe.amount),
        Reason: pe.reason,
        Status: pe.status,
        "Date Occurred": formatDateWithTime(pe.createdAt),
        "From Payment Processed By": pe.createdBy.email,
      });
    });

    return { rows, exportData };
  }, [pendingExcessData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !pendingExcessData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load overpayments"
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
            Number of Overpayments: {pendingExcessData?.total}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="overpayments"
              sheetName="Overpayments"
            />
          </div>
        </div>
      </div>
      <Table rows={rows} columns={columns} enableSelection={false} />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={pendingExcessData?.page}
        limit={pendingExcessData?.limit}
        total={pendingExcessData?.total}
      />
    </div>
  );
};

export default OverpaymentsPage;
