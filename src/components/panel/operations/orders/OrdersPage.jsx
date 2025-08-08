"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetOrdersQuery } from "@/state/services/ordersApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import ExportExcel from "@/components/Utils/ExportExcel";
import PaginationControls from "@/components/Utils/TablePagination";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import {
  formatToThousands,
  formatToThousandsWithDecimals,
} from "@/utils/quantityFormatter";
import { usePathname } from "next/navigation";
import ColoredLink from "@/components/Utils/ColoredLink";
import { Chip, Typography } from "@mui/material";

const columns = [
  {
    field: "salesInvoiceNumber",
    headerName: "Invoice Number",
    render: (value, row) => {
      return row.accountsReceivableId ? (
        <ColoredLink
          href={`/operations/accounts-receivables/${row.accountsReceivableId}`}
          linkText={value}
        />
      ) : (
        value
      );
    },
    minWidth: 150,
  },
  {
    field: "bookedBy",
    headerName: "Booked By",
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
          return <Chip label="Fulfilled" color="success" size="small" />;
        case "Cancelled":
          return <Chip label="Cancelled" color="error" size="small" />;
        case "ChangedProduct":
          return <Chip label="Changed Product" color="info" size="small" />;
        case "Pending":
          return <Chip label="Pending" color="warning" size="small" />;
        default:
          return <Chip label={actionType} size="small" />;
      }
    },
    minWidth: 150,
  },
];

const OrdersPage = () => {
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
    data: ordersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrdersQuery(queryArgs, {
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

    if (!ordersData) return { rows, exportData };

    ordersData?.data.forEach((order) => {
      rows.push({
        id: order.orderId,
        salesInvoiceNumber: order.sale
          ? order.sale.accountsReceivable.invoice.salesInvoiceNumber
          : "Not Approved Yet",
        accountsReceivableId: order.sale
          ? order.sale.accountsReceivable.accountsReceivableId
          : null,
        bookedBy: order.booking
          ? order.booking.customerName
          : order.sale.accountsReceivable.invoice.booking.customerName,
        bookingId: order.booking
          ? order.booking.bookingId
          : order.sale.accountsReceivable.invoice.booking.bookingId,
        productName: order.product.productName,
        productId: order.product.productId,
        uom: formatToThousandsWithDecimals(order.product.uom),
        quantity: formatToThousands(order.quantity),
        price: formatToLocalCurrency(order.price),
        subtotal: formatToLocalCurrency(order.quantity * order.price),
        volume: formatToThousandsWithDecimals(
          order.quantity * order.product.uom
        ),
        status:
          order.booking && order.booking.status === "Pending"
            ? order.booking.status
            : order.sale.actionType,
      });

      exportData.push({
        "Invoice Number": order.sale
          ? order.sale.accountsReceivable.invoice.salesInvoiceNumber
          : "-",
        "Booked By": order.booking
          ? order.booking.customerName
          : order.sale.accountsReceivable.invoice.booking.customerName,
        Product: order.product.productName,
        "UOM (L)": formatToThousandsWithDecimals(order.product.uom),
        Quantity: formatToThousands(order.quantity),
        "Unit Price": formatToLocalCurrency(order.price),
        Subtotal: formatToLocalCurrency(order.quantity * order.price),
        Volume: formatToThousandsWithDecimals(
          order.quantity * order.product.uom
        ),
        Status:
          order.booking && order.booking.status === "Pending"
            ? order.booking.status
            : order.sale.actionType,
      });
    });

    return { rows, exportData };
  }, [ordersData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !ordersData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load orders"
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
            Number of Orders: {formatToThousands(ordersData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="orders"
              sheetName="Orders"
            />
          </div>
        </div>
      </div>
      <Table rows={rows} columns={columns} enableSelection={false} />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={ordersData?.page}
        limit={ordersData?.limit}
        total={ordersData?.total}
      />
    </div>
  );
};

export default OrdersPage;
