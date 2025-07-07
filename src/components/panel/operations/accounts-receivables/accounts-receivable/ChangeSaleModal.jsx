"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import SearchableSelect from "@/components/Utils/SearchableSelect";
import { useGetProductsQuery } from "@/state/services/productsApi";
import { useAccountsReceivableChangeSaleMutation } from "@/state/services/accountsReceivablesApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import CurrencyTextField from "@/components/Utils/CurrencyTextField";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";

const orderChangeReasons = [
  { value: "Customer changed mind", restock: true },
  { value: "Input error / Wrong entry", restock: true },
  { value: "Delivery issue / Failed delivery", restock: true },
  { value: "Duplicate entry", restock: true },
  { value: "Pricing error / Incorrect pricing", restock: true },
  { value: "Damaged product / Unsellable", restock: false },
  { value: "Product expired / Quality issue", restock: false },
  { value: "Inventory discrepancy / Stock count error", restock: false },
  { value: "Other", restock: false },
];

export default function ChangeSaleModal({
  open = false,
  onClose = () => {},
  accountsReceivableId = "",
  sale = null, // Full order object: { orderId, productId, productName, quantity, price }
}) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    product: null,
    quantity: "",
    price: "",
  });

  const [changeDetails, setChangeDetails] = useState({
    reason: "",
    note: "",
  });

  // const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (product) => {
    setForm((prev) => ({ ...prev, product }));
  };

  const handleChangeDetails = (e) => {
    const { name, value } = e.target;
    setChangeDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm({
      product: null,
      quantity: "",
      price: "",
    });
    setChangeDetails({
      reason: "",
      note: "",
    });
    onClose();
  };

  const [accountsReceivableChangeSale, { isLoading: isChangingSale }] =
    useAccountsReceivableChangeSaleMutation();

  const handleChangeSale = async (
    e,
    accountsReceivableId,
    saleId,
    newSaleForm,
    changeDetails
  ) => {
    e.preventDefault();
    try {
      if (
        !newSaleForm.product ||
        !newSaleForm.quantity ||
        !newSaleForm.price ||
        !changeDetails.reason
      ) {
        throw new Error(
          "New sale record details and change reason is required",
          400
        );
      }
      const { product, ...rest } = newSaleForm;
      const newSale = { productId: product.productId, ...rest };
      const res = await accountsReceivableChangeSale({
        accountsReceivableId,
        saleId,
        newSale,
        changeDetails,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Sales record changed successful",
        })
      );
      handleClose();
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to change sales record",
        })
      );
    }
  };

  console.log(form, changeDetails);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Change Sales Order</DialogTitle>
      <form
        onSubmit={(e) =>
          handleChangeSale(
            e,
            accountsReceivableId,
            sale?.saleId,
            form,
            changeDetails
          )
        }
      >
        <DialogContent dividers>
          <Typography gutterBottom color="error">
            ⚠️ Please choose the change reason carefully.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Your selection determines whether the product stocks will be
            replenished or not.
          </Typography>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Change Reason</InputLabel>
            <Select
              value={changeDetails.reason}
              name="reason"
              onChange={handleChangeDetails}
              label="Change Reason"
            >
              {orderChangeReasons.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.value}{" "}
                  {item.restock ? " (Will Restock)" : " (No Restock)"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {changeDetails.reason === "Other" && (
            <TextField
              label="Additional Notes (Optional)"
              value={changeDetails.note}
              name="note"
              onChange={handleChangeDetails}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          )}
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              className="w-full flex flex-col sm:flex-row flex-wrap gap-y-1 gap-x-6"
            >
              <span className="font-medium text-gray-700">
                Current Sales Order:
              </span>
              {sale && (
                <>
                  <span className="text-gray-800">
                    <strong>Product:</strong> {sale.order.product.productName}
                  </span>
                  <span className="text-gray-800">
                    <strong>Quantity:</strong> {sale.order.quantity}
                  </span>
                  <span className="text-gray-800">
                    <strong>Unit Price:</strong>{" "}
                    {formatToLocalCurrency(sale.order.price)}
                  </span>
                </>
              )}
            </Typography>

            <SearchableSelect
              label="Select New Product"
              queryHook={useGetProductsQuery}
              getOptionKey={(option) => option?.productId || ""}
              getOptionLabel={(option) => option?.productName || ""}
              onSelect={handleProductSelect}
              value={form.product}
              isOptionEqualToValue={(option, value) =>
                option?.productId === value?.productId
              }
            />

            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChangeForm}
              fullWidth
              required
            />

            <CurrencyTextField
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChangeForm}
              fullWidth
              required
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            color="inherit"
            loading={isChangingSale}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              !form.product ||
              !form.quantity ||
              !form.price ||
              !changeDetails.reason
            }
            loading={isChangingSale}
          >
            Confirm Change
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
