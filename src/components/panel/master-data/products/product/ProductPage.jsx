"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  useGetProductInformationQuery,
  useGetStockHistoryQuery,
} from "@/state/services/productsApi";
import { Box, Typography } from "@mui/material";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import ProductInformation from "./ProductInformation";
import Table from "@/components/Utils/DataTable";
import PaginationControls from "@/components/Utils/TablePagination";
import { formatDate, formatDateWithTime } from "@/utils/dateFormatter";

const columns = [
  {
    field: "changeType",
    headerName: "Change Type",
    minWidth: 150,
  },
  { field: "quantity", headerName: "Quantity", minWidth: 150 },
  {
    field: "reason",
    headerName: "Reason",
    minWidth: 150,
  },
  {
    field: "createdAt",
    headerName: "Operated At",
    minWidth: 150,
  },
  {
    field: "operatedBy",
    headerName: "Operated By",
    minWidth: 150,
  },
];

const ProductDetailsPage = () => {
  const params = useParams();
  const { productId } = params;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  //Query for fetching basic product information
  const {
    data: productInfoData,
    isLoading: isLoadingProdInfo,
    isError: isErrorProdInfo,
    error: prodInfoError,
    refetch: refetchProdInfo,
  } = useGetProductInformationQuery(productId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      productId,
    }),
    [page, limit, productId]
  );

  const {
    data: stockHistoryData,
    isLoading: isLoadingStockHistory,
    isError: isErrorStockHistory,
    error: stockHistoryError,
    refetch: refetchStockHistory,
  } = useGetStockHistoryQuery(queryArgs, {
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

  const { rows, exportData } = useMemo(() => {
    const rows = [];
    const exportData = [];

    if (!stockHistoryData) return { rows, exportData };

    stockHistoryData?.data.forEach((sh) => {
      rows.push({
        id: sh.stockHistoryId,
        changeType: sh.changeType,
        quantity: sh.quantity,
        reason: sh.reason,
        createdAt: formatDateWithTime(sh.createdAt),
        operatedBy: `${sh.createdBy.name} | ${sh.createdBy.email}`,
      });

      exportData.push({
        "Change Type": sh.changeType,
        Quantity: sh.quantity,
        Reason: sh.reason,
        "Operated At": formatDateWithTime(sh.createdAt),
        "Operated By": `${sh.createdBy.name} | ${sh.createdBy.email}`,
      });
    });

    return { rows, exportData };
  }, [stockHistoryData]);

  if (isLoadingProdInfo || isLoadingStockHistory) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (
    isErrorProdInfo ||
    !productInfoData ||
    isErrorStockHistory ||
    !stockHistoryData
  ) {
    return (
      <ErrorMessage
        message={
          prodInfoError?.data?.message ||
          prodInfoError?.error ||
          "Failed to load product information" ||
          stockHistoryError?.data?.message ||
          stockHistoryError?.error ||
          "Failed to load stock history"
        }
        onRetry={prodInfoError ? refetchProdInfo : refetchStockHistory}
      />
    );
  }

  return (
    <>
      <DynamicBreadcrumbs />
      <Box sx={{ p: 2, mx: "auto" }}>
        {/*Product information*/}
        <ProductInformation
          productInfoData={productInfoData}
          productId={productId}
        />

        {/* Stock history*/}
        <Typography variant="h6" gutterBottom>
          Stock History
        </Typography>

        <Table rows={rows} columns={columns} enableSelection={false} />
        <PaginationControls
          handlePageChange={handlePageChange}
          handleLimitChange={handleLimitChange}
          page={stockHistoryData?.page}
          limit={stockHistoryData?.limit}
          total={stockHistoryData?.total}
        />
      </Box>
    </>
  );
};

export default ProductDetailsPage;
