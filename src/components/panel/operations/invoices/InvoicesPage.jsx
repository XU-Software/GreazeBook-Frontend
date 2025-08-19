"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetInvoicesQuery } from "@/state/services/invoicesApi";
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
import { formatNumber } from "@/utils/quantityFormatter";
import { usePathname } from "next/navigation";
import { Typography } from "@mui/material";

const columns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    minWidth: 150,
  },
  {
    field: "customerName",
    headerName: "Customer Name",
    minWidth: 150,
  },
  {
    field: "accountName",
    headerName: "Account Name",
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
  {
    field: "totalAmount",
    headerName: "Total Amount",
    minWidth: 150,
  },
  {
    field: "term",
    headerName: "Term",
    render: (value) => formatNumber(value),
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 150,
  },
];

const InvoicesPage = () => {
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
    data: invoicesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInvoicesQuery(queryArgs, {
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

    if (!invoicesData) return { rows, exportData };

    invoicesData?.data.forEach((invoice) => {
      rows.push({
        id: invoice.invoiceId,
        salesInvoiceNumber: invoice.salesInvoiceNumber,
        customerName: invoice.booking.customerName,
        accountName: invoice.booking.account.accountName,
        location: invoice.booking.account.location,
        dsp: invoice.booking.account.dsp,
        totalAmount: formatToLocalCurrency(invoice.totalAmount),
        term: invoice.booking.term,
        createdAt: formatDate(invoice.createdAt),
      });

      exportData.push({
        "Invoice Number": invoice.salesInvoiceNumber,
        "Customer Name": invoice.booking.customerName,
        "Account Name": invoice.booking.account.accountName,
        Location: invoice.booking.account.location,
        DSP: invoice.booking.account.dsp,
        "Total Amount": formatToLocalCurrency(invoice.totalAmount),
        Term: formatNumber(invoice.booking.term),
        "Created At": formatDate(invoice.createdAt),
      });
    });

    return { rows, exportData };
  }, [invoicesData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !invoicesData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load invoices"
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
            Number of Invoices: {formatNumber(invoicesData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="invoices"
              sheetName="Invoices"
            />
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={(invoiceId) => router.push(`${pathName}/${invoiceId}`)}
        enableSelection={false}
      />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={invoicesData?.page}
        limit={invoicesData?.limit}
        total={invoicesData?.total}
      />
    </div>
  );
};

export default InvoicesPage;
