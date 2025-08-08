"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Tooltip,
  Button,
  IconButton,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Edit, Check, Close, Delete } from "@mui/icons-material";
import EditableCell from "@/components/Utils/EditableCell";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import { formatToThousandsWithDecimals } from "@/utils/quantityFormatter";
import AddOrderModal from "./AddOrderModal";

const OrdersDetail = ({
  bookingData = {},
  ordersFormData = new Map(),
  setOrdersFormData = () => {},
  ordersToDelete = new Set(),
  setOrdersToDelete = () => {},
  editOrders = false,
  setEditOrders = () => {},
  handleUpdateOrders = () => {},
  isUpdating = false,
  bookingId = "",
}) => {
  const [toggleModal, setToggelModal] = useState(false);

  const liveTotalAmount = useMemo(() => {
    if (!editOrders) return null;

    return bookingData.orders
      .filter((order) => !ordersToDelete.has(order.orderId))
      .reduce((sum, order) => {
        const edit = ordersFormData.get(order.orderId);
        const qty = Number(edit?.quantity ?? order.quantity);
        const price = Number(edit?.price ?? order.price);
        return sum + qty * price;
      }, 0);
  }, [editOrders, bookingData.orders, ordersFormData, ordersToDelete]);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h6">
            🛒 Orders ({bookingData.orders.length})
          </Typography>
          {bookingData.status === "Pending" && (
            <div className="flex items-center gap-4">
              <Tooltip
                title={
                  bookingData.status === "Approved"
                    ? "Cannot add new orders to an approved booking"
                    : "Add a new order to this booking"
                }
                arrow
              >
                <span>
                  {/* Needed to wrap disabled button to ensure Tooltip works */}
                  <Button
                    variant="outlined"
                    disabled={bookingData.status === "Approved" || editOrders}
                    onClick={() => setToggelModal(true)}
                  >
                    + Add Order
                  </Button>
                  {/* <AddRowButton  /> */}
                </span>
              </Tooltip>

              {editOrders ? (
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Save Changes">
                    <IconButton
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleUpdateOrders(
                          bookingId,
                          ordersFormData,
                          ordersToDelete
                        )
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
                        setOrdersFormData(new Map());
                        setOrdersToDelete(new Set());
                        setEditOrders(false);
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
                  onClick={() => setEditOrders(true)}
                >
                  <Edit fontSize="medium" />
                </IconButton>
              )}
            </div>
          )}
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>UOM (L)</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Volume</TableCell>
                {bookingData.status === "Pending" && (
                  <TableCell align="center" sx={{ width: 120 }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingData?.orders.map((order, index) => {
                // Skip deleted orders
                if (ordersToDelete.has(order.orderId)) return null;

                const orderEdit = ordersFormData.get(order.orderId) || {};
                const quantity = Number(orderEdit?.quantity ?? order.quantity);
                const price = Number(orderEdit?.price ?? order.price);
                const uom = Number(order.product.uom);
                const volume = quantity * uom;

                return (
                  <TableRow key={order.orderId}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{order.product.productName}</TableCell>

                    <TableCell>
                      {formatToThousandsWithDecimals(order.product.uom)}
                    </TableCell>

                    <EditableCell
                      value={orderEdit?.quantity ?? order.quantity}
                      editing={editOrders}
                      type="number"
                      convertToCurrency={false}
                      name="quantity"
                      isQuantity={true}
                      onChange={(e) => {
                        const updated = new Map(ordersFormData);
                        updated.set(order.orderId, {
                          ...orderEdit,
                          [e.target.name]: e.target.value,
                        });
                        setOrdersFormData(updated);
                      }}
                    />

                    <EditableCell
                      value={orderEdit?.price ?? order.price}
                      editing={editOrders}
                      type="number"
                      convertToCurrency={true}
                      name="price"
                      isCurrency={true}
                      onChange={(e) => {
                        const updated = new Map(ordersFormData);
                        updated.set(order.orderId, {
                          ...orderEdit,
                          [e.target.name]: e.target.value,
                        });
                        setOrdersFormData(updated);
                      }}
                    />
                    <TableCell>
                      {formatToLocalCurrency(quantity * price)}
                    </TableCell>
                    <TableCell>
                      {formatToThousandsWithDecimals(volume)}
                    </TableCell>
                    {bookingData.status === "Pending" && (
                      <TableCell align="center" sx={{ width: 120 }}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap={2}
                          height="100%"
                        >
                          <Tooltip title="Delete" arrow>
                            <IconButton
                              onClick={() => {
                                setOrdersToDelete((prev) => {
                                  const updated = new Set(prev);
                                  updated.add(order.orderId);
                                  return updated;
                                });
                              }}
                              color="error"
                              size="medium"
                              disabled={!editOrders}
                            >
                              <Delete fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={5} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  {editOrders ? (
                    <strong>{formatToLocalCurrency(liveTotalAmount)}</strong>
                  ) : (
                    <strong>
                      {formatToLocalCurrency(bookingData.totalAmount)}
                    </strong>
                  )}
                </TableCell>
                <TableCell>
                  <strong>
                    {formatToThousandsWithDecimals(
                      bookingData.orders
                        .filter((order) => !ordersToDelete.has(order.orderId))
                        .reduce((sum, order) => {
                          const edit = ordersFormData.get(order.orderId);
                          const quantity = Number(
                            edit?.quantity ?? order.quantity
                          );
                          const uom = Number(order.product.uom);
                          return sum + quantity * uom;
                        }, 0)
                    )}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <AddOrderModal
        open={toggleModal}
        onClose={() => setToggelModal(false)}
        bookingId={bookingId}
      />
    </Card>
  );
};

export default React.memo(OrdersDetail);
