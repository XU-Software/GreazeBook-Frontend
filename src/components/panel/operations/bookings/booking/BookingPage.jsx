"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import {
  useDeletePendingBookingMutation,
  useGetSingleBookingQuery,
  useUpdatePendingBookingMutation,
  useUpdatePendingOrdersMutation,
} from "@/state/services/bookingsApi";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import { Box, Button, Stack } from "@mui/material";

import BookingDetails from "./BookingDetails";
import OrdersDetail from "./OrdersDetail";
import NoteDetails from "./NoteDetails";
import InvoiceNumberModal from "./InvoiceNumberModal";
import ConfirmationModal from "@/components/Utils/ConfirmationModal";
import GenerateAndPrintInvoiceModal from "./GenerateAndPrintModal";

const BookingPage = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { bookingId } = params;
  const dispatch = useAppDispatch();

  // Get only the first two non-empty segments
  const baseSegments = pathname.split("/").filter(Boolean).slice(0, 2);

  // Join them back into a path
  const basePath = "/" + baseSegments.join("/");

  const userData = useAppSelector((state) => state.global.userData);
  const role = userData?.data?.role || "user";

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

  // Toggle state for delete confirmation modal
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);

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

  const [deletePendingBooking, { isLoading: isDeletingBooking }] =
    useDeletePendingBookingMutation();

  // HANDLE FOR DELETING PENDING BOOKING
  const handleDeleteBooking = async (bookingId) => {
    try {
      const res = await deletePendingBooking({ bookingId }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Booking deleted",
        })
      );
      router.replace(basePath);
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to delete booking",
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

  return (
    <div>
      <DynamicBreadcrumbs />
      <Box p={2}>
        {/* Action Buttons */}
        <Stack direction="row" spacing={2} mb={2}>
          {(role === "admin" || role === "superadmin") && (
            <>
              <GenerateAndPrintInvoiceModal
                bookingData={bookingData}
                bookingId={bookingId}
              />
              <InvoiceNumberModal
                bookingData={bookingData}
                bookingId={bookingId}
              />
            </>
          )}
          {bookingData.data.status === "Pending" && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setToggleDeleteModal(true)}
            >
              Delete
            </Button>
          )}
        </Stack>

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
        <NoteDetails bookingData={bookingData} bookingId={bookingId} />
      </Box>
      <ConfirmationModal
        open={toggleDeleteModal}
        onClose={() => setToggleDeleteModal(false)}
        onConfirm={() => handleDeleteBooking(bookingId)}
        title={"Delete Booking"}
        message={
          "Are you sure you want to delete this booking and together with its associated orders?"
        }
        confirmText="Delete"
        confirmButtonColor="error"
        cancelText="Cancel"
        cancelButtonColor="primary"
      />
    </div>
  );
};

export default BookingPage;
