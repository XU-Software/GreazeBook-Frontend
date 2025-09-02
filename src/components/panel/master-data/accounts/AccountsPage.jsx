"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAccountsQuery,
  useDeleteAccountsMutation,
  useAddSingleAccountMutation,
  useImportAccountsExcelMutation,
} from "@/state/services/accountsApi";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import AddRowButton from "@/components/Utils/AddRowButton";
import ImportExcel from "@/components/Utils/ImportExcel";
import ExportExcel from "@/components/Utils/ExportExcel";
import DeleteSelectedButton from "@/components/Utils/DeleteSelectedButton";
import PaginationControls from "@/components/Utils/TablePagination";
import { formatDate } from "@/utils/dateFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import { usePathname } from "next/navigation";
import { Add } from "@mui/icons-material";
import { Typography } from "@mui/material";

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
    field: "contactInformation",
    headerName: "Contact Information",
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 150,
  },
];

// Example data for preview of importing excel file inputs guide
const rowGuide = {
  customerNumber: "CN-12345",
  accountName: "John Doe",
  tradeType: "Trade type",
  location: "Philippines",
  dsp: "DSP 1",
  contactInformation: "Email or Phone number",
};

const columnsGuide = [
  {
    field: "customerNumber",
    headerName: "Customer Number",
    type: "text",
  },
  { field: "accountName", headerName: "Account Name", type: "text" },
  {
    field: "tradeType",
    headerName: "Trade Type",
    type: "text",
  },
  {
    field: "location",
    headerName: "Location",
    type: "text",
  },
  {
    field: "dsp",
    headerName: "DSP",
    type: "text",
  },
  {
    field: "contactInformation",
    headerName: "Contact Information",
    type: "text",
  },
];

const AccountsPage = () => {
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(new Set());

  const userData = useAppSelector((state) => state.global.userData);
  const role = userData?.data?.role || "user";

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      sortOrder,
      search,
    }),
    [page, limit, sortOrder, search]
  );

  const {
    data: accountsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccountsQuery(queryArgs, {
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

  const [deleteAccounts, { isLoading: isDeletingAccounts }] =
    useDeleteAccountsMutation();

  const handleDeleteSelectedAccounts = async (accounts) => {
    try {
      const res = await deleteAccounts(accounts).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message:
            "Batch deletion complete\n" +
              res.failed
                .map((acc) => `${acc.accountName} - ${acc.message}`)
                .join("\n") ||
            res.message ||
            "Accounts deleted",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to delete accounts",
        })
      );
    }
  };

  const [addSingleAccount, { isLoading: isAdding }] =
    useAddSingleAccountMutation();

  const handleAddSingleAccount = async (account) => {
    try {
      const res = await addSingleAccount(account).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Account added",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to add account",
        })
      );
    }
  };

  const [importAccountsExcel, { isLoading: isImporting }] =
    useImportAccountsExcelMutation();

  const handleImportAccountsExcel = async (file) => {
    try {
      const res = await importAccountsExcel(file).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Accounts imported",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to import accounts",
        })
      );
    }
  };

  const { rows, exportData } = useMemo(() => {
    const rows = [];
    const exportData = [];

    if (!accountsData) return { rows, exportData };

    accountsData?.data.forEach((acc) => {
      const formattedDate = formatDate(acc.createdAt);

      rows.push({
        id: acc.accountId,
        customerNumber: acc.customerNumber,
        accountName: acc.accountName,
        tradeType: acc.tradeType,
        location: acc.location,
        dsp: acc.dsp,
        contactInformation: acc.contactInformation,
        createdAt: formattedDate,
      });

      exportData.push({
        "Customer Number": acc.customerNumber,
        "Account Name": acc.accountName,
        "Trade Type": acc.tradeType,
        Location: acc.location,
        DSP: acc.dsp,
        "Contact Information": acc.contactInformation,
        "Created At": formattedDate,
      });
    });

    return { rows, exportData };
  }, [accountsData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !accountsData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load accounts"
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="min-h-full">
      <DynamicBreadcrumbs />
      <div className="sticky top-18 z-10 bg-white py-2 px-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 ">
          <div className="w-full lg:w-auto flex justify-between items-center gap-4">
            <SearchBar setSearch={setSearch} setPage={setPage} />
            <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
          <Typography>
            Number of Accounts: {formatNumber(accountsData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <AddRowButton
              columns={columnsGuide}
              initialValues={{
                customerNumber: "",
                accountName: "",
                tradeType: "",
                location: "",
                dsp: "",
                contactInformation: "",
              }}
              isLoading={isAdding}
              onSubmit={handleAddSingleAccount}
              title="Add New Account"
              buttonLabel="Account"
              startIcon={<Add />}
            />
            <ImportExcel
              handleImportExcel={handleImportAccountsExcel}
              isImporting={isImporting}
              rowGuide={rowGuide}
              columnsGuide={columnsGuide}
            />
            <ExportExcel
              exportData={exportData}
              fileName="accounts"
              sheetName="Accounts"
            />
            {(role === "admin" || role === "superadmin") && (
              <DeleteSelectedButton
                selected={selected}
                setSelected={setSelected}
                handleDeleteSelected={handleDeleteSelectedAccounts}
                isDeleting={isDeletingAccounts}
              />
            )}
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={(accountId) => router.push(`${pathName}/${accountId}`)}
        enableSelection={role === "admin" || role === "superadmin"}
        selected={selected}
        setSelected={setSelected}
      />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={accountsData?.page}
        limit={accountsData?.limit}
        total={accountsData?.total}
      />
    </div>
  );
};

export default AccountsPage;
