"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetSalesQuery } from "@/state/services/salesApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import ExportExcel from "@/components/Utils/ExportExcel";
import DateRangePicker from "@/components/Utils/DateRangePicker";
import PaginationControls from "@/components/Utils/TablePagination";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import { formatDate } from "@/utils/dateFormatter";
import { usePathname } from "next/navigation";
import ColoredLink from "@/components/Utils/ColoredLink";
import { Chip, Typography } from "@mui/material";

const columns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    render: (value, row) => (
      <ColoredLink
        href={`/operations/accounts-receivables/${row.accountsReceivableId}`}
        linkText={value}
      />
    ),
    minWidth: 150,
  },
  {
    field: "invoiceDate",
    headerName: "Invoice Date",
    minWidth: 150,
  },
  {
    field: "customerName",
    headerName: "Outlet Name",
    render: (value, row) => (
      <ColoredLink
        href={`/operations/bookings/${row.bookingId}`}
        linkText={value}
      />
    ),
    minWidth: 150,
  },
  {
    field: "productName",
    headerName: "Product",
    render: (value, row) => (
      <ColoredLink
        href={`/master-data/products/${row.productId}`}
        linkText={value}
      />
    ),
    minWidth: 150,
  },
  {
    field: "uom",
    headerName: "UOM (L)",
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
    field: "subtotal",
    headerName: "Subtotal",
    minWidth: 150,
  },
  {
    field: "volume",
    headerName: "Volume",
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    render: (value, row) => {
      switch (value) {
        case "Fulfilled":
          return <Chip label="Invoiced" color="success" size="small" />;
        case "Cancelled":
          return <Chip label="Cancelled" color="error" size="small" />;
        case "ChangedProduct":
          return <Chip label="ChangedProduct" color="info" size="small" />;

        default:
          return <Chip label={actionType} size="small" />;
      }
    },
    minWidth: 150,
  },
];

const SalesPage = () => {
  const pathName = usePathname();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      sortOrder,
      search,
      startDate,
      endDate,
    }),
    [page, limit, sortOrder, search, startDate, endDate]
  );

  const {
    data: salesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSalesQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleFilterDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleClearInput = () => {
    setStartDate("");
    setEndDate("");
  };

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

    if (!salesData) return { rows, exportData };

    salesData?.data.forEach((sale) => {
      rows.push({
        id: sale.saleId,
        salesInvoiceNumber: sale.accountsReceivable.invoice.salesInvoiceNumber,
        invoiceDate: formatDate(sale.accountsReceivable.invoice.createdAt),
        accountsReceivableId: sale.accountsReceivableId,
        customerName: sale.accountsReceivable.invoice.booking.customerName,
        bookingId: sale.accountsReceivable.invoice.booking.bookingId,
        productName: sale.order.product.productName,
        productId: sale.order.product.productId,
        uom: formatNumber(sale.order.product.uom),
        quantity: formatNumber(sale.order.quantity),
        price: formatToLocalCurrency(sale.order.price),
        subtotal: formatToLocalCurrency(sale.order.quantity * sale.order.price),
        volume: formatNumber(sale.order.quantity * sale.order.product.uom),
        status: sale.actionType,
      });

      exportData.push({
        "Invoice Number": sale.accountsReceivable.invoice.salesInvoiceNumber,
        "Invoice Date": formatDate(sale.accountsReceivable.invoice.createdAt),
        "Outlet Name": sale.accountsReceivable.invoice.booking.customerName,
        Product: sale.order.product.productName,
        "UOM (L)": formatNumber(sale.order.product.uom),
        Quantity: formatNumber(sale.order.quantity),
        "Unit Price": formatToLocalCurrency(sale.order.price),
        Subtotal: formatToLocalCurrency(sale.order.quantity * sale.order.price),
        Volume: formatNumber(sale.order.quantity * sale.order.product.uom),
        Status: sale.actionType,
      });
    });

    return { rows, exportData };
  }, [salesData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !salesData) {
    return (
      <ErrorMessage
        message={error?.data?.message || error?.error || "Failed to load sales"}
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
            Number of Sales: {formatNumber(salesData?.total)}
          </Typography>
          <Typography>
            Total Volume: {formatNumber(salesData?.totalVolume)}
          </Typography>

          <DateRangePicker
            onFilter={handleFilterDateRange}
            onClear={handleClearInput}
            filterButtonText="Filter By Invoice Date"
            clearButtonText="Clear"
          />
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="sales"
              sheetName="Sales"
            />
          </div>
        </div>
      </div>
      <Table rows={rows} columns={columns} enableSelection={false} />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={salesData?.page}
        limit={salesData?.limit}
        total={salesData?.total}
      />
    </div>
  );
};

export default SalesPage;
