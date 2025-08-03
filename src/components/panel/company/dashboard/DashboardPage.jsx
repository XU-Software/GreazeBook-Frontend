"use client";

import React from "react";
import { useLazyCompanyDashboardQuery } from "@/state/services/companyApi";
import { setDashboardData, clearDashboardData } from "@/state/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardTable from "./DashboardTable";
import DashboardBarChart from "./DashboardBarChart";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import DateRangePicker from "@/components/Utils/DateRangePicker";
import { formatDate } from "@/utils/dateFormatter";

const mockDashboardData = {
  sales: [
    {
      dsp: "Lauren Ellis",
      salesToTrade: 156,
      oplan: 10000,
      attainment: 1.56,
      pesoValue: 21870,
    },
    // ...
  ],
  penetration: [
    {
      dsp: "Lauren Ellis",
      activeAccounts: 1,
      totalAccounts: 1,
      attainment: 100,
    },
    // ...
  ],
  collection: [
    {
      dsp: "Lauren Ellis",
      totalAR: 21870,
      totalOverdue: 5800,
      overdueToTARRatio: 26.52,
    },
    // ...
  ],
  penetrationByTradeType: [
    {
      tradeType: "Retail",
      totalVolume: 156,
      totalAccounts: 1,
      activeAccounts: 1,
    },
    // ...
  ],
};

