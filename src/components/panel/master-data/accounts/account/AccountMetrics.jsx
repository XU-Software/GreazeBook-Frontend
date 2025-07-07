"use client";

import React, { useMemo, useState } from "react";
import { useGetAccountMetricsQuery } from "@/state/services/accountsApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { Grid, Paper, Typography } from "@mui/material";

const AccountMetrics = ({ accountId = "", startDate = "", endDate = "" }) => {
  const queryArgs = useMemo(
    () => ({
      accountId,
      startDate,
      endDate,
    }),
    [accountId, startDate, endDate]
  );

  const {
    data: accountMetricsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccountMetricsQuery(queryArgs, {
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

  if (isError || !accountMetricsData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load account metrics"
        }
        onRetry={refetch}
      />
    );
  }

  const {
    outstandingBalance,
    totalSales,
    totalPayments,
    netPaymentsApplied,
    overdueAmount,
    agingBuckets,
    arStatusCounts,
    pendingExcess,
    refundedAmount,
    creditMemoAmount,
  } = accountMetricsData.data;
  return (
    <Grid container spacing={2} mb={4}>
      <Grid container spacing={2} size={{ xs: 12 }}>
        {[
          { label: "Outstanding Balance", value: outstandingBalance },
          { label: "Total Sales", value: totalSales },
          { label: "Net Payments Applied", value: netPaymentsApplied },
          { label: "Overdue Amount", value: overdueAmount },
          { label: "Total Payments Amount", value: totalPayments },
          { label: "Unprocessed Overpayments", value: pendingExcess },
          { label: "Refunded Amount", value: refundedAmount },
          { label: "Credit Memo Available", value: creditMemoAmount },
        ].map((item, idx) => (
          <Grid item size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
            <Paper elevation={2} className="p-4 rounded-xl h-full w-full">
              <Typography variant="subtitle2">{item.label}</Typography>
              <Typography variant="h6">
                {formatToLocalCurrency(item.value)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Paper elevation={2} className="p-4 bg-gray-50 rounded-xl w-full">
              <Typography variant="subtitle2" gutterBottom>
                Aging
              </Typography>
              <Box sx={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agingData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      label={({ value }) => formatToLocalCurrency(value)}
                    >
                      {agingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Paper elevation={2} className="p-4 bg-gray-50 rounded-xl w-full">
              <Typography variant="subtitle2" gutterBottom>
                Sales and Payments
              </Typography>
              <Box sx={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesPaymentsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                    <Line type="monotone" dataKey="payments" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid> */}
    </Grid>
  );
};

export default AccountMetrics;
