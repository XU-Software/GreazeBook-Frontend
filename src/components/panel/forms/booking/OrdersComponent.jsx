"use client";

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Chip,
  Tooltip,
} from "@mui/material";
import { useGetProductsQuery } from "@/state/api";
import SearchableSelect from "./SearchableSelect";
import { Add, Delete } from "@mui/icons-material";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OrdersComponent = ({ ordersData = [], setOrdersData = () => {} }) => {
  const [tempOrder, setTempOrder] = useState({
    product: null,
    quantity: "",
    price: "",
  });

  const handleTempChange = (field, value) => {
    setTempOrder((prev) => ({ ...prev, [field]: value }));
  };

  const addOrder = () => {
    if (!tempOrder.product || !tempOrder.quantity || !tempOrder.price) return;

    const newOrder = {
      product: tempOrder.product,
      quantity: tempOrder.quantity,
      price: tempOrder.price,
    };

    setOrdersData((prev) => [...prev, newOrder]);

    // Reset temp fields
    setTempOrder({ product: null, quantity: "", price: "" });
  };

  const removeOrder = (index) => {
    setOrdersData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2} fontWeight={500}>
        Orders
      </Typography>
      <p className="font-bold text-md border border-gray-300 p-2 bg-blue-100 my-2">
        Order list
      </p>
      {/* Existing Orders */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product</strong>
              </TableCell>
              <TableCell>
                <strong>Quantity</strong>
              </TableCell>
              <TableCell>
                <strong>Unit Price</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Subtotal</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Available Stocks</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No orders added yet. Use the form below to add your first
                    order.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              ordersData.map((order, index) => {
                const available = order.product.availableStocks || 0;

                const totalOrderedQty = ordersData
                  .filter(
                    (o, i) =>
                      o.product.productId === order.product.productId &&
                      i <= index
                  )
                  .reduce((sum, o) => sum + Number(o.quantity || 0), 0);

                const isLowStock = totalOrderedQty > available;

                return (
                  <TableRow key={index}>
                    <TableCell>{order.product.productName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{formatToLocalCurrency(order.price)}</TableCell>
                    <TableCell align="right">
                      {order.quantity && order.price
                        ? formatToLocalCurrency(order.quantity * order.price)
                        : "-"}
                    </TableCell>

                    <TableCell align="center" sx={{ width: 200 }}>
                      {available === 0 ? (
                        <Tooltip title="Product is out of stock">
                          <Chip
                            icon={<ErrorIcon sx={{ fontSize: 18 }} />}
                            label="Out of Stock"
                            color="error"
                            size="small"
                          />
                        </Tooltip>
                      ) : isLowStock ? (
                        <Tooltip title="Running low on inventory">
                          <Chip
                            icon={<WarningAmberIcon sx={{ fontSize: 18 }} />}
                            label={`Only ${available} left`}
                            color="warning"
                            size="small"
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Sufficient stock available">
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                            label={`In Stock (${available})`}
                            color="success"
                            size="small"
                          />
                        </Tooltip>
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ width: 60 }}>
                      <IconButton
                        color="error"
                        onClick={() => removeOrder(index)}
                        disabled={ordersData.length === 0}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography fontWeight="bold">Total</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">
                  {formatToLocalCurrency(
                    ordersData.reduce((total, order) => {
                      const subtotal = order.quantity * order.price;
                      return total + (isNaN(subtotal) ? 0 : subtotal);
                    }, 0)
                  )}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* Temp New Order */}
      <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <SearchableSelect
            label="Choose Product"
            queryHook={useGetProductsQuery}
            onSelect={(option) => handleTempChange("product", option)}
            getOptionKey={(option) => option?.productId || ""}
            getOptionLabel={(option) => option?.productName || ""}
            value={tempOrder.product}
            isOptionEqualToValue={(option, value) =>
              option?.productId === value?.productId
            }
          />
        </Grid>
        <Grid item size={{ xs: 6, sm: 2 }}>
          <TextField
            label="Quantity"
            type="number"
            value={tempOrder.quantity}
            name="quantity"
            onChange={(e) => handleTempChange(e.target.name, e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 6, sm: 2 }}>
          <TextField
            label="Price"
            type="number"
            value={tempOrder.price}
            name="price"
            onChange={(e) => handleTempChange(e.target.name, e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 6, sm: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addOrder}
            disabled={
              !tempOrder.product || !tempOrder.quantity || !tempOrder.price
            }
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrdersComponent;
