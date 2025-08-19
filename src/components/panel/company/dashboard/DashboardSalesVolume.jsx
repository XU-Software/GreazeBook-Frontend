"use client";

import React, { useState, useMemo } from "react";
import { useCompanySalesVolumeQuery } from "@/state/services/companyApi";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import ExportExcel from "@/components/Utils/ExportExcel";
import PaginationControls from "@/components/Utils/TablePagination";
import ColoredLink from "@/components/Utils/ColoredLink";
import YearPicker from "./YearDatePicker";
import { formatNumber } from "@/utils/quantityFormatter";
import { Typography } from "@mui/material";

const columns = [
  {
    field: "accountName",
    headerName: "Account Name",
    render: (value, row) => (
      <ColoredLink
        href={`/master-data/accounts/${row.accountId}`}
        linkText={value}
      />
    ),
    minWidth: 150,
  },
  {
    field: "dsp",
    headerName: "DSP Name",
    minWidth: 150,
  },
  {
    field: "january",
    headerName: "January",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "february",
    headerName: "February",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "march",
    headerName: "March",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "april",
    headerName: "April",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "may",
    headerName: "May",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "june",
    headerName: "June",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "july",
    headerName: "July",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "august",
    headerName: "August",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "september",
    headerName: "September",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "october",
    headerName: "October",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "november",
    headerName: "November",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "december",
    headerName: "December",
    render: (value) => value > 0 && formatNumber(value),
    minWidth: 150,
  },
  {
    field: "totalVolume",
    headerName: "Total Volume",
    render: (value) => formatNumber(value),
    minWidth: 150,
  },
];

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const DashboardSalesVolume = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const queryArgs = useMemo(
    () => ({
      year,
      page,
      limit,
      sortOrder,
      search,
    }),
    [year, page, limit, sortOrder, search]
  );

  const {
    data: salesVolumeData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCompanySalesVolumeQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Handler for only page change
  const handlePageChange = async (event, newPage) => {
    setPage(newPage + 1);
  };

  // Handler for only limit change
  const handleLimitChange = async (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setPage(1);
    setLimit(newLimit);
  };

  // Handler for selecting year
  const handleYearChange = (year) => setYear(year);

  const { rows, exportData } = useMemo(() => {
    const rows = [];
    const exportData = [];

    if (!salesVolumeData) return { rows, exportData };

    salesVolumeData?.data.forEach((acc) => {
      const monthData = {};

      monthNames.forEach((month, idx) => {
        monthData[month] = acc.monthlyVolumes[idx];
      });

      rows.push({
        id: acc.accountId,
        accountId: acc.accountId,
        accountName: acc.accountName,
        dsp: acc.dsp,
        ...monthData,
        totalVolume: acc.rowTotal,
      });

      exportData.push({
        "Account Name": acc.accountName,
        DSP: acc.dsp,
        ...monthNames.reduce((obj, month, idx) => {
          obj[month[0].toUpperCase() + month.slice(1)] = formatNumber(
            acc.monthlyVolumes[idx]
          );
          return obj;
        }, {}),
        "Total Volume": formatNumber(acc.rowTotal),
      });
    });

    return { rows, exportData };
  }, [salesVolumeData]);

  if (isLoading || isFetching) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !salesVolumeData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message ||
          error?.error ||
          "Failed to load sales volume data"
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-18 z-10 bg-white py-2 px-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 ">
          <div className="w-full lg:w-auto flex justify-between items-center gap-4">
            <SearchBar setSearch={setSearch} setPage={setPage} />
            <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
          <Typography>
            Number of Accounts: {formatNumber(salesVolumeData?.total)}
          </Typography>

          <Typography>
            Grand Total Volume: {formatNumber(salesVolumeData?.grandTotal)}
          </Typography>

          <YearPicker selectedYear={year} onChange={handleYearChange} />

          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="monthly-sales-volume-by-accounts"
              sheetName="Monthly Sales Volume by Accounts"
            />
          </div>
        </div>
      </div>
      <Table rows={rows} columns={columns} enableSelection={false} />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={salesVolumeData?.page}
        limit={salesVolumeData?.limit}
        total={salesVolumeData?.total}
      />
    </div>
  );
};

export default DashboardSalesVolume;
