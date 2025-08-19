"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetProductsQuery,
  useDeleteProductsMutation,
  useAddSingleProductMutation,
  useImportProductsExcelMutation,
} from "@/state/services/productsApi";
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
import { Chip, Tooltip, Typography } from "@mui/material";
import { WarningAmber, Error, CheckCircle, Add } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { formatNumber } from "@/utils/quantityFormatter";

const columns = [
  {
    field: "materialCode",
    headerName: "Material Code",
    minWidth: 150,
  },
  { field: "productName", headerName: "Product Name", minWidth: 150 },
  {
    field: "productFamily",
    headerName: "Product Family",
    minWidth: 150,
  },
  {
    field: "uom",
    headerName: "UOM (L)",
    render: (value) => formatNumber(value),
    minWidth: 150,
  },
  {
    field: "totalStocks",
    headerName: "Total Stocks",
    render: (value, row) => {
      if (value < 0) {
        return (
          <Tooltip
            title={
              row.restockThreshold === 0
                ? `Stocks Threshold: (${formatNumber(
                    row.restockThreshold
                  )}), No data yet for average sales volume for the past 2 months`
                : `Stocks Threshold: (${formatNumber(row.restockThreshold)})`
            }
          >
            <Chip
              icon={<Error sx={{ fontSize: 18 }} />}
              label={`Backorder (${formatNumber(value)})`}
              color="error"
              size="small"
            />
          </Tooltip>
        );
      }

      if (row.isLowStock) {
        return (
          <Tooltip
            title={`Stocks Threshold: (${formatNumber(row.restockThreshold)})`}
          >
            <Chip
              icon={<WarningAmber sx={{ fontSize: 18 }} />}
              label={`Low Stock (${formatNumber(value)})`}
              color="warning"
              size="small"
            />
          </Tooltip>
        );
      }

      return (
        <Tooltip
          title={
            row.restockThreshold === 0
              ? `Stocks Threshold: (${formatNumber(
                  row.restockThreshold
                )}), No data yet for average sales volume for the past 2 months`
              : `Stocks Threshold: (${formatNumber(row.restockThreshold)})`
          }
        >
          <Chip
            icon={<CheckCircle sx={{ fontSize: 18 }} />}
            label={`In Stock (${formatNumber(value)})`}
            color="success"
            size="small"
          />
        </Tooltip>
      );
    },
    minWidth: 150,
  },
  {
    field: "totalLiters",
    headerName: "Total Liters",
    render: (value) => formatNumber(value),
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
  materialCode: "MC-12345",
  productName: "Product1",
  productFamily: "Product Family1",
  uom: "123 or 1 or 1.5 (In Liters)",
  totalStocks: "123 or 0",
};

const columnsGuide = [
  {
    field: "materialCode",
    headerName: "Material Code",
    type: "text",
  },
  { field: "productName", headerName: "Product Name", type: "text" },
  {
    field: "productFamily",
    headerName: "Product Family",
    type: "text",
  },
  {
    field: "uom",
    headerName: "UOM",
    type: "number",
    isQuantity: true,
  },
  {
    field: "totalStocks",
    headerName: "Total Stocks",
    type: "number",
    isQuantity: true,
  },
];

const ProductsPage = () => {
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

  const productsToRestockCount = useAppSelector(
    (state) => state.products.productsToRestockCount
  );

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
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery(queryArgs, {
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

  const [deleteProducts, { isLoading: isDeletingProducts }] =
    useDeleteProductsMutation();

  const handleDeleteSelectedProducts = async (products) => {
    try {
      const res = await deleteProducts(products).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message:
            "Batch deletion complete\n" +
              res.failed
                .map((prod) => `${prod.productName} - ${prod.message}`)
                .join("\n") ||
            res.message ||
            "Products deleted",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to delete products",
        })
      );
    }
  };

  const [addSingleProduct, { isLoading: isAdding }] =
    useAddSingleProductMutation();

  const handleAddSingleProduct = async (product) => {
    try {
      const res = await addSingleProduct(product).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Product added",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to add product",
        })
      );
    }
  };

  const [importProductsExcel, { isLoading: isImporting }] =
    useImportProductsExcelMutation();

  const handleImportProductsExcel = async (file) => {
    try {
      const res = await importProductsExcel(file).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Products imported",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to import products",
        })
      );
    }
  };

  const { rows, exportData } = useMemo(() => {
    const rows = [];
    const exportData = [];

    if (!productsData) return { rows, exportData };

    productsData?.data.forEach((prod) => {
      const formattedDate = formatDate(prod.createdAt);

      const formattedTotalStocks = formatNumber(prod.totalStocks);

      rows.push({
        id: prod.productId,
        materialCode: prod.materialCode,
        productName: prod.productName,
        productFamily: prod.productFamily,
        uom: prod.uom,
        totalStocks: prod.totalStocks,
        totalLiters: prod.totalLiters,
        restockThreshold: prod.restockThreshold,
        isLowStock: prod.isLowStock,
        createdAt: formattedDate,
      });

      exportData.push({
        "Material Code": prod.materialCode,
        "Product Name": prod.productName,
        "Product Family": prod.productFamily,
        "UOM (L)": formatNumber(prod.uom),
        "Total Stocks":
          prod.totalStocks < 0
            ? `Backorder (${formattedTotalStocks})`
            : prod.isLowStock
            ? `Low Stock (${formattedTotalStocks})`
            : `In Stock (${formattedTotalStocks})`,
        "Total Liters": formatNumber(prod.totalLiters),
        "Created At": formattedDate,
      });
    });

    return { rows, exportData };
  }, [productsData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !productsData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load products"
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
            <SortToggle
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              title="Sort by Total Stocks"
            />
          </div>
          <Typography>
            Number of Products: {formatNumber(productsData?.total)}
          </Typography>

          <Typography>
            Products to Replenish: {formatNumber(productsToRestockCount ?? 0)}
          </Typography>

          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <AddRowButton
              columns={columnsGuide}
              initialValues={{
                materialCode: "",
                productName: "",
                productFamily: "",
                uom: 0,
                totalStocks: 0,
              }}
              isLoading={isAdding}
              onSubmit={handleAddSingleProduct}
              title="Add New Product"
              buttonLabel="Product"
              startIcon={<Add />}
            />
            <ImportExcel
              handleImportExcel={handleImportProductsExcel}
              isImporting={isImporting}
              rowGuide={rowGuide}
              columnsGuide={columnsGuide}
            />
            <ExportExcel
              exportData={exportData}
              fileName="products"
              sheetName="Products"
            />
            {role === "admin" && (
              <DeleteSelectedButton
                selected={selected}
                setSelected={setSelected}
                handleDeleteSelected={handleDeleteSelectedProducts}
                isDeleting={isDeletingProducts}
              />
            )}
          </div>
        </div>
      </div>
      <Table
        rows={rows}
        columns={columns}
        onRowClick={(productId) => router.push(`${pathName}/${productId}`)}
        enableSelection={role === "admin"}
        selected={selected}
        setSelected={setSelected}
      />
      <PaginationControls
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={productsData?.page}
        limit={productsData?.limit}
        total={productsData?.total}
      />
    </div>
  );
};

export default ProductsPage;