const DashboardPage = () => {
  const sales = mockDashboardData.sales;
  const penetration = mockDashboardData.penetration;
  const collection = mockDashboardData.collection;
  const penetrationByTradeType = mockDashboardData.penetrationByTradeType;

  const dispatch = useAppDispatch();
  const dashboardState = useAppSelector((state) => state.dashboard);

  const [companyDashboard, { isLoading }] = useLazyCompanyDashboardQuery();

  const handleFilter = async (startDate, endDate) => {
    try {
      const res = await companyDashboard({ startDate, endDate }).unwrap();
      dispatch(setDashboardData({ data: res, params: { startDate, endDate } }));
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to fetch dashboard data",
        })
      );
    }
  };

  const handleClear = () => {
    dispatch(clearDashboardData());
  };

  return (
    <Box sx={{ p: 2, mx: "auto" }}>
      <DynamicBreadcrumbs />

      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        <Stack>
          <Typography gutterBottom>
            From Date:{" "}
            <strong>
              {dashboardState.lastParams
                ? formatDate(dashboardState.lastParams.startDate)
                : "-"}
            </strong>
          </Typography>
          <Typography gutterBottom>
            To Date:{" "}
            <strong>
              {dashboardState.lastParams
                ? formatDate(dashboardState.lastParams.endDate)
                : "-"}
            </strong>
          </Typography>
        </Stack>
        <DateRangePicker
          onFilter={handleFilter}
          onClear={handleClear}
          filterButtonText="Filter By Invoice Date"
          clearButtonText="Clear"
        />
      </Box>

      <Grid container spacing={2} mb={4}>
        {/* SALES */}
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <DashboardTable
            title="Sales"
            columns={[
              { field: "dsp", headerName: "DSP NAME" },
              { field: "salesToTrade", headerName: "SALES-TO-TRADE" },
              { field: "oplan", headerName: "OPLAN" },
              { field: "attainment", headerName: "ATTAINMENT" },
              { field: "pesoValue", headerName: "PESO VALUE" },
            ]}
            data={dashboardState.data?.sales?.rows || []}
            summary={dashboardState.data?.sales?.summary}
            formatters={{
              pesoValue: (v) => `₱${v.toLocaleString()}`,
              attainment: (v) => `${v.toFixed(2)}%`,
            }}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <Paper
            elevation={2}
            className="p-4 bg-gray-50 rounded-xl w-full h-full"
          >
            {" "}
            <DashboardBarChart
              title="Sales: Sales-To-Trade vs Oplan"
              categories={
                dashboardState.data?.sales?.rows?.map((row) => row.dsp) || []
              }
              series={[
                {
                  name: "Sales to Trade",
                  type: "bar",
                  data:
                    dashboardState.data?.sales?.rows?.map(
                      (row) => row.salesToTrade
                    ) || [],
                },
                {
                  name: "Oplan",
                  type: "bar",
                  data:
                    dashboardState.data?.sales?.rows?.map((row) => row.oplan) ||
                    [],
                },
              ]}
            />
          </Paper>
        </Grid>

        {/* PENETRATION */}
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <DashboardTable
            title="Penetration"
            columns={[
              { field: "dsp", headerName: "DSP NAME" },
              { field: "activeAccounts", headerName: "PENETRATED ACCOUNTS" },
              { field: "totalAccounts", headerName: "UNIVERSE" },
              { field: "attainment", headerName: "ATTAINMENT" },
            ]}
            data={dashboardState.data?.penetration?.rows || []}
            summary={dashboardState.data?.penetration?.summary}
            formatters={{
              attainment: (v) => `${v.toFixed(2)}%`,
            }}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <Paper
            elevation={2}
            className="p-4 bg-gray-50 rounded-xl w-full h-full"
          >
            {" "}
            <DashboardBarChart
              title="Penetration: Penetrated Accounts vs Universe"
              categories={
                dashboardState.data?.penetration?.rows?.map((row) => row.dsp) ||
                []
              }
              series={[
                {
                  name: "Penetrated Accounts",
                  type: "bar",
                  data:
                    dashboardState.data?.penetration?.rows?.map(
                      (row) => row.activeAccounts
                    ) || [],
                },
                {
                  name: "Universe",
                  type: "bar",
                  data:
                    dashboardState.data?.penetration?.rows?.map(
                      (row) => row.totalAccounts
                    ) || [],
                },
              ]}
            />
          </Paper>
        </Grid>

        {/* COLLECTION */}
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <DashboardTable
            title="Collection"
            columns={[
              { field: "dsp", headerName: "DSP NAME" },
              { field: "totalOverdue", headerName: "OVERDUE AMOUNT" },
              { field: "totalAR", headerName: "TOTAL ACCOUNTS RECEIVABLES" },
              { field: "overdueToTARRatio", headerName: "OD TO TAR RATIO" },
            ]}
            data={dashboardState.data?.collection?.rows || []}
            summary={dashboardState.data?.collection?.summary}
            formatters={{
              totalAR: (v) => `₱${v.toLocaleString()}`,
              totalOverdue: (v) => `₱${v.toLocaleString()}`,
              overdueToTARRatio: (v) => `${v.toFixed(2)}%`,
            }}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <Paper
            elevation={2}
            className="p-4 bg-gray-50 rounded-xl w-full h-full"
          >
            {" "}
            <DashboardBarChart
              title="Collection: Overdue Amount vs Total Accounts Receivables"
              categories={
                dashboardState.data?.collection?.rows?.map((row) => row.dsp) ||
                []
              }
              series={[
                {
                  name: "Overdue Amount",
                  type: "bar",
                  data:
                    dashboardState.data?.collection?.rows?.map(
                      (row) => row.totalOverdue
                    ) || [],
                },
                {
                  name: "Total Accounts Receivables",
                  type: "bar",
                  data:
                    dashboardState.data?.collection?.rows?.map(
                      (row) => row.totalAR
                    ) || [],
                },
              ]}
            />
          </Paper>
        </Grid>

        {/* PENETRATION BY TRADE TYPE */}
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <DashboardTable
            title="Penetration (Trade Type)"
            columns={[
              { field: "tradeType", headerName: "TRADE TYPE" },
              { field: "activeAccounts", headerName: "PENETRATION" },
              { field: "totalVolume", headerName: "VOLUME" },
            ]}
            data={dashboardState.data?.penetrationByTradeType?.rows || []}
            summary={dashboardState.data?.penetrationByTradeType?.summary}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <Paper
            elevation={2}
            className="p-4 bg-gray-50 rounded-xl w-full h-full"
          >
            {" "}
            <DashboardBarChart
              title="Penetration (Trade Type): Penetration vs Volume"
              categories={
                dashboardState.data?.penetrationByTradeType?.rows?.map(
                  (row) => row.tradeType
                ) || []
              }
              series={[
                {
                  name: "Penetration",
                  type: "bar",
                  data:
                    dashboardState.data?.penetrationByTradeType?.rows?.map(
                      (row) => row.activeAccounts
                    ) || [],
                },
                {
                  name: "Volume",
                  type: "bar",
                  data:
                    dashboardState.data?.penetrationByTradeType?.rows?.map(
                      (row) => row.totalVolume
                    ) || [],
                },
              ]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
