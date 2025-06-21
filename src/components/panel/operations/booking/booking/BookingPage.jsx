"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  useGetSingleBookingQuery,
  useUpdatePendingBookingMutation,
  useUpdatePendingOrdersMutation,
} from "@/state/api";
import NextLink from "next/link";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import EditableField from "@/components/Utils/EditableField";
import EditableCell from "@/components/Utils/EditableCell";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Divider,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Check, Close, Delete } from "@mui/icons-material";
import { formatDateWithTime, formatDateForInput } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import BookingDetails from "./BookingDetails";
import OrdersDetail from "./OrdersDetail";

const BookingPage = () => {
  const params = useParams();
  const pathName = usePathname();
  const { bookingId } = params;
  const dispatch = useAppDispatch();

  const {
    data: bookingData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleBookingQuery(bookingId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [editBooking, setEditBooking] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({});

  const [editOrders, setEditOrders] = useState(false);
  // Stores only changed fields per order
  const [ordersFormData, setOrdersFormData] = useState(new Map());

  // Stores IDs of deleted orders
  const [ordersToDelete, setOrdersToDelete] = useState(new Set());

  const [updatePendingBooking, { isLoading: isUpdatingBooking }] =
    useUpdatePendingBookingMutation();

  const handleUpdateBooking = async (bookingId, booking) => {
    try {
      if (Object.keys(booking).length === 0) {
        throw new Error("No changes made", 400);
      }
      const res = await updatePendingBooking({
        bookingId,
        booking,
      }).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Booking updated",
        })
      );
      setBookingFormData({});
      setEditBooking(false);
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to update booking",
        })
      );
    }
  };

  const [updatePendingOrders, { isLoading: isUpdatingOrders }] =
    useUpdatePendingOrdersMutation();

  const handleUpdateOrders = async (
    bookingId,
    ordersToUpdateMap,
    orderIdsToDeleteSet
  ) => {
    try {
      if (ordersToUpdateMap.size === 0 && orderIdsToDeleteSet.size === 0) {
        throw new Error("No changes made", 400);
      }
      const ordersToUpdate = Array.from(ordersToUpdateMap.entries()).map(
        ([orderId, data]) => ({
          orderId,
          ...data,
        })
      );

      const orderIdsToDelete = Array.from(orderIdsToDeleteSet);

      const res = await updatePendingOrders({
        bookingId,
        ordersToUpdate,
        orderIdsToDelete,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Orders updated",
        })
      );
      setOrdersFormData(new Map());
      setOrdersToDelete(new Set());
      setEditOrders(false);
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to update orders",
        })
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !bookingData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load booking"
        }
        onRetry={refetch}
      />
    );
  }

  const {
    orderDate,
    deliveryDate,
    customerName,
    totalAmount,
    term,
    freebiesRemarksConcern,
    status,
    createdAt,
    updatedAt,
    account,
    orders,
    createdBy,
    approvedBy,
  } = bookingData?.data;

  return (
    <div>
      <DynamicBreadcrumbs />
      <Box p={4}>
        {/* Booking Details */}
        <BookingDetails
          editBooking={editBooking}
          setEditBooking={setEditBooking}
          bookingFormData={bookingFormData}
          setBookingFormData={setBookingFormData}
          handleUpdateBooking={handleUpdateBooking}
          bookingId={bookingId}
          isUpdating={isUpdatingBooking}
          bookingData={bookingData.data}
        />
        {/* Orders Details */}
        <OrdersDetail
          editOrders={editOrders}
          setEditOrders={setEditOrders}
          ordersFormData={ordersFormData}
          setOrdersFormData={setOrdersFormData}
          handleUpdateOrders={handleUpdateOrders}
          bookingId={bookingId}
          isUpdating={isUpdatingOrders}
          bookingData={bookingData.data}
          ordersToDelete={ordersToDelete}
          setOrdersToDelete={setOrdersToDelete}
        />
        {/* Notes Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📝 Notes / Internal Comments
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Optional notes or internal comments for this booking..."
            />
          </CardContent>
        </Card>

        {/* Bottom Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="secondary">
            Generate Invoice
          </Button>
          <Button variant="outlined" color="error">
            Delete
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default BookingPage;
