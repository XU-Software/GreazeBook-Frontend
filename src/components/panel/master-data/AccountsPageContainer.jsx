"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAccountsQuery,
  useDeleteAccountsMutation,
  useImportAccountsExcelMutation,
} from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import Table from "@/components/Utils/DataTable";
import SearchBar from "@/components/Utils/SearchBar";
import SortToggle from "@/components/Utils/SortToggle";
import ImportExcel from "@/components/Utils/ImportExcel";
import ExportExcel from "@/components/Utils/ExportExcel";
import DeleteSelectedButton from "@/components/Utils/DeleteSelectedButton";
import PaginationControls from "@/components/Utils/TablePagination";

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
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 150,
  },
];

// Example data for preview of importing excel file inputs guide
const exampleRow = {
  customerNumber: "CN-12345",
  accountName: "John Doe",
  tradeType: "Trade type",
  location: "Philippines",
  dsp: "DSP 1",
  balance: "10.00 or 10",
  contactInformation: "Email or Phone number",
};

const exampleColumns = [
  {
    field: "customerNumber",
    headerName: "Customer Number",
    type: "Text or Number",
  },
  { field: "accountName", headerName: "Account Name", type: "Text" },
  {
    field: "tradeType",
    headerName: "Trade Type",
    type: "Text",
  },
  {
    field: "location",
    headerName: "Location",
    type: "Text",
  },
  {
    field: "dsp",
    headerName: "DSP",
    type: "Text",
  },
  {
    field: "balance",
    headerName: "Balance",
    type: "Number only",
  },
  {
    field: "contactInformation",
    headerName: "Contact Information",
    type: "Text or Number",
  },
];

const AccountsPageContainer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(new Set());

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
          message: res.message || "Accounts deleted",
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
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(acc.createdAt));

      rows.push({
        id: acc.accountId,
        customerNumber: acc.customerNumber,
        accountName: acc.accountName,
        tradeType: acc.tradeType,
        location: acc.location,
        dsp: acc.dsp,
        balance: `₱${Number(acc.balance).toFixed(2)}`,
        contactInformation: acc.contactInformation,
        createdAt: formattedDate,
      });

      exportData.push({
        "Customer Number": acc.customerNumber,
        "Account Name": acc.accountName,
        "Trade Type": acc.tradeType,
        Location: acc.location,
        DSP: acc.dsp,
        "Balance (₱)": `₱${Number(acc.balance).toFixed(2)}`,
        "Contact Info": acc.contactInformation,
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

  if (isError) {
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
      <div className="sticky top-18 z-10 bg-white py-2 px-4 shadow-sm">
        <DynamicBreadcrumbs />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 ">
          <div className="w-full lg:w-auto flex justify-between items-center gap-4">
            <SearchBar setSearch={setSearch} setPage={setPage} />
            <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ImportExcel
              handleImportExcel={handleImportAccountsExcel}
              isImporting={isImporting}
              exampleRow={exampleRow}
              exampleColumns={exampleColumns}
            />
            <ExportExcel
              exportData={exportData}
              fileName="accounts"
              sheetName="Accounts"
            />
            <DeleteSelectedButton
              selected={selected}
              setSelected={setSelected}
              handleDeleteSelected={handleDeleteSelectedAccounts}
              isDeleting={isDeletingAccounts}
            />
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={() => router.push("/company/people")}
        enableSelection={true}
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

export default AccountsPageContainer;
