"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAccountsQuery } from "@/state/api";
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

const AccountsPageContainer = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState([]);

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

  const onSelectChange = (items) => setSelected(items);

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
        message={error?.error || "Failed to load users"}
        onRetry={refetch}
      />
    );
  }

  const rows = [];
  const exportData = [];

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

  return (
    <div className="min-h-full">
      <div className="sticky top-18 z-10 bg-white py-2 px-4 shadow-sm">
        <DynamicBreadcrumbs />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 ">
          <div className="w-full lg:w-auto flex justify-between items-center gap-4">
            <SearchBar search={search} setSearch={setSearch} />
            <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ImportExcel />
            <ExportExcel exportData={exportData} />
            <DeleteSelectedButton selected={selected} />
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={() => router.push("/company/people")}
        enableSelection={true}
        selected={selected}
        onSelectChange={onSelectChange}
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
