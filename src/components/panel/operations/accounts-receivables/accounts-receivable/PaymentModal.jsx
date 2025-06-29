"use client";

import React, { useState } from "react";
import { useAccountsReceivablePaymentMutation } from "@/state/services/accountsReceivablesApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import CurrencyTextField from "@/components/Utils/CurrencyTextField";

const paymentMethods = [
  "Cash",
  "Bank Transfer",
  "E-Wallet",
  "Cheque",
  "Online Payment",
];

const PaymentModal = ({ open, onClose, accountsReceivableId = "" }) => {
  const dispatch = useAppDispatch();

  const [paymentInfo, setPaymentInfo] = useState({
    amount: "",
    method: "",
    reference: "",
    note: "",
  });

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setPaymentInfo({
      amount: "",
      method: "",
      reference: "",
      note: "",
    });
    onClose();
  };

  const [accountsReceivablePayment, { isLoading: isMakingPayment }] =
    useAccountsReceivablePaymentMutation();

  const handleArPayment = async (e, accountsReceivableId, paymentInfo) => {
    e.preventDefault();
    try {
      if (!paymentInfo.amount || !paymentInfo.method) {
        throw new Error("Amount and method are required", 400);
      }
      const res = await accountsReceivablePayment({
        accountsReceivableId,
        paymentInfo,
      }).unwrap();
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Payment successful",
        })
      );
      handleClose();
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to process payment",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Record Payment</DialogTitle>
      <form
        onSubmit={(e) => handleArPayment(e, accountsReceivableId, paymentInfo)}
      >
        <DialogContent>
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}
          >
            <InfoOutlined
              sx={{ color: "text.secondary", mt: "2px", fontSize: 20 }}
            />
            <Typography variant="body2" color="text.secondary">
              Please ensure all payment details are correct before proceeding.
              Payments are final and cannot be edited or revoked once submitted.
            </Typography>
          </Box>

          <Stack spacing={2} mt={1}>
            <CurrencyTextField
              name="amount"
              value={paymentInfo.amount}
              onChange={handleChange}
              label="Amount"
              required
              fullWidth
            />
            <TextField
              select
              label="Payment Method"
              name="method"
              required
              value={paymentInfo.method}
              onChange={handleChange}
            >
              {paymentMethods.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Reference"
              name="reference"
              value={paymentInfo.reference}
              onChange={handleChange}
              placeholder="Optional"
            />
            <TextField
              label="Note"
              name="note"
              value={paymentInfo.note}
              onChange={handleChange}
              placeholder="Optional"
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} loading={isMakingPayment}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!paymentInfo.amount || !paymentInfo.method}
            loading={isMakingPayment}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentModal;
