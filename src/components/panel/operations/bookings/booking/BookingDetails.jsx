"use client";

import React from "react";
import EditableField from "@/components/Utils/EditableField";
import { Edit, Check, Close } from "@mui/icons-material";
import { formatDateWithTime, formatDateForInput } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import ColoredLink from "@/components/Utils/ColoredLink";

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
            bookingData.status === "Pending" && (
              <IconButton
                size="medium"
                color="primary"
                onClick={() => setEditBooking(true)}
              >
                <Edit fontSize="medium" />
              </IconButton>
            )
          )}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container columnSpacing={4} rowSpacing={1} mb={2}>
          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Account Name</Typography>
            <ColoredLink
              href={`/master-data/accounts/${bookingData.accountId}`}
              linkText={bookingData.account.accountName}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Total Amount</Typography>
            <Typography>
              {formatToLocalCurrency(bookingData.totalAmount)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Created At</Typography>
            <Typography>{formatDateWithTime(bookingData.createdAt)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Created By</Typography>
            <Typography>
              {bookingData.createdBy.name} | {bookingData.createdBy.email}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Approved By</Typography>
            <Typography>
              {bookingData.approvedBy?.name} | {bookingData.approvedBy?.email}
            </Typography>
          </Grid>

          <Stack direction="column" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">Status</Typography>
            <Chip
              label={bookingData.status}
              color={bookingData.status === "Approved" ? "success" : "warning"}
              size="small"
            />
          </Stack>
          {bookingData.status !== "Pending" && bookingData.invoice && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2">Generated Invoice</Typography>
              <ColoredLink
                href={`/operations/invoices/${bookingData.invoice?.invoiceId}`}
                linkText={bookingData.invoice?.salesInvoiceNumber}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default React.memo(BookingDetails);
