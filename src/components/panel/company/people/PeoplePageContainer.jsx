"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  CardActions,
  Button,
  Tooltip,
} from "@mui/material";
import PaginationBar from "@/components/Utils/PaginationBar";
import SortToggle from "@/components/Utils/SortToggle";
import SearchBar from "@/components/Utils/SearchBar";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import InviteModal from "./InviteModal";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setShowSnackbar } from "@/state/snackbarSlice";
import {
  useGetCompanyUsersQuery,
  useCancelUserAccessMutation,
} from "@/state/api";
import { formatDateWithTime } from "@/utils/dateFormatter";

const PeoplePageContainer = () => {
  const dispatch = useAppDispatch();

  const userData = useAppSelector((state) => state.global.userData);

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
    data: companyUsersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCompanyUsersQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Loading state for specific user while cancelling
  const [loadingUserId, setLoadingUserId] = useState(null);

  const [cancelUserAccess, { isLoading: isCancelling }] =
    useCancelUserAccessMutation();

  /*-- FUNCTIONS --*/

  // Handler for cancelling user access
  const handleCancelUserAccess = async (userId) => {
    setLoadingUserId(userId);
    try {
      const res = await cancelUserAccess(userId).unwrap();

      dispatch(
        setShowSnackbar({
          severity: "success",
          message: res.message || "Access cancelled",
        })
      );
    } catch (error) {
      dispatch(
        setShowSnackbar({
          severity: "error",
          message:
            error.data?.message || error.message || "Failed to cancel access",
        })
      );
    } finally {
      setLoadingUserId(null);
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
        message={error?.data?.message || error?.error || "Failed to load users"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="pb-24 pt-4 px-4">
      <div className="container m-auto">
        <div className="flex flex-row justify-between items-center w-full mb-4">
          <h2 className="text-2xl font-semibold">People</h2>
          <InviteModal />
        </div>
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <SearchBar search={search} setSearch={setSearch} />
          <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
        {companyUsersData?.data.length < 1 ? (
          <p className="m-auto w-fit font-semibold text-2xl">
            No records found
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {companyUsersData?.data.map((user, index) => {
              const formattedWithTime = formatDateWithTime(user.createdAt);

              return (
                <Card
                  key={index}
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
                                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                                  color: "#2196f3",
                                  borderColor: "#1976d2",
                                  fontWeight: 600,
                                  width: "fit-content",
                                }
                              : {
                                  backgroundColor: "rgba(156, 39, 176, 0.1)",
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
                        title={user.isDeleted ? "Access Removed" : "Has Access"}
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
                    {userData.data.email !== user.email && (
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
                        onClick={() => handleCancelUserAccess(user.userId)}
                        loading={loadingUserId === user.userId}
                        disabled={
                          user.isDeleted || userData.data.email === user.email
                        }
                      >
                        {user.isDeleted ? "Access Removed" : "Remove Access"}
                      </Button>
                    )}
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
        totalPages={companyUsersData?.totalPages}
        page={page}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default PeoplePageContainer;
