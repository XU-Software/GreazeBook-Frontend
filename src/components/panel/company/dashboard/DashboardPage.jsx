"use client";

import React, { useState } from "react";
import { useLazyCompanyDashboardQuery } from "@/state/services/companyApi";
import { setDashboardData, clearDashboardData } from "@/state/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Check, Close, Edit } from "@mui/icons-material";
import DashboardTable from "./DashboardTable";
import DashboardBarChart from "./DashboardBarChart";
import DateRangePicker from "@/components/Utils/DateRangePicker";
import EditableField from "@/components/Utils/EditableField";
import dayjs from "dayjs";
import { formatDate } from "@/utils/dateFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatToPercentage } from "@/utils/percentageFormatter";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const dashboardState = useAppSelector((state) => state.dashboard); // from persisted global store state of dashboard

  // for opening and editing oplans for each grouped DSP
  const [editOplan, setEditOplan] = useState(false);
  const [oplan, setOplan] = useState([]); // initially 0, when edited becomes object

  // Query for fetching dashboard data
  const [companyDashboard, { isLoading }] = useLazyCompanyDashboardQuery();

  const handleFilter = async (startDate, endDate, oplan) => {
    try {
      //convert to oplan keys to number first
      const normalizedOplan = oplan?.map((item) => ({
        dsp: item.dsp,
        oplan: Number(item.oplan), // ensure it's a number
      }));

      const res = await companyDashboard({
        startDate,
        endDate,
        normalizedOplan,
      }).unwrap();
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
    setEditOplan(false);
    setOplan([]);
    dispatch(clearDashboardData());
  };

  // handler for changing oplan for a specfic DSP, can be multiple at once
  const handleOplanChange = (dsp, value) => {
    setOplan((prev) => {
      const existing = prev.find((item) => item.dsp === dsp);
      if (existing) {
        return prev.map((item) =>
          item.dsp === dsp ? { ...item, oplan: value } : item
        );
      } else {
        return [...prev, { dsp, oplan: value }];
      }
    });
  };

  // conditional for fetching dashboard data, only when changing oplans
  const dateRange = dashboardState.lastParams
    ? [
        dayjs(dashboardState.lastParams.startDate).startOf("day").toISOString(),
        dayjs(dashboardState.lastParams.endDate).endOf("day").toISOString(),
      ]
    : ["", ""];

  return (
    <Box sx={{ p: 2, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Overview
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

      <Grid container spacing={2} mb={4} justifyContent="center">
        <Grid
          item
          size={{ xs: 12, sm: 4 }}
          component={Paper}
          elevation={2}
          padding={2}
          textAlign="center"
        >
          <Typography variant="h6">Total Sales</Typography>
          <Typography variant="h5" padding={2}>
            {dashboardState.data
              ? formatToLocalCurrency(
                  dashboardState.data?.marginComputation?.totalSales || 0
                )
              : "Filter date first."}
          </Typography>
        </Grid>

        <Grid
          item
          size={{ xs: 12, sm: 4 }}
          component={Paper}
          elevation={2}
          padding={2}
          textAlign="center"
        >
          <Typography variant="h6">Cost Of Goods Sold</Typography>
          <Typography variant="h5" padding={2}>
            {dashboardState.data
              ? formatToLocalCurrency(
                  dashboardState.data?.marginComputation
                    ?.totalAcquisitionCost || 0
                )
              : "Filter date first."}
          </Typography>
        </Grid>

        <Grid
          item
          size={{ xs: 12, sm: 4 }}
          component={Paper}
          elevation={2}
          padding={2}
          textAlign="center"
        >
          <Typography variant="h6">Margin</Typography>
          <Typography variant="h5" padding={2}>
            {dashboardState.data
              ? formatToLocalCurrency(
                  dashboardState.data?.marginComputation?.totalMargin || 0
                )
              : "Filter date first."}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={4}>
        {/* SALES */}
        <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
          <DashboardTable
            title="Sales Volume"
            columns={[
              { field: "dsp", headerName: "DSP NAME" },
              { field: "salesToTrade", headerName: "SALES-TO-TRADE (VOLUME)" },
              {
                field: "oplan",
                headerName: (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography>OPLAN</Typography>{" "}
                    {editOplan ? (
                      <Stack direction="row" spacing={2}>
                        <Tooltip title="Save Changes">
                          <IconButton
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                              if (oplan.length === 0) return;
                              await handleFilter(...dateRange, oplan);
                              // setOplan([]);
                              setEditOplan(false);
                              {
                              }
                            }}
                            // loading={isUpdating}
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
                              // setOplan([]);
                              setEditOplan(false);
                            }}
                            // loading={isUpdating}
                          >
                            <Close fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() => setEditOplan(true)}
                      >
                        <Edit fontSize="medium" />
                      </IconButton>
                    )}
                  </Box>
                ),
                render: (value, row) => {
                  const dsp = row.dsp;

                  const currentOplan =
                    oplan.find((item) => item.dsp === dsp)?.oplan ??
                    dashboardState.data?.sales?.rows?.find(
                      (item) => item.dsp === dsp
                    )?.oplan ??
                    0;

                  return (
                    <EditableField
                      editing={editOplan}
                      type="number"
                      value={currentOplan}
                      name={dsp}
                      isQuantity={true}
                      onChange={(e) =>
                        handleOplanChange(e.target.name, e.target.value)
                      }
                    />
                  );
                },
              },
              { field: "attainment", headerName: "ATTAINMENT" },
              { field: "pesoValue", headerName: "PESO VALUE" },
            ]}
            data={dashboardState.data?.sales?.rows || []}
            summary={dashboardState.data?.sales?.summary}
            formatters={{
              salesToTrade: (v) => formatNumber(v),
              attainment: (v) => formatToPercentage(v),
              pesoValue: (v) => formatToLocalCurrency(v),
              oplan: (v) => formatNumber(v),
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
              activeAccounts: (v) => formatNumber(v),
              totalAccounts: (v) => formatNumber(v),
              attainment: (v) => formatToPercentage(v),
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
              totalOverdue: (v) => formatToLocalCurrency(v),
              totalAR: (v) => formatToLocalCurrency(v),
              overdueToTARRatio: (v) => formatToPercentage(v),
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
            formatters={{
              activeAccounts: (v) => formatNumber(v),
              totalVolume: (v) => formatNumber(v),
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
