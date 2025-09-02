"use client";

import React, { useState } from "react";
import {
  useGetSingleCompanyQuery,
  useChangeCompanyMutation,
  useActivateSubscriptionMutation,
  useRenewSubscriptionMutation,
} from "@/state/services/superAdminApi";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import AddRowButton from "@/components/Utils/AddRowButton";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import { formatDate, formatDateWithTime } from "@/utils/dateFormatter";
import CheckIcon from "@mui/icons-material/Check";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const CompanyPage = () => {
  const params = useParams();
  const { companyId } = params;

  const dispatch = useAppDispatch();

  const {
    data: companyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleCompanyQuery(companyId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [changeCompany, { isLoading: isChangingCompany }] =
    useChangeCompanyMutation();

  const handleChangeCompany = async (companyId) => {
    try {
      if (!companyId) {
        throw new Error("Company ID is required", 400);
      }

      const res = await changeCompany(companyId).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Change company successful",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to change company",
        })
      );
    }
  };

  const [activateSubscription, { isLoading: isActivating }] =
    useActivateSubscriptionMutation();

  const handleActivateSubscription = async (companyId, formData) => {
    try {
      if (!companyId) throw new Error("Company ID required", 400);
      if (!formData.plan || !formData.durationInDays)
        throw new Error("Plan and Duration in Days required", 400);

      const res = await activateSubscription({ companyId, formData }).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Company subscription activation successful",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to activate subscription",
        })
      );
    }
  };

  const handleActivateSubsWrapper = async (subsActivationInfo) => {
    handleActivateSubscription(companyId, subsActivationInfo);
  };

  const [renewSubscription, { isLoading: isRenewing }] =
    useRenewSubscriptionMutation();

  const handleRenewSubscription = async (companyId, formData) => {
    try {
      if (!companyId) throw new Error("Company ID required", 400);
      if (!formData.plan || !formData.durationInDays)
        throw new Error("Plan and Duration in Days required", 400);

      const res = await renewSubscription({ companyId, formData }).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Company subscription renewal successful",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message ||
            error.message ||
            "Failed to renew subscription",
        })
      );
    }
  };

  const handleRenewSubsWrapper = async (subsRenewalInfo) => {
    handleRenewSubscription(companyId, subsRenewalInfo);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !companyData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load company data"
        }
        onRetry={refetch}
      />
    );
  }

  const {
    name,
    createdAt,
    updatedAt,
    currentSubscription,
    subscriptions,
    createdBy,
  } = companyData.data;

  return (
    <div style={{ padding: "24px" }}>
      <Card
        sx={{
          margin: "0 auto",
          boxShadow: 3,
        }}
      >
        <CardContent>
          {/* Company Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" fontWeight="bold">
              {name}
            </Typography>
            {currentSubscription ? (
              <Chip
                label={currentSubscription.status}
                color={
                  currentSubscription.status === "Active"
                    ? "success"
                    : currentSubscription.status === "ExpiringSoon"
                    ? "warning"
                    : "error"
                }
                variant="contained"
              />
            ) : (
              <Chip label="Pending" color="warning" variant="contained" />
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Company Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created By
              </Typography>
              <Typography variant="body1">
                {createdBy.email} | {createdBy.name}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {formatDateWithTime(createdAt)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Current Subscription
              </Typography>
              <Typography variant="body1">
                {currentSubscription?.plan ??
                  "Waiting for subscription activation"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Subscription Started
              </Typography>
              <Typography variant="body1">
                {currentSubscription
                  ? formatDate(currentSubscription.startDate)
                  : "Waiting for subscription activation"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Subscription Ends
              </Typography>
              <Typography variant="body1">
                {currentSubscription
                  ? formatDate(currentSubscription.endDate)
                  : "Waiting for subscription activation"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleChangeCompany(companyId)}
              loading={isChangingCompany}
            >
              Login
            </Button>
            {currentSubscription ? (
              <AddRowButton
                buttonLabel="Renew Subscription"
                title="Renew this company's subscription"
                description="This company have a current subscription and eligible for renewal of subscription."
                descriptionColor="default"
                startIcon={<AutorenewIcon />}
                columns={[
                  {
                    field: "plan",
                    headerName: "Plan",
                    type: "text",
                  },
                  {
                    field: "durationInDays",
                    headerName: "Duration In Days",
                    type: "number",
                    isQuantity: true,
                  },
                ]}
                initialValues={{ plan: "", durationInDays: "" }}
                onSubmit={handleRenewSubsWrapper} // Pass wrapper
                isLoading={isRenewing}
              />
            ) : (
              <AddRowButton
                buttonLabel="Activate Subscription"
                title="Approve Registration and Activate Subscription"
                description="This Company currently requested and waiting for the registration approval and subscription activation."
                descriptionColor="default"
                startIcon={<CheckIcon />}
                columns={[
                  {
                    field: "plan",
                    headerName: "Plan",
                    type: "text",
                  },
                  {
                    field: "durationInDays",
                    headerName: "Duration In Days",
                    type: "number",
                    isQuantity: true,
                  },
                ]}
                initialValues={{ plan: "", durationInDays: "" }}
                onSubmit={handleActivateSubsWrapper} // Pass wrapper
                isLoading={isActivating}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyPage;
