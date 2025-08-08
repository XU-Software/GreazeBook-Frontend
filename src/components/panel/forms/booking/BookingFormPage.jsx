"use client";

import { Box, Button, Grid, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useGetAccountsQuery } from "@/state/services/accountsApi";
import SearchableSelect from "../../../Utils/SearchableSelect";
import OrdersComponent from "./OrdersComponent";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import { useSubmitBookingMutation } from "@/state/services/bookingsApi";
import { formatToThousands } from "@/utils/quantityFormatter";
import QuantityTextField from "@/components/Utils/QuantityTextField";

export default function BookingFormPage() {
  const dispatch = useAppDispatch();

  const [bookingInformation, setBookingInformation] = useState({
    orderDate: "",
    deliveryDate: "",
    customerName: "",
    term: "",
    freebiesRemarksConcern: "",
  });

  const [accountData, setAccountData] = useState(null);

  const [ordersData, setOrdersData] = useState([]);

  const handleChangeBookingInformation = (field, value) => {
    setBookingInformation((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnSelectAccount = (value) => {
    setAccountData(value);
  };

  const isCompleteField = () => {
    const {
      orderDate,
      deliveryDate,
      customerName,
      term,
      freebiesRemarksConcern,
    } = bookingInformation;
    if (
      !orderDate ||
      !deliveryDate ||
      !customerName ||
      !term ||
      !freebiesRemarksConcern ||
      !accountData ||
      ordersData.length === 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const [submitBooking, { isLoading: isSubmitting }] =
    useSubmitBookingMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isCompleteField()) throw new Error("All fields are required", 400);

      // restructure data to fit the data structure the backend accepts
      const account = { accountId: accountData.accountId };
      const orders = ordersData.map((order) => ({
        productId: order.product.productId,
        quantity: order.quantity,
        price: order.price,
      }));

      // send to backend
      const res = await submitBooking({
        bookingInformation,
        account,
        orders,
      }).unwrap();

      // Reset
      setBookingInformation({
        orderDate: "",
        deliveryDate: "",
        customerName: "",
        term: "",
        freebiesRemarksConcern: "",
      });
      setAccountData(null);
      setOrdersData([]);

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Booking submitted",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to submit booking",
        })
      );
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        pb: 4,
        pt: 0,
        mx: "auto",
      }}
      className="container m-auto"
    >
      <h2 className="text-2xl font-semibold my-4">Create Booking</h2>
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2} fontWeight={500}>
            Booking Details
          </Typography>
          <p className="font-bold text-md border border-gray-300 p-2 bg-blue-100 my-2">
            Information
          </p>
          <div className="px-2 flex flex-col gap-2 break-all">
            <p>
              Order Date:{" "}
              <span className="font-semibold">
                {bookingInformation.orderDate}
              </span>
            </p>
            <p>
              Delivery Date:{" "}
              <span className="font-semibold">
                {bookingInformation.deliveryDate}
              </span>
            </p>
            <p>
              Account Name:{" "}
              <span className="font-semibold">{accountData?.accountName}</span>
            </p>
            <p>
              Customer Name:{" "}
              <span className="font-semibold">
                {bookingInformation.customerName}
              </span>
            </p>
            <p>
              Term:{" "}
              <span className="font-semibold">
                {formatToThousands(bookingInformation.term)}
              </span>
            </p>
            <p>
              Freebies/Remarks/Concern:{" "}
              <span className="font-semibold">
                {bookingInformation.freebiesRemarksConcern}
              </span>
            </p>
          </div>
          <p className="font-bold text-md border border-gray-300 p-2 bg-blue-100 my-2 mb-4">
            Fill up form
          </p>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Order Date"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={bookingInformation.orderDate}
                name="orderDate"
                onChange={(e) =>
                  handleChangeBookingInformation(e.target.name, e.target.value)
                }
                required
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Delivery Date"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={bookingInformation.deliveryDate}
                name="deliveryDate"
                onChange={(e) =>
                  handleChangeBookingInformation(e.target.name, e.target.value)
                }
                required
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <SearchableSelect
                label="Choose Account"
                queryHook={useGetAccountsQuery}
                getOptionKey={(option) => option?.accountId || ""}
                getOptionLabel={(option) =>
                  option?.accountName +
                    " - " +
                    option?.location +
                    " - " +
                    option?.dsp || ""
                }
                onSelect={(value) => {
                  handleOnSelectAccount(value);
                }}
                value={accountData}
                isOptionEqualToValue={(option, value) =>
                  option?.accountId === value?.accountId
                }
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Customer Name"
                fullWidth
                value={bookingInformation.customerName}
                name="customerName"
                onChange={(e) =>
                  handleChangeBookingInformation(e.target.name, e.target.value)
                }
                required
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <QuantityTextField
                name="term"
                value={bookingInformation.term}
                onChange={(e) =>
                  handleChangeBookingInformation(e.target.name, e.target.value)
                }
                label="Term (days)"
                required
                fullWidth
              />
              {/* <TextField
                label="Term (days)"
                type="number"
                fullWidth
                value={bookingInformation.term}
                name="term"
                onChange={(e) =>
                  handleChangeBookingInformation(e.target.name, e.target.value)
                }
                required
              /> */}
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Freebies Remarsk Concern"
                fullWidth
                value={bookingInformation.freebiesRemarksConcern}
                name="freebiesRemarksConcern"
                onChange={(e) =>
                  handleChangeBookingInformation(e.target.name, e.target.value)
                }
                required
              />
            </Grid>
          </Grid>
        </Paper>
        <OrdersComponent
          ordersData={ordersData}
          setOrdersData={setOrdersData}
        />
        <Box textAlign="right">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            loading={isSubmitting}
          >
            Submit Booking
          </Button>
        </Box>
      </form>
    </Box>
  );
}
