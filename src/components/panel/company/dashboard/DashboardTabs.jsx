"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import DashboardPage from "./DashboardPage";
import DashboardSalesVolume from "./DashboardSalesVolume";

// Components for each tab
function OverviewTab() {
  return <DashboardPage />;
}

function SalesVolumeTab() {
  return <DashboardSalesVolume />;
}

export default function DashboardTabs() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs Header */}
      <Box sx={{ bgcolor: "white", borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="dashboard tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="OVERVIEW" />
          <Tab label="MONTHLY SALES VOLUME" />
          {/* <Tab label="Sales Volume" /> */}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box>
        {tabIndex === 0 && <OverviewTab />}
        {tabIndex === 1 && <SalesVolumeTab />}
        {/* {tabIndex === 2 && <SalesVolumeTab />} */}
      </Box>
    </Box>
  );
}
