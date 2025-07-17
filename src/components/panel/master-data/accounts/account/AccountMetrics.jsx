"use client";

import React from "react";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { Grid, Paper, Typography, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";

const COLORS1 = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const COLORS2 = ["#4caf50", "#ff9800", "#f44336"];

const AccountMetrics = ({ accountMetricsData }) => {
  const {
    outstandingBalance,
    totalSales,
    totalPayments,
    netPaymentsApplied,
    overdueAmount,
    agingBuckets,
    paymentPerformance,
    arStatusCounts,
    pendingExcess,
    refundedAmount,
    creditMemoAmount,
  } = accountMetricsData.data;

  const agingBucketsPieOptions = {
    tooltip: {
      trigger: "item",
      formatter: ({ name, data, percent }) =>
        `${name}<br/>Count: ${data.count}<br/>Amount: ${formatToLocalCurrency(
          data.amount
        )}<br/>${percent}%`,
    },
    legend: {
      bottom: 0,
    },
    series: [
      {
        name: "Aging Buckets",
        type: "pie",
        radius: ["50%", "70%"], // Donut style
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: agingBuckets.map((item, index) => ({
          value: item.count,
          name: item.label,
          count: item.count,
          amount: item.amount,
          itemStyle: { color: COLORS1[index % COLORS1.length] },
        })),
      },
    ],
  };

  const paymentPerformancePieOptions = {
    tooltip: {
      trigger: "item",
      formatter: ({ name, value, percent, data }) =>
        `${name}<br/>Count: ${value}<br/>Amount: ${formatToLocalCurrency(
          data.amount
        )}<br/>(${percent}%)`,
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
    },
    series: [
      {
        name: "Payment Performance",
        type: "pie",
        radius: ["40%", "70%"], // Donut style
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: "{b}: {c}",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
        },
        data: paymentPerformance.map((item, index) => ({
          value: item.count,
          name: item.label,
          amount: item.amount,
          itemStyle: { color: COLORS2[index % COLORS2.length] },
        })),
      },
    ],
  };

  return (
    <Grid container spacing={2} mb={4}>
      {/*Metrics summary*/}
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

      {/* Pie graph for aging buckets*/}
      <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
        <Paper elevation={2} className="p-4 bg-gray-50 rounded-xl w-full">
          <Typography variant="subtitle2" gutterBottom>
            Aging Buckets
          </Typography>
          <Box sx={{ width: "100%", height: 250 }}>
            <ReactECharts
              option={agingBucketsPieOptions}
              style={{ height: "100%" }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Pie graph for payment performance*/}
      <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
        <Paper elevation={2} className="p-4 bg-gray-50 rounded-xl w-full">
          <Typography variant="subtitle2" gutterBottom>
            Payment Performance
          </Typography>
          <Box sx={{ width: "100%", height: 250 }}>
            <ReactECharts
              option={paymentPerformancePieOptions}
              style={{ height: "100%" }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AccountMetrics;
