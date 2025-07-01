"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  useAccountsReceivableProcessOverpaymentToRefundMutation,
  useAccountsReceivableProcessOverpaymentToCreditMemoMutation,
} from "@/state/services/accountsReceivablesApi";

const refundMethods = [
  "Cash",
  "Bank Transfer",
  "E-Wallet",
  "Cheque",
  "Online Payment",
];

export default function ProcessOverpaymentModal({
  open = false,
  onClose = () => {},
  accountsReceivableId = "",
  pendingExcessId = "",
  accountName = "",
}) {
  const dispatch = useAppDispatch();

  const [selectedOption, setSelectedOption] = useState("");
  const [form, setForm] = useState({
    reason: "",
    note: "",
    method: "",
    reference: "",
  });

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setSelectedOption("");
    setForm({
      reason: "",
      note: "",
      method: "",
      reference: "",
    });
    onClose();
  };

  const [processOverpaymentToRefund, { isLoading: isProcessingRefund }] =
    useAccountsReceivableProcessOverpaymentToRefundMutation();

  const [
    processOverpaymentToCreditMemo,
    { isLoading: isProcessingCreditMemo },
  ] = useAccountsReceivableProcessOverpaymentToCreditMemoMutation();

  const handleProcessOverPayment = async (
    accountsReceivableId,
    pendingExcessId,
    form
  ) => {
    try {
      let res;
      if (selectedOption === "Refund") {
        if (!form.reason || !form.method) {
          throw new Error(
            "Reason and method fields are required to process refund",
            400
          );
        }
        const refundDetails = form;
        res = await processOverpaymentToRefund({
          accountsReceivableId,
          pendingExcessId,
          refundDetails,
        }).unwrap();
      } else if (selectedOption === "CreditMemo") {
        if (!form.reason) {
          throw new Error(
            "Reason field is required to process credit memo",
            400
          );
        }
        const creditMemoDetails = { reason: form.reason, note: form.note };
        res = await processOverpaymentToCreditMemo({
          accountsReceivableId,
          pendingExcessId,
          creditMemoDetails,
        }).unwrap();
      } else {
        return;
      }
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res?.message || "Overpayment processed successful",
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
            "Failed to process overpayment",
        })
      );
    }
  };

  const isSubmitDisabled =
    !selectedOption ||
    (selectedOption === "Refund" && (!form.reason || !form.method)) ||
    (selectedOption === "CreditMemo" && !form.reason);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Process Overpayment for: {accountName}</DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography color="error" variant="body2" fontWeight="bold">
            ⚠️ Warning: This action is final. Once processed, this AR will be
            locked and no further transactions (payments, sales, voids,
            cancellations) can be made.
          </Typography>

          <Typography variant="subtitle1">
            Choose transfer destination:
          </Typography>

          <RadioGroup value={selectedOption} onChange={handleOptionChange}>
            <FormControlLabel
              value="CreditMemo"
              control={<Radio />}
              label="Transfer to Credit Memo"
            />
            <FormControlLabel
              value="Refund"
              control={<Radio />}
              label="Transfer to Refund"
            />
          </RadioGroup>

          {(selectedOption === "Refund" || selectedOption === "CreditMemo") && (
            <>
              <TextField
                label="Reason"
                name="reason"
                value={form.reason}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                label="Note (Optional)"
                name="note"
                value={form.note}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </>
          )}

          {selectedOption === "Refund" && (
            <>
              <FormControl fullWidth required>
                <InputLabel>Refund Method</InputLabel>
                <Select
                  name="method"
                  value={form.method}
                  label="Refund Method"
                  onChange={handleInputChange}
                >
                  {refundMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Reference Number / Transaction ID (Optional)"
                name="reference"
                value={form.reference}
                onChange={handleInputChange}
                fullWidth
              />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          color="inherit"
          loading={isProcessingRefund || isProcessingCreditMemo}
        >
          Cancel
        </Button>
        <Button
          onClick={() =>
            handleProcessOverPayment(
              accountsReceivableId,
              pendingExcessId,
              form
            )
          }
          variant="contained"
          color="error"
          disabled={isSubmitDisabled}
          loading={isProcessingRefund || isProcessingCreditMemo}
        >
          Confirm & Lock AR
        </Button>
      </DialogActions>
    </Dialog>
  );
}
