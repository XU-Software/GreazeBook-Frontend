"use client";

import React from "react";
import { useGetAccountInformationQuery } from "@/state/services/accountsApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DateRangePicker from "@/components/Utils/DateRangePicker";
import { Paper, Typography, Grid, Box } from "@mui/material";
import { formatDateWithTime } from "@/utils/dateFormatter";

const AccountInformation = ({
  accountId = "",
  onFilter = () => {},
  onClear = () => {},
}) => {
  const {
    data: accountInfoData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccountInformationQuery(accountId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !accountInfoData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load account information"
        }
        onRetry={refetch}
      />
    );
  }

  const {
    customerNumber,
    accountName,
    tradeType,
    location,
    dsp,
    contactInformation,
    createdAt,
  } = accountInfoData.data;

  return (
    <Paper elevation={2} className="p-4 rounded-xl h-full w-full mb-4">
      <Box className="flex flex-wrap items-center justify-between">
        <Typography variant="h4" gutterBottom>
          {accountName}
        </Typography>

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
