"use client";

import React from "react";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { Grid, Paper, Typography, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AccountMetrics = ({ accountMetricsData }) => {
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

  const pieOptions = {
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
          itemStyle: { color: COLORS[index % COLORS.length] },
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
            <ReactECharts option={pieOptions} style={{ height: "100%" }} />
          </Box>
        </Paper>
      </Grid>

      {/* <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
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
