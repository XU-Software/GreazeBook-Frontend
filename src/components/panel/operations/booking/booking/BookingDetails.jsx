"use client";

import React from "react";
import EditableField from "@/components/Utils/EditableField";
import { Edit, Check, Close, Delete } from "@mui/icons-material";
import { formatDateWithTime, formatDateForInput } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
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

const BookingDetails = ({
  editBooking = false,
  setEditBooking = () => {},
  bookingFormData = {},
  setBookingFormData = () => {},
  handleUpdateBooking = () => {},
  bookingId = "",
  isUpdating = false,
  bookingData = {},
}) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          className="flex justify-between items-center"
        >
          <span>🧾 Booking Details</span>
          {bookingData.status === "Pending" && editBooking ? (
            <Stack direction="row" spacing={2}>
              <Tooltip title="Save Changes">
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleUpdateBooking(bookingId, bookingFormData)
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
                    setBookingFormData({});
                    setEditBooking(false);
                  }}
                  loading={isUpdating}
                >
                  <Close fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <IconButton
              size="medium"
              color="primary"
              onClick={() => setEditBooking(true)}
            >
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
            value={
              bookingFormData.orderDate !== undefined
                ? bookingFormData.orderDate
                : formatDateForInput(bookingData.orderDate) || ""
            }
            editing={editBooking}
            type="date"
            name="orderDate"
            onChange={(e) =>
              setBookingFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <EditableField
            label="Delivery Date"
            value={
              bookingFormData.deliveryDate !== undefined
                ? bookingFormData.deliveryDate
                : formatDateForInput(bookingData.deliveryDate) || ""
            }
            editing={editBooking}
            type="date"
            name="deliveryDate"
            onChange={(e) =>
              setBookingFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <Typography>
            <strong>Account Name:</strong> {bookingData.account.accountName}
          </Typography>
          <EditableField
            label="Customer Name"
            value={
              bookingFormData.customerName !== undefined
                ? bookingFormData.customerName
                : bookingData.customerName || ""
            }
            editing={editBooking}
            type="text"
            name="customerName"
            onChange={(e) =>
              setBookingFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <Typography>
            <strong>Total Amount:</strong>{" "}
            {formatToLocalCurrency(bookingData.totalAmount)}
          </Typography>
          <EditableField
            label="Term"
            value={
              bookingFormData.term !== undefined
                ? bookingFormData.term
                : bookingData.term || ""
            }
            editing={editBooking}
            type="number"
            name="term"
            onChange={(e) =>
              setBookingFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <EditableField
            label="Freebies/Remarks/Concern"
            value={
              bookingFormData.freebiesRemarksConcern !== undefined
                ? bookingFormData.freebiesRemarksConcern
                : bookingData.freebiesRemarksConcern || ""
            }
            editing={editBooking}
            type="text"
            name="freebiesRemarksConcern"
            onChange={(e) =>
              setBookingFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <Typography>
            <strong>Created At:</strong>{" "}
            {formatDateWithTime(bookingData.createdAt)}
          </Typography>
          <Typography>
            <strong>Created By:</strong> {bookingData.createdBy.name} |{" "}
            {bookingData.createdBy.email}
          </Typography>
          <Typography>
            <strong>Approved By:</strong> {bookingData.approvedBy?.name} |{" "}
            {bookingData.approvedBy?.email}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>
              <strong>Status:</strong>
            </Typography>
            <Chip
              label={bookingData.status}
              color={bookingData.status === "Approved" ? "success" : "warning"}
              size="small"
            />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingDetails;
