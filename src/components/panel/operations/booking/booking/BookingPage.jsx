"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  useGetSingleBookingQuery,
  useUpdatePendingBookingMutation,
} from "@/state/api";
import NextLink from "next/link";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import EditableField from "@/components/Utils/EditableField";
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
  const [editedBookingData, setEditedBookingData] = useState({
    orderDate: "",
    deliveryDate: "",
    customerName: "",
    term: "",
    freebiesRemarksConcern: "",
  });

  useEffect(() => {
    if (bookingData?.data) {
      const {
        orderDate,
        deliveryDate,
        customerName,
        term,
        freebiesRemarksConcern,
      } = bookingData.data;

      setEditedBookingData({
        orderDate: formatDateForInput(orderDate) || "",
        deliveryDate: formatDateForInput(deliveryDate) || "",
        customerName: customerName || "",
        term: term || "",
        freebiesRemarksConcern: freebiesRemarksConcern || "",
      });
    }
  }, [bookingData]);

  const [updatePendingBooking, { isLoading: isUpdating }] =
    useUpdatePendingBookingMutation();

  const handleUpdateBooking = async (bookingId, booking) => {
    try {
      const {
        orderDate,
        deliveryDate,
        customerName,
        term,
        freebiesRemarksConcern,
      } = booking;
      if (
        !orderDate ||
        !deliveryDate ||
        !customerName ||
        !term ||
        !freebiesRemarksConcern
      ) {
        throw new Error("Fields must be non-empty", 400);
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
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

  console.log(editedBookingData);

  return (
    <div>
      <DynamicBreadcrumbs />
      <Box p={4}>
        {/* Booking Details */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              className="flex justify-between items-center"
            >
              <span>🧾 Booking Details</span>
              {status === "Pending" && editBooking ? (
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Save Changes">
                    <IconButton
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleUpdateBooking(bookingId, editedBookingData)
                      }
                      loading={isUpdating}
                      size="medium"
                    >
                      <Check fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel Editing">
                    <IconButton
                      variant="outlined"
                      size="medium"
                      color="secondary"
                      onClick={() => {
                        setEditedBookingData({
                          orderDate: formatDateForInput(orderDate) || "",
                          deliveryDate: formatDateForInput(deliveryDate) || "",
                          customerName: customerName || "",
                          term: term || "",
                          freebiesRemarksConcern: freebiesRemarksConcern || "",
                        });
                        setEditBooking(false);
                      }}
                    >
                      <Close fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ) : (
                <IconButton size="medium" onClick={() => setEditBooking(true)}>
                  <Edit fontSize="medium" />
                </IconButton>
              )}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
              gap={2}
            >
              <EditableField
                label="Order Date"
                value={editedBookingData.orderDate}
                editing={editBooking}
                type="date"
                name="orderDate"
                onChange={(e) =>
                  setEditedBookingData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <EditableField
                label="Delivery Date"
                value={editedBookingData.deliveryDate}
                editing={editBooking}
                type="date"
                name="deliveryDate"
                onChange={(e) =>
                  setEditedBookingData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Typography>
                <strong>Account Name:</strong> {account.accountName}
              </Typography>
              <EditableField
                label="Customer Name"
                value={editedBookingData.customerName}
                editing={editBooking}
                type="text"
                name="customerName"
                onChange={(e) =>
                  setEditedBookingData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Typography>
                <strong>Total Amount:</strong>{" "}
                {formatToLocalCurrency(totalAmount)}
              </Typography>
              <EditableField
                label="Term"
                value={editedBookingData.term}
                editing={editBooking}
                type="number"
                name="term"
                onChange={(e) =>
                  setEditedBookingData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <EditableField
                label="Freebies/Remarks/Concern"
                value={editedBookingData.freebiesRemarksConcern}
                editing={editBooking}
                type="text"
                name="freebiesRemarksConcern"
                onChange={(e) =>
                  setEditedBookingData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              {/* <Typography>
                <strong>Booking ID:</strong> BK-202506
              </Typography> */}
              <Typography>
                <strong>Created At:</strong> {formatDateWithTime(createdAt)}
              </Typography>
              <Typography>
                <strong>Created By:</strong> {createdBy.name} |{" "}
                {createdBy.email}
              </Typography>
              <Typography>
                <strong>Approved By:</strong> {approvedBy?.name} |{" "}
                {approvedBy?.email}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>
                  <strong>Status:</strong>
                </Typography>
                <Chip
                  label={status}
                  color={status === "Approved" ? "success" : "warning"}
                  size="small"
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Typography variant="h6">🛒 Orders ({orders.length})</Typography>

              <Tooltip
                title={
                  status === "Approved"
                    ? "Cannot add new orders to an approved booking"
                    : "Add a new order to this booking"
                }
                arrow
              >
                <span>
                  {" "}
                  {/* Needed to wrap disabled button to ensure Tooltip works */}
                  <Button variant="outlined" disabled={status === "Approved"}>
                    + Add Order
                  </Button>
                </span>
              </Tooltip>
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell align="center" sx={{ width: 120 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{order.product.productName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        {formatToLocalCurrency(order.price)}
                      </TableCell>
                      <TableCell>
                        {formatToLocalCurrency(order.quantity * order.price)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: 120,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            onClick={() => {}}
                            color="primary"
                            size="medium"
                          >
                            <Edit fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            onClick={() => {}}
                            color="error"
                            size="medium"
                          >
                            <Delete fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <strong>Total Amount:</strong>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <strong>{formatToLocalCurrency(totalAmount)}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

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
