"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  useGetAccountInformationQuery,
  useGetAccountMetricsQuery,
} from "@/state/services/accountsApi";
import { Box, Typography } from "@mui/material";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import AccountMetrics from "./AccountMetrics";
import AccountInformation from "./AccountInformation";
import AccountBreakdownLists from "./AccountBreakdownLists";

const AccountPage = () => {
  const params = useParams();
  const { accountId } = params;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //Query for fetching basic account information
  const {
    data: accountInfoData,
    isLoading: isLoadingAccInfo,
    isError: isErrorAccInfo,
    error: accInfoError,
    refetch: refetchAccInfo,
  } = useGetAccountInformationQuery(accountId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  //Query for fetching account metrics
  const queryArgsAccMetrics = useMemo(
    () => ({
      accountId,
      startDate,
      endDate,
    }),
    [accountId, startDate, endDate]
  );

  const {
    data: accountMetricsData,
    isLoading: isLoadingAccMetrics,
    isError: isErrorAccMetrics,
    error: accMetricsError,
    refetch: refetchAccMetrics,
  } = useGetAccountMetricsQuery(queryArgsAccMetrics, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleFilterDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleClearInput = () => {
    setStartDate("");
    setEndDate("");
  };

  if (isLoadingAccInfo || isLoadingAccMetrics) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (
    isErrorAccInfo ||
    !accountInfoData ||
    isErrorAccMetrics ||
    !accountMetricsData
  ) {
    return (
      <ErrorMessage
        message={
          accInfoError?.data?.message ||
          accInfoError?.error ||
          "Failed to load account info" ||
          accMetricsError?.data?.message ||
          accMetricsError?.error ||
          "Failed to load account metrics"
        }
        onRetry={accInfoError ? refetchAccInfo : refetchAccMetrics}
      />
    );
  }

  return (
    <>
      <DynamicBreadcrumbs />
      <Box sx={{ p: 2, mx: "auto" }}>
        {/* Account information*/}
        <AccountInformation
          accountInfoData={accountInfoData}
          onFilter={handleFilterDateRange}
          onClear={handleClearInput}
        />

        {/* Account metrics*/}
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>

        <AccountMetrics accountMetricsData={accountMetricsData} />

        {/* Account lists (AR, sales, payments, refunds, creditMemos)*/}
        <Typography variant="h6" gutterBottom>
          Breakdown
        </Typography>

        <AccountBreakdownLists
          arStatusCounts={accountMetricsData.data.arStatusCounts}
          accountId={accountId}
          startDate={startDate}
          endDate={endDate}
        />
      </Box>
    </>
  );
};

export default AccountPage;
