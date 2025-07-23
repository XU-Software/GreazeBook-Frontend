"use client";

import React from "react";
import { useSetOpeningARMutation } from "@/state/services/accountsApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DateRangePicker from "@/components/Utils/DateRangePicker";
import { Paper, Typography, Grid, Box, Stack, Button } from "@mui/material";
import { formatDateWithTime } from "@/utils/dateFormatter";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import AddRowButton from "@/components/Utils/AddRowButton";

const AccountInformation = ({
  accountInfoData,
  accountId = "",
  onFilter = () => {},
  onClear = () => {},
  setAccumulatedData = () => {},
  setPage = () => {},
}) => {
  const dispatch = useAppDispatch();

  const {
    customerNumber,
    accountName,
    tradeType,
    location,
    dsp,
    contactInformation,
    createdAt,
  } = accountInfoData.data;

  //Function for handling opening A/R
  const [setOpeningAR, { isLoading: isSettingOpeningAR }] =
    useSetOpeningARMutation();

  const handleSetOpeningAR = async (accountId, openingARInfo) => {
    try {
      const res = await setOpeningAR({ accountId, openingARInfo }).unwrap();
      setAccumulatedData({
        accountsReceivables: [],
        sales: [],
        payments: [],
        creditMemos: [],
        refunds: [],
      });
      setPage(1);
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Opening A/R has been set",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to set Opening A/R",
        })
      );
    }
  };

  const handleWrapperFunction = async (openingARInfo) => {
    handleSetOpeningAR(accountId, openingARInfo);
  };

  return (
    <Paper elevation={2} className="p-4 rounded-xl h-full w-full mb-4">
      <Box className="flex flex-wrap items-center justify-between">
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h4">{accountName}</Typography>
          <AddRowButton
            buttonLabel="Opening A/R"
            title="Set Opening A/R"
            description="⚠️ Important: Once the Opening A/R is set, it cannot be modified or revoked. Please proceed only when the details are finalized and fully validated."
            descriptionColor="error"
            columns={[
              { field: "amount", headerName: "Amount", type: "number" },
              { field: "dueDate", headerName: "Due Date", type: "date" },
              { field: "note", headerName: "Note", type: "text" },
            ]}
            initialValues={{ amount: "", dueDate: "", note: "" }}
            onSubmit={handleWrapperFunction} // Pass wrapper
          />
        </Stack>

        <DateRangePicker onFilter={onFilter} onClear={onClear} />
      </Box>

      <Grid container columnSpacing={4} rowSpacing={1} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Customer Number</Typography>
          <Typography>{customerNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Trade Type</Typography>
          <Typography>{tradeType}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Location</Typography>
          <Typography>{location}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Dsp</Typography>
          <Typography>{dsp}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Contact Information</Typography>
          <Typography>{contactInformation}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Created At</Typography>
          <Typography>{formatDateWithTime(createdAt)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountInformation;
