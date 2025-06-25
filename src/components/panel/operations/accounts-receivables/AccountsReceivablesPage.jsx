"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAccountsReceivablesQuery } from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import ExportExcel from "@/components/Utils/ExportExcel";
import PaginationControls from "@/components/Utils/TablePagination";
import { formatDate } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { usePathname } from "next/navigation";

const columns = [
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
    field: "term",
    headerName: "Term",
    minWidth: 150,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    minWidth: 150,
  },

  {
    field: "totalSalesAmount",
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
    minWidth: 150,
  },

  {
    field: "customerName",
    headerName: "Customer Name",
    minWidth: 150,
  },
  {
    field: "tradeType",
    headerName: "Trade Type",
    minWidth: 150,
  },

  {
    field: "location",
    headerName: "Location",
    minWidth: 150,
  },
  {
    field: "dsp",
    headerName: "DSP",
    minWidth: 150,
  },
];

const AccountsReceivablesPage = () => {
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
    data: accountsReceivablesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccountsReceivablesQuery(queryArgs, {
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

    if (!accountsReceivablesData) return { rows, exportData };

    accountsReceivablesData?.data.forEach((ar) => {
      rows.push({
        id: ar.accountsReceivableId,
        salesInvoiceNumber: ar.invoice.salesInvoiceNumber,
        createdAt: formatDate(ar.createdAt),
        term: ar.invoice.booking.term,
        dueDate: formatDate(ar.dueDate),
        totalSalesAmount: formatToLocalCurrency(ar.totalSalesAmount),
        balance: formatToLocalCurrency(ar.balance),
        status: ar.status,
        customerNumber: ar.account.customerNumber,
        accountName: ar.account.accountName,
        customerName: ar.invoice.booking.customerName,
        tradeType: ar.account.tradeType,
        location: ar.account.location,
        dsp: ar.account.dsp,
      });

      exportData.push({
        "Invoice Number": ar.invoice.salesInvoiceNumber,
        "Invoice Date": formatDate(ar.createdAt),
        Term: ar.invoice.booking.term,
        "Due Date": formatDate(ar.dueDate),
        "Total Sales": formatToLocalCurrency(ar.totalSalesAmount),
        Balance: formatToLocalCurrency(ar.balance),
        Status: ar.status,
        "Customer Number": ar.account.customerNumber,
        "Account Name": ar.account.accountName,
        "Customer Name": ar.invoice.booking.customerName,
        "Trade Type": ar.account.tradeType,
        Location: ar.account.location,
        DSP: ar.account.dsp,
      });
    });

    return { rows, exportData };
  }, [accountsReceivablesData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !accountsReceivablesData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load accounts receivables"
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
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="accounts-receivables"
              sheetName="Accounts-receivables"
            />
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={(accountsReceivableId) =>
          router.push(`${pathName}/${accountsReceivableId}`)
        }
        enableSelection={false}
      />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={accountsReceivablesData?.page}
        limit={accountsReceivablesData?.limit}
        total={accountsReceivablesData?.total}
      />
    </div>
  );
};

export default AccountsReceivablesPage;
