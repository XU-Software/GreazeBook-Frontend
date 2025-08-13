"use client";

import React, { useState } from "react";
import { useAccountsReceivablePaymentMutation } from "@/state/services/accountsReceivablesApi";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";
import CurrencyTextField from "@/components/Utils/CurrencyTextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  maxHeight: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  overflow: "auto",
};

const CreditMemoPaymentModal = ({
  open,
  onClose,
  creditMemos = [],
  accountsReceivableId = "",
}) => {
  const dispatch = useAppDispatch();

  const [paymentInfo, setPaymentInfo] = useState({
    amount: "",
    method: "Credit Memo",
    reference: "",
    note: "",
    creditMemoId: "",
  });

  const [selectedMemo, setSelectedMemo] = useState(null);

  const handleUseMemo = (memo) => {
    setSelectedMemo(memo);
    setPaymentInfo({
      amount: "",
      method: "Credit Memo",
      reference: "",
      note: "",
      creditMemoId: memo.creditMemoId,
    });
  };

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (selectedMemo) {
      setSelectedMemo(null);
      setPaymentInfo({
        amount: "",
        method: "Credit Memo",
        reference: "",
        note: "",
        creditMemoId: "",
      });
    } else {
      onClose();
    }
  };

  const [accountsReceivablePayment, { isLoading: isMakingPayment }] =
    useAccountsReceivablePaymentMutation();

  const handleArPayment = async (e, accountsReceivableId, paymentInfo) => {
    e.preventDefault();
    try {
      if (
        !paymentInfo.amount ||
        !paymentInfo.method ||
        !paymentInfo.creditMemoId
      ) {
        throw new Error("Select and provide amount and method", 400);
      }
      if (selectedMemo.amount - selectedMemo.usedAmount < paymentInfo.amount) {
        throw new Error(
          "Amount provided cannot exceed credit memo's amount available",
          400
        );
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
      setSelectedMemo(null);
      setPaymentInfo({
        amount: "",
        method: "Credit Memo",
        reference: "",
        note: "",
        creditMemoId: "",
      });
      onClose();
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
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {!selectedMemo ? (
          <>
            <Typography variant="h6" gutterBottom>
              Select Credit Memo to Use
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List sx={{ maxHeight: "50vh", overflow: "auto" }}>
              {creditMemos.length === 0 ? (
                <Typography>No available credit memos.</Typography>
              ) : (
                creditMemos.map((memo, index) => (
                  <React.Fragment key={memo.creditMemoId}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleUseMemo(memo)}
                        >
                          Use
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={`Amount: ${formatToLocalCurrency(
                          memo.amount
                        )}`}
                        secondary={`Used: ${
                          memo.usedAmount
                        } | Available: ${formatToLocalCurrency(
                          memo.amount - memo.usedAmount
                        )}`}
                      />
                    </ListItem>
                    {index < creditMemos.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </>
        ) : (
          <>
            <form
              onSubmit={(e) =>
                handleArPayment(e, accountsReceivableId, paymentInfo)
              }
            >
              <Typography variant="h6" gutterBottom>
                Apply Credit Memo Payment
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                Available:
                {formatToLocalCurrency(
                  selectedMemo.amount - selectedMemo.usedAmount
                )}
              </Typography>
              <Stack spacing={2}>
                {/* <TextField
                  label="Amount"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  name="amount"
                  value={paymentInfo.amount}
                  onChange={handleChange}
                  fullWidth
                /> */}
                <CurrencyTextField
                  name="amount"
                  value={paymentInfo.amount}
                  onChange={handleChange}
                  label="Amount"
                  required
                  fullWidth
                />
                <TextField
                  label="Reference (optional)"
                  name="reference"
                  value={paymentInfo.reference}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Note (optional)"
                  name="note"
                  value={paymentInfo.note}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button variant="contained" type="submit">
                  Confirm Payment
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CreditMemoPaymentModal;
