"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetPaymentsQuery } from "@/state/services/paymentsApi";
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

const PaymentsPage = () => {
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
    data: paymentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPaymentsQuery(queryArgs, {
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

    if (!paymentsData) return { rows, exportData };

    paymentsData?.data.forEach((payment) => {
      rows.push({
        id: payment.paymentId,
        salesInvoiceNumber: payment.accountsReceivable.invoice
          ? payment.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        accountsReceivableId: payment.accountsReceivableId,
        createdAt: formatDateWithTime(payment.createdAt),
        createdBy: payment.createdBy.email,
        amount: formatToLocalCurrency(payment.amount),
        method: payment.method,
        reference: payment.reference ? payment.reference : "-",
        note: payment.note ? payment.note : "-",
        isVoid: payment.isVoid,
        voidBy: payment.voidBy ? payment.voidBy.email : "-",
      });

      exportData.push({
        "Invoice Number": payment.accountsReceivable.invoice
          ? payment.accountsReceivable.invoice.salesInvoiceNumber
          : "Opening A/R",
        "Date Processed": formatDateWithTime(payment.createdAt),
        "Processed By": payment.createdBy.email,
        Amount: formatToLocalCurrency(payment.amount),
        Method: payment.method,
        Reference: payment.reference ? payment.reference : "-",
        Note: payment.note ? payment.note : "-",
        "Void Status": payment.isVoid ? "Voided" : "-",
        "Voided By": payment.voidBy ? payment.voidBy.email : "-",
      });
    });

    return { rows, exportData };
  }, [paymentsData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !paymentsData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load payments"
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
            Number of Payments: {formatNumber(paymentsData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="payments"
              sheetName="Payments"
            />
          </div>
        </div>
      </div>
      <Table rows={rows} columns={columns} enableSelection={false} />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={paymentsData?.page}
        limit={paymentsData?.limit}
        total={paymentsData?.total}
      />
    </div>
  );
};

export default PaymentsPage;
