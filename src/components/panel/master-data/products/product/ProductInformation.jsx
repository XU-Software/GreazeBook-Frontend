"use client";

import React, { useState } from "react";
import {
  useUpdateProductInfoMutation,
  useAddProductStockMutation,
  useRemoveProductStockMutation,
} from "@/state/services/productsApi";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Paper,
  Typography,
  Grid,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Check, Close, Edit, Add, Remove } from "@mui/icons-material";
import { formatDateWithTime } from "@/utils/dateFormatter";
import { formatNumber } from "@/utils/quantityFormatter";
import AddRowButton from "@/components/Utils/AddRowButton";
import EditableField from "@/components/Utils/EditableField";

const ProductInformation = ({ productInfoData, productId = "" }) => {
  const dispatch = useAppDispatch();

  const [editProduct, setEditProduct] = useState(false);
  const [productFormData, setProductFormData] = useState({});

  const {
    materialCode,
    productName,
    productFamily,
    uom,
    totalStocks,
    createdAt,
    updatedAt,
  } = productInfoData.data;

  const userData = useAppSelector((state) => state.global.userData);
  const role = userData?.data?.role || "user";

  const [updateProductInfo, { isLoading: isUpdating }] =
    useUpdateProductInfoMutation();

  // handler for updating account information
  const handleUpdateProduct = async (productId, productInfoData) => {
    try {
      if (Object.keys(productInfoData).length === 0) {
        throw new Error("No changes made", 400);
      }
      const res = await updateProductInfo({
        productId,
        productInfoData,
      }).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Product information updated",
        })
      );
      setProductFormData({});
      setEditProduct(false);
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to update product information",
        })
      );
    }
  };

  // ADD STOCK FUNCTION
  const [addProductStock, { isLoading: isAddingStock }] =
    useAddProductStockMutation();

  const handleAddStock = async (productId, productStockInfo) => {
    try {
      const res = await addProductStock({
        productId,
        productStockInfo,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Stock has been added",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to add stock",
        })
      );
    }
  };

  const handleWrapperAddStockFunction = async (productStockInfo) => {
    handleAddStock(productId, productStockInfo);
  };

  // REMOVE STOCK FUNCTION
  const [removeProductStock, { isLoading: isRemovingStock }] =
    useRemoveProductStockMutation();

  const handleRemoveStock = async (productId, productStockInfo) => {
    try {
      const res = await removeProductStock({
        productId,
        productStockInfo,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Stock has been removed",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to remove stock",
        })
      );
    }
  };

  const handleWrapperRemoveStockFunction = async (productStockInfo) => {
    handleRemoveStock(productId, productStockInfo);
  };

  return (
    <Paper elevation={2} className="p-4 rounded-xl h-full w-full mb-4">
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <Typography variant="h4">{productName}</Typography>
        {role === "admin" && (
          <>
            {" "}
            {editProduct ? (
              <Stack direction="row" spacing={2}>
                <Tooltip title="Save Changes">
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleUpdateProduct(productId, productFormData)
                    }
                    loading={isUpdating}
                    size="medium"
                  >
                    <Check fontSize="medium" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel Editing">
                  <IconButton
                    variant="outlined"
                    size="medium"
                    color="secondary"
                    onClick={() => {
                      setProductFormData({});
                      setEditProduct(false);
                    }}
                    loading={isUpdating}
                  >
                    <Close fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <IconButton
                size="medium"
                color="primary"
                onClick={() => setEditProduct(true)}
              >
                <Edit fontSize="medium" />
              </IconButton>
            )}
            <AddRowButton
              buttonLabel="Stock"
              title="Stock Adjustment (Add Stock)"
              description="Adjust this product's stock and provide the adjustment reason."
              descriptionColor="default"
              startIcon={<Add />}
              columns={[
                {
                  field: "quantity",
                  headerName: "Quantity of stocks to add",
                  type: "number",
                  isQuantity: true,
                },
                {
                  field: "reason",
                  headerName: "Adjustment Reason",
                  type: "text",
                },
              ]}
              initialValues={{ quantity: "", reason: "" }}
              onSubmit={handleWrapperAddStockFunction} // Pass wrapper
            />
            <AddRowButton
              buttonLabel="Stock"
              title="Stock Adjustment (Remove Stock)"
              description="Adjust this product's stock and provide the adjustment reason."
              descriptionColor="default"
              startIcon={<Remove />}
              columns={[
                {
                  field: "quantity",
                  headerName: "Quantity of stocks to remove",
                  type: "number",
                  isQuantity: true,
                },
                {
                  field: "reason",
                  headerName: "Adjustment Reason",
                  type: "text",
                },
              ]}
              initialValues={{ quantity: "", reason: "" }}
              onSubmit={handleWrapperRemoveStockFunction} // Pass wrapper
            />
          </>
        )}
      </Stack>

      <Grid container columnSpacing={4} rowSpacing={1} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="Material Code"
            value={
              productFormData.materialCode !== undefined
                ? productFormData.materialCode
                : materialCode || ""
            }
            editing={editProduct}
            type="text"
            name="materialCode"
            onChange={(e) =>
              setProductFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="Product Name"
            value={
              productFormData.productName !== undefined
                ? productFormData.productName
                : productName || ""
            }
            editing={editProduct}
            type="text"
            name="productName"
            onChange={(e) =>
              setProductFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="Product Family"
            value={
              productFormData.productFamily !== undefined
                ? productFormData.productFamily
                : productFamily || ""
            }
            editing={editProduct}
            type="text"
            name="productFamily"
            onChange={(e) =>
              setProductFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="UOM"
            value={
              productFormData.uom !== undefined
                ? productFormData.uom
                : uom || ""
            }
            editing={editProduct}
            type="number"
            name="uom"
            isQuantity={true}
            onChange={(e) =>
              setProductFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Total Stocks</Typography>
          <Typography>{formatNumber(totalStocks)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Created At</Typography>
          <Typography>{formatDateWithTime(createdAt)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Last Updated</Typography>
          <Typography>{formatDateWithTime(updatedAt)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductInformation;
