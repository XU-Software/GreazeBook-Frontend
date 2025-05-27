"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Chip,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "@/lib/axios";
import FeedbackSnackbar from "@/components/Utils/FeedbackSnackbar";
import PaginationBar from "@/components/Utils/PaginationBar";
import SortToggle from "@/components/Utils/SortToggle";
import statusChipConfig from "@/data/invitationStatusChipConfig";

const InvitationsPageContainer = ({ data }) => {
  /*-- STATES --*/

  // Initial data fetched from the server
  const [companyInvitationsData, setCompanyInvitationsData] = useState(data);
  // Loading state when refetching data
  const [loading, setLoading] = useState(false);

  // Loading state for specific invitation while cancelling
  const [loadingInviteId, setLoadingInviteId] = useState(null);

  // Data for Feedback snackbar either success or error
  const [snackbarInfo, setSnackbarInfo] = useState({
    show: false,
    success: false,
    message: "",
  });

  // States for search functionality
  const [searchQuery, setSearchQuery] = useState("");

  // States for sort functionality
  const [sortOrder, setSortOrder] = useState("desc"); // default to descending

  /*-- FUNCTIONS --*/

  // Handler for cancelling an invitation
  const handleCancelInvitation = async (inviteId) => {
    setLoadingInviteId(inviteId);
    try {
      const response = await axios.patch(
        `/company/invitations/${inviteId}/cancel`
      );

      const data = response.data;

      if (data.success) {
        setCompanyInvitationsData((prev) => ({
          ...prev,
          data: prev.data.map((inv) =>
            inv.companyInviteId === data.data.companyInviteId ? data.data : inv
          ),
        }));
        setSnackbarInfo({
          show: true,
          success: data.success,
          message: data.message,
        });
      }
    } catch (error) {
      setSnackbarInfo({
        show: true,
        success: false,
        message: error.message,
      });
    } finally {
      setLoadingInviteId(null);
    }
  };

  // Handler for fetching data with page and limit args setting the state to a new fresh one
  const fetchData = async (page, limit, query = "", sortOrder = "desc") => {
    setLoading(true);
    try {
      const response = await axios.get(`/company/invites`, {
        params: {
          page,
          limit,
          search: query,
          sortOrder,
        },
      });
      setCompanyInvitationsData(response.data);
    } catch (error) {
      setCompanyInvitationsData({
        error: true,
        message: error.message || "Failed to fetch invitations",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for only page change
  const handlePageChange = async (event, newPage) => {
    await fetchData(
      newPage,
      companyInvitationsData.limit,
      searchQuery,
      sortOrder
    );
  };

  // Handler for only limit change and revert back to page 1
  const handleLimitChange = async (event) => {
    const newLimit = parseInt(event.target.value, 10);
    await fetchData(1, newLimit, searchQuery, sortOrder); // Go back to first page when limit changes
  };

  // Handler for search state change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // UseEffect for search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData(1, companyInvitationsData.limit, searchQuery, sortOrder);
    }, 500); // wait 500ms after typing

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // UseEffect for sorting
  useEffect(() => {
    fetchData(1, companyInvitationsData.limit, searchQuery, sortOrder);
  }, [sortOrder]);

  return (
    <div className="pb-24">
      <div className="container m-auto">
        <h2 className="text-2xl font-semibold mb-4">Company Invitations</h2>
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 md:w-full max-w-md">
            <TextField
              size="small"
              fullWidth
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
        {companyInvitationsData.error ? (
          <p className="m-auto w-fit font-semibold text-2xl">
            {companyInvitationsData.message}
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {companyInvitationsData.data.length < 1 ? (
              <p className="m-auto w-fit font-semibold text-2xl">
                No records found
              </p>
            ) : (
              companyInvitationsData.data.map((invitation, index) => {
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
                  <React.Fragment key={index}>
                    {loading ? (
                      <div className="p-4 bg-white rounded shadow">
                        <div className="h-32 bg-gray-200 animate-pulse rounded mb-4" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                      </div>
                    ) : (
                      <Card sx={{ minWidth: 275 }}>
                        <CardContent className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar
                              sx={{ bgcolor: "#ccc", width: 48, height: 48 }}
                            >
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
                                      backgroundColor:
                                        "rgba(33, 150, 243, 0.1)",
                                      color: "#2196f3",
                                      borderColor: "#1976d2",
                                      fontWeight: 600,
                                    }
                                  : {
                                      backgroundColor:
                                        "rgba(156, 39, 176, 0.1)",
                                      color: "#9c27b0",
                                      borderColor: "#9c27b0",
                                      fontWeight: 600,
                                    }
                              }
                              variant="outlined"
                              size="small"
                            />
                          </div>
                          <Typography
                            sx={{ color: "text.secondary", fontSize: 14 }}
                          >
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
                            loading={
                              loadingInviteId === invitation.companyInviteId
                            }
                            disabled={[
                              "Cancelled",
                              "Expired",
                              "Accepted",
                            ].includes(invitation.status)}
                          >
                            Cancel
                          </Button>
                        </CardActions>
                      </Card>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>
        )}
      </div>
      <FeedbackSnackbar
        open={snackbarInfo.show}
        onClose={() => setSnackbarInfo((prev) => ({ ...prev, show: false }))}
        message={snackbarInfo.message}
        severity={snackbarInfo.success ? "success" : "error"} // or "error", "warning", "info"
      />
      <PaginationBar
        limit={companyInvitationsData.limit}
        handleLimitChange={handleLimitChange}
        totalPages={companyInvitationsData.totalPages}
        page={companyInvitationsData.page}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default InvitationsPageContainer;
