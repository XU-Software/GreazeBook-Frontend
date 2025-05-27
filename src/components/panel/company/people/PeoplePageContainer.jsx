"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  CardActions,
  Button,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "@/lib/axios";
import FeedbackSnackbar from "@/components/Utils/FeedbackSnackbar";
import PaginationBar from "@/components/Utils/PaginationBar";
import SortToggle from "@/components/Utils/SortToggle";

import { useAppSelector } from "@/app/redux";

const PeoplePageContainer = ({ data }) => {
  const userData = useAppSelector((state) => state.global.userData);

  /*-- STATES --*/

  // Initial data fetched from the server
  const [companyUsersData, setCompanyUsersData] = useState(data);
  // Loading state when refetching data
  const [loading, setLoading] = useState(false);

  // Loading state for specific user while cancelling
  const [loadingUserId, setLoadingUserId] = useState(null);

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

  const handleRemoveAccess = async (userId) => {
    setLoadingUserId(userId);
    try {
      const response = await axios.patch(`/company/users/${userId}/delete`);

      const data = response.data;

      if (data.success) {
        setCompanyUsersData((prev) => ({
          ...prev,
          data: prev.data.map((user) =>
            user.userId === data.data.userId ? data.data : user
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
      setLoadingUserId(null);
    }
  };

  // Handler for fetching data with page and limit args setting the state to a new fresh one
  const fetchData = async (page, limit, query = "", sortOrder = "desc") => {
    setLoading(true);
    try {
      const response = await axios.get(`/company/users`, {
        params: {
          page,
          limit,
          search: query,
          sortOrder,
        },
      });
      setCompanyUsersData(response.data);
    } catch (error) {
      setCompanyUsersData({
        error: true,
        message: error.message || "Failed to fetch invitations",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for only page change
  const handlePageChange = async (event, newPage) => {
    await fetchData(newPage, companyUsersData.limit, searchQuery, sortOrder);
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
      fetchData(1, companyUsersData.limit, searchQuery, sortOrder);
    }, 500); // wait 500ms after typing

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // UseEffect for sorting
  useEffect(() => {
    fetchData(1, companyUsersData.limit, searchQuery, sortOrder);
  }, [sortOrder]);

  return (
    <div className="pb-24">
      <div className="container m-auto">
        <h2 className="text-2xl font-semibold mb-4">People</h2>
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
        {companyUsersData.error ? (
          <p className="m-auto w-fit font-semibold text-2xl">
            {companyUsersData.message}
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {companyUsersData.data.length < 1 ? (
              <p className="m-auto w-fit font-semibold text-2xl">
                No records found
              </p>
            ) : (
              companyUsersData.data.map((user, index) => {
                const date = new Date(user.createdAt);
                const formattedWithTime = new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Manila", // Optional: adjust as needed
                }).format(date);

                return (
                  <React.Fragment key={index}>
                    {loading ? (
                      <div className="p-4 bg-white rounded shadow">
                        <div className="h-32 bg-gray-200 animate-pulse rounded mb-4" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                      </div>
                    ) : (
                      <Card
                        sx={{
                          minWidth: 275,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <CardContent className="flex flex-col gap-2 h-full">
                          <div className="relative flex items-center gap-4 h-full">
                            <Avatar
                              sx={{ bgcolor: "#ccc", width: 110, height: 110 }}
                              src={user.profilePicture}
                              alt={user.name}
                            >
                              {user.email.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="flex flex-col gap-2 break-all border-l border-gray-200 px-4">
                              <Typography variant="h5" component="div">
                                {user.name}
                              </Typography>
                              <Typography component="div" className="text-sm">
                                {user.email}
                              </Typography>
                              <Chip
                                label={user.role.toUpperCase()}
                                sx={
                                  user.role === "admin"
                                    ? {
                                        backgroundColor:
                                          "rgba(33, 150, 243, 0.1)",
                                        color: "#2196f3",
                                        borderColor: "#1976d2",
                                        fontWeight: 600,
                                        width: "fit-content",
                                      }
                                    : {
                                        backgroundColor:
                                          "rgba(156, 39, 176, 0.1)",
                                        color: "#9c27b0",
                                        borderColor: "#9c27b0",
                                        fontWeight: 600,
                                        width: "fit-content",
                                      }
                                }
                                size="small"
                              />
                              <Typography
                                sx={{ color: "text.secondary", fontSize: 14 }}
                              >
                                Joined {formattedWithTime}
                              </Typography>
                            </div>
                            <Tooltip
                              title={
                                user.isDeleted ? "Access Removed" : "Has Access"
                              }
                            >
                              <span
                                className={`h-3 w-3 rounded-full absolute top-0 right-0 ${
                                  user.isDeleted ? "bg-red-500" : "bg-green-500"
                                }`}
                              />
                            </Tooltip>
                          </div>
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
                            onClick={() => handleRemoveAccess(user.userId)}
                            loading={loadingUserId === user.userId}
                            disabled={
                              user.isDeleted ||
                              userData.data.email === user.email
                            }
                          >
                            Remove Access
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
        limit={companyUsersData.limit}
        handleLimitChange={handleLimitChange}
        totalPages={companyUsersData.totalPages}
        page={companyUsersData.page}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default PeoplePageContainer;
