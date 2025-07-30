"use client";

import React, { useState } from "react";
import {
  useSetOpeningARMutation,
  useUpdateAccountInfoMutation,
} from "@/state/services/accountsApi";
import DateRangePicker from "@/components/Utils/DateRangePicker";
import {
  Paper,
  Typography,
  Grid,
  Box,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Edit, Close, Check, Add } from "@mui/icons-material";
import { formatDateWithTime } from "@/utils/dateFormatter";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import AddRowButton from "@/components/Utils/AddRowButton";
import EditableField from "@/components/Utils/EditableField";

const AccountInformation = ({
  accountInfoData,
  accountId = "",
  onFilter = () => {},
  onClear = () => {},
  setAccumulatedData = () => {},
  setPage = () => {},
}) => {
  const dispatch = useAppDispatch();

  const [editAccount, setEditAccount] = useState(false);
  const [accountFormData, setAccountFormData] = useState({});

  const {
    customerNumber,
    accountName,
    tradeType,
    location,
    dsp,
    contactInformation,
    createdAt,
  } = accountInfoData.data;

  //Function for handling opening A/R
  const [setOpeningAR, { isLoading: isSettingOpeningAR }] =
    useSetOpeningARMutation();

  const handleSetOpeningAR = async (accountId, openingARInfo) => {
    try {
      const res = await setOpeningAR({ accountId, openingARInfo }).unwrap();
      setAccumulatedData({
        accountsReceivables: [],
        sales: [],
        payments: [],
        creditMemos: [],
        refunds: [],
      });
      setPage(1);
      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Opening A/R has been set",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to set Opening A/R",
        })
      );
    }
  };

  const handleWrapperFunction = async (openingARInfo) => {
    handleSetOpeningAR(accountId, openingARInfo);
  };

  const [updateAccountInfo, { isLoading: isUpdating }] =
    useUpdateAccountInfoMutation();

  // handler for updating account information
  const handleUpdateAccount = async (accountId, accountInfoData) => {
    try {
      if (Object.keys(accountInfoData).length === 0) {
        throw new Error("No changes made", 400);
      }
      const res = await updateAccountInfo({
        accountId,
        accountInfoData,
      }).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Account information updated",
        })
      );
      setAccountFormData({});
      setEditAccount(false);
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to update account information",
        })
      );
    }
  };

  return (
    <Paper elevation={2} className="p-4 rounded-xl h-full w-full mb-4">
      <Box className="flex flex-wrap items-center justify-between">
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
          <Typography variant="h4">{accountName}</Typography>
          {editAccount ? (
            <Stack direction="row" spacing={2}>
              <Tooltip title="Save Changes">
                <IconButton
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleUpdateAccount(accountId, accountFormData)
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
                    setAccountFormData({});
                    setEditAccount(false);
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
              onClick={() => setEditAccount(true)}
            >
              <Edit fontSize="medium" />
            </IconButton>
          )}
          <AddRowButton
            buttonLabel="Opening A/R"
            title="Set Opening A/R"
            description="⚠️ Important: Once the Opening A/R is set, it cannot be modified or revoked. Please proceed only when the details are finalized and fully validated."
            descriptionColor="error"
            startIcon={<Add />}
            columns={[
              { field: "amount", headerName: "Amount", type: "number" },
              { field: "dueDate", headerName: "Due Date", type: "date" },
              { field: "note", headerName: "Note", type: "text" },
            ]}
            initialValues={{ amount: "", dueDate: "", note: "" }}
            onSubmit={handleWrapperFunction} // Pass wrapper
          />
        </Stack>

        <DateRangePicker
          onFilter={onFilter}
          onClear={onClear}
          filterButtonText="Filter By Invoice Date"
          clearButtonText="Clear"
        />
      </Box>

      <Grid container columnSpacing={4} rowSpacing={1} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Customer Number</Typography>
          <Typography>{customerNumber}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="Trade Type"
            value={
              accountFormData.tradeType !== undefined
                ? accountFormData.tradeType
                : tradeType || ""
            }
            editing={editAccount}
            type="text"
            name="tradeType"
            onChange={(e) =>
              setAccountFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="Location"
            value={
              accountFormData.location !== undefined
                ? accountFormData.location
                : location || ""
            }
            editing={editAccount}
            type="text"
            name="location"
            onChange={(e) =>
              setAccountFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="DSP"
            value={
              accountFormData.dsp !== undefined
                ? accountFormData.dsp
                : dsp || ""
            }
            editing={editAccount}
            type="text"
            name="dsp"
            onChange={(e) =>
              setAccountFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <EditableField
            label="Contact Information"
            value={
              accountFormData.contactInformation !== undefined
                ? accountFormData.contactInformation
                : contactInformation || ""
            }
            editing={editAccount}
            type="text"
            name="contactInformation"
            onChange={(e) =>
              setAccountFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle2">Created At</Typography>
          <Typography>{formatDateWithTime(createdAt)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountInformation;
