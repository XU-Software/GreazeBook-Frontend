"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetBookingsQuery,
  useDeleteBookingsMutation,
} from "@/state/services/bookingsApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import ExportExcel from "@/components/Utils/ExportExcel";
import DeleteSelectedButton from "@/components/Utils/DeleteSelectedButton";
import PaginationControls from "@/components/Utils/TablePagination";
import { formatDate } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import { Chip, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const statusColorMap = {
  Pending: "warning",
  Approved: "success",
};

const columns = [
  {
    field: "orderDate",
    headerName: "Order Date",
    minWidth: 150,
  },
  { field: "deliveryDate", headerName: "Delivery Date", minWidth: 150 },
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
    field: "freebiesRemarksConcern",
    headerName: "Freebies/Remarks/Concern",
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    render: (value) => (
      <Chip
        label={value.charAt(0).toUpperCase() + value.slice(1)}
        color={statusColorMap[value] || "default"}
        size="small"
      />
    ),
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 150,
  },
];

const BookingsPage = () => {
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(new Set());

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
    data: bookingsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBookingsQuery(queryArgs, {
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

  const [deleteBookings, { isLoading: isDeletingBookings }] =
    useDeleteBookingsMutation();

  const handleDeleteSelectedBookings = async (bookings) => {
    try {
      const res = await deleteBookings(bookings).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message:
            "Batch deletion complete\n" +
              res.failed
                .map((booking) => `${booking.accountName} - ${booking.message}`)
                .join("\n") ||
            res.message ||
            "Bookings deleted",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to delete bookings",
        })
      );
    }
  };

  const { rows, exportData } = useMemo(() => {
    const rows = [];
    const exportData = [];

    if (!bookingsData) return { rows, exportData };

    bookingsData?.data.forEach((booking) => {
      rows.push({
        id: booking.bookingId,
        orderDate: formatDate(booking.orderDate),
        deliveryDate: formatDate(booking.deliveryDate),
        customerName: booking.customerName,
        accountName: booking.account.accountName,
        location: booking.account.location,
        dsp: booking.account.dsp,
        totalAmount: formatToLocalCurrency(booking.totalAmount),
        term: booking.term,
        freebiesRemarksConcern: booking.freebiesRemarksConcern,
        status: booking.status,
        createdAt: formatDate(booking.createdAt),
      });

      exportData.push({
        "Order Date": formatDate(booking.orderDate),
        "Delivery Date": formatDate(booking.deliveryDate),
        "Customer Name": booking.customerName,
        "Account Name": booking.account.accountName,
        Location: booking.account.location,
        DSP: booking.account.dsp,
        "Total Amount": formatToLocalCurrency(booking.totalAmount),
        Term: formatNumber(booking.term),
        "Freebies/Remarks/Concern": booking.freebiesRemarksConcern,
        Status: booking.status,
        "Created At": formatDate(booking.createdAt),
      });
    });

    return { rows, exportData };
  }, [bookingsData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !bookingsData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load bookings"
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
            Number of Bookings: {formatNumber(bookingsData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="bookings"
              sheetName="Bookings"
            />
            <DeleteSelectedButton
              selected={selected}
              setSelected={setSelected}
              handleDeleteSelected={handleDeleteSelectedBookings}
              isDeleting={isDeletingBookings}
            />
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={(bookingId) => router.push(`${pathName}/${bookingId}`)}
        enableSelection={true}
        selected={selected}
        setSelected={setSelected}
      />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={bookingsData?.page}
        limit={bookingsData?.limit}
        total={bookingsData?.total}
      />
    </div>
  );
};

export default BookingsPage;
