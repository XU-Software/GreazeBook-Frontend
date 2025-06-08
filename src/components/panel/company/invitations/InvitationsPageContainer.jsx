"use client";

import React, { useState, useMemo } from "react";
import {
  Avatar,
  Chip,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import PaginationBar from "@/components/Utils/PaginationBar";
import SortToggle from "@/components/Utils/SortToggle";
import SearchBar from "@/components/Utils/SearchBar";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import statusChipConfig from "@/data/invitationStatusChipConfig";
import { useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  useGetCompanyInvitesQuery,
  useCancelCompanyInviteMutation,
} from "@/state/api";

const InvitationsPageContainer = () => {
  const dispatch = useAppDispatch();
  /*-- STATES --*/

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

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
    data: companyInvitesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCompanyInvitesQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const [loadingInviteId, setLoadingInviteId] = useState(null);

  const [cancelCompanyInvite, { isLoading: isCancelling }] =
    useCancelCompanyInviteMutation();

  /*-- FUNCTIONS --*/

  // Handler for cancelling an invitation
  const handleCancelInvitation = async (inviteId) => {
    setLoadingInviteId(inviteId);
    try {
      const res = await cancelCompanyInvite(inviteId).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Invite cancelled",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to cancel invite",
        })
      );
    } finally {
      setLoadingInviteId(null);
    }
  };

  // Handler for only page change
  const handlePageChange = async (event, newPage) => {
    setPage(newPage);
  };

  // Handler for only limit change
  const handleLimitChange = async (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load invitations"
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="pb-24 pt-4 px-4">
      <div className="container m-auto">
        <h2 className="text-2xl font-semibold mb-4">Company Invitations</h2>
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <SearchBar search={search} setSearch={setSearch} />
          <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
        {companyInvitesData?.data.length < 1 ? (
          <p className="m-auto w-fit font-semibold text-2xl">
            No records found
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {companyInvitesData?.data.map((invitation, index) => {
              const date = new Date(invitation.createdAt);
              const formattedWithTime = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Manila", // Optional: adjust as needed
              }).format(date);

              const config = statusChipConfig[invitation.status] || {};

              return (
                <Card key={index} sx={{ minWidth: 275 }}>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar sx={{ bgcolor: "#ccc", width: 48, height: 48 }}>
                        {invitation.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h5" component="div">
                        {invitation.email}
                      </Typography>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Chip
                        label={invitation.status}
                        sx={config.style}
                        size="small"
                        icon={config.icon}
                      />
                      <Chip
                        label={invitation.role.toUpperCase()}
                        sx={
                          invitation.role === "admin"
                            ? {
                                backgroundColor: "rgba(33, 150, 243, 0.1)",
                                color: "#2196f3",
                                borderColor: "#1976d2",
                                fontWeight: 600,
                              }
                            : {
                                backgroundColor: "rgba(156, 39, 176, 0.1)",
                                color: "#9c27b0",
                                borderColor: "#9c27b0",
                                fontWeight: 600,
                              }
                        }
                        variant="outlined"
                        size="small"
                      />
                    </div>
                    <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                      Invited by {invitation.createdBy.name} <br />{" "}
                      {formattedWithTime}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: "1rem", pb: "1rem", pt: "0" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "red",
                        color: "red",
                        "&:hover": {
                          backgroundColor: "rgba(255, 0, 0, 0.05)", // light red hover
                        },
                      }}
                      onClick={() =>
                        handleCancelInvitation(invitation.companyInviteId)
                      }
                      loading={loadingInviteId === invitation.companyInviteId}
                      disabled={["Cancelled", "Expired", "Accepted"].includes(
                        invitation.status
                      )}
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <PaginationBar
        limit={limit}
        handleLimitChange={handleLimitChange}
        totalPages={companyInvitesData?.totalPages || 1}
        page={page}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default InvitationsPageContainer;
