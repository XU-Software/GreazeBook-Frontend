"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAccountsQuery } from "@/state/api";
import { useDebounce } from "@/hooks/useDebounce";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";

const columns = [
  {
    field: "customerNumber",
    headerName: "Customer Number",
    minWidth: 150,
  },
  { field: "accountName", headerName: "Account Name", minWidth: 150 },
  {
    field: "tradeType",
    headerName: "Trade Type",
    minWidth: 150,
  },
  {
    field: "location",
    headerName: "Location",
    minWidth: 150,
  },
  {
    field: "dsp",
    headerName: "DSP",
    minWidth: 150,
  },
  {
    field: "balance",
    headerName: "Balance",
    minWidth: 150,
  },
  {
    field: "contactInformation",
    headerName: "Contact Information",
    minWidth: 150,
  },
];

const paginationModel = { page: 0, pageSize: 50 };

const AccountsPageContainer = () => {
  //   const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      sortOrder,
      search: debouncedSearch,
    }),
    [page, limit, sortOrder, debouncedSearch]
  );

  const {
    data: accountsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccountsQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isError) {
    return (
      <ErrorMessage
        message={error?.error || "Failed to load users"}
        onRetry={refetch}
      />
    );
  }

  const rows = accountsData?.data.map(
    (
      {
        accountId,
        customerNumber,
        accountName,
        tradeType,
        location,
        dsp,
        balance,
        contactInformation,
      },
      index
    ) => ({
      id: accountId,
      customerNumber,
      accountName,
      tradeType,
      location,
      dsp,
      balance,
      contactInformation,
    })
  );

  return (
    <div className="h-full">
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 50]}
          checkboxSelection
          disableColumnResize={true}
          loading={isLoading}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              wordBreak: "break-word",
              textOverflow: "clip",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
          }}
        />
      </Paper>
    </div>
  );
};

export default AccountsPageContainer;
