"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAllCompaniesDataQuery } from "@/state/services/superAdminApi";
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
import { formatDateWithTime } from "@/utils/dateFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import { usePathname } from "next/navigation";
import { Add } from "@mui/icons-material";
import { Typography, Chip, Button } from "@mui/material";

const columns = [
  {
    field: "companyId",
    headerName: "ID",
    minWidth: 150,
  },
  { field: "name", headerName: "Name", minWidth: 150 },
  {
    field: "createdAt",
    headerName: "Created At",
    render: (value) => formatDateWithTime(value),
    minWidth: 150,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    render: (value) => formatDateWithTime(value),
    minWidth: 150,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    minWidth: 150,
  },
  {
    field: "currentSubscription",
    headerName: "Subscription Status",
    render: (value) =>
      value ? (
        value === "Active" ? (
          <Chip label="Active" color="success" size="small" />
        ) : value === "ExpiringSoon" ? (
          <Chip label="Expiring Soon" color="warning" size="small" />
        ) : (
          <Chip label="Expired" color="error" size="small" />
        )
      ) : (
        <Chip label="Pending" color="warning" size="small" />
      ),
    minWidth: 150,
  },
];

const CompaniesPage = () => {
  const pathName = usePathname();
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
    data: companiesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllCompaniesDataQuery(queryArgs, {
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

  //   const [deleteAccounts, { isLoading: isDeletingAccounts }] =
  //     useDeleteAccountsMutation();

  //   const handleDeleteSelectedAccounts = async (accounts) => {
  //     try {
  //       const res = await deleteAccounts(accounts).unwrap();
  //       dispatch(
  //         setShowSnackbar({
  //           severity: "success",
  //           message:
  //             "Batch deletion complete\n" +
  //               res.failed
  //                 .map((acc) => `${acc.accountName} - ${acc.message}`)
  //                 .join("\n") ||
  //             res.message ||
  //             "Accounts deleted",
  //         })
  //       );
  //     } catch (error) {
  //       dispatch(
  //         setShowSnackbar({
  //           severity: "error",
  //           message:
  //             error.data?.message || error.message || "Failed to delete accounts",
  //         })
  //       );
  //     }
  //   };

  //   const [addSingleAccount, { isLoading: isAdding }] =
  //     useAddSingleAccountMutation();

  //   const handleAddSingleAccount = async (account) => {
  //     try {
  //       const res = await addSingleAccount(account).unwrap();
  //       dispatch(
  //         setShowSnackbar({
  //           severity: "success",
  //           message: res.message || "Account added",
  //         })
  //       );
  //     } catch (error) {
  //       dispatch(
  //         setShowSnackbar({
  //           severity: "error",
  //           message:
  //             error.data?.message || error.message || "Failed to add account",
  //         })
  //       );
  //     }
  //   };

  //   const [importAccountsExcel, { isLoading: isImporting }] =
  //     useImportAccountsExcelMutation();

  //   const handleImportAccountsExcel = async (file) => {
  //     try {
  //       const res = await importAccountsExcel(file).unwrap();
  //       dispatch(
  //         setShowSnackbar({
  //           severity: "success",
  //           message: res.message || "Accounts imported",
  //         })
  //       );
  //     } catch (error) {
  //       dispatch(
  //         setShowSnackbar({
  //           severity: "error",
  //           message:
  //             error.data?.message || error.message || "Failed to import accounts",
  //         })
  //       );
  //     }
  //   };

  const { rows, exportData } = useMemo(() => {
    const rows = [];
    const exportData = [];

    if (!companiesData) return { rows, exportData };

    companiesData?.data.forEach((company) => {
      rows.push({
        id: company.companyId,
        companyId: company.companyId,
        name: company.name,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        createdBy: company.createdBy.email,
        currentSubscription: company.currentSubscription?.status ?? null,
      });

      exportData.push({
        ID: company.companyId,
        Name: company.name,
        "Created At": formatDateWithTime(company.createdAt),
        "Updated At": formatDateWithTime(company.updatedAt),
        "Created By": company.createdBy.email,
        "Subscription Status": company.currentSubscription?.status ?? "Pending",
      });
    });

    return { rows, exportData };
  }, [companiesData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !companiesData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load companies"
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
            Number of Accounts: {formatNumber(companiesData?.total)}
          </Typography>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ExportExcel
              exportData={exportData}
              fileName="companies"
              sheetName="Companies"
            />
            {/* 
              <DeleteSelectedButton
                selected={selected}
                setSelected={setSelected}
                handleDeleteSelected={handleDeleteSelectedAccounts}
                isDeleting={isDeletingAccounts}
              /> */}
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={(companyId) => router.push(`${pathName}/${companyId}`)}
        enableSelection={true}
        selected={selected}
        setSelected={setSelected}
      />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={companiesData?.page}
        limit={companiesData?.limit}
        total={companiesData?.total}
      />
    </div>
  );
};

export default CompaniesPage;
