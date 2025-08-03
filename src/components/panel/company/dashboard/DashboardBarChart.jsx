"use client";

// components/DashboardBarChart.js
import React from "react";
import ReactECharts from "echarts-for-react";
import { Box, Typography } from "@mui/material";

const DashboardBarChart = ({ title = "", categories = [], series = [] }) => {
  const option = {
    title: {
      text: title,
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: 30,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
    },
    yAxis: {
      type: "value",
    },
    series: series,
  };

  return (
    <Box sx={{ height: "100%" }}>
      <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
};

export default DashboardBarChart;
