"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import StoreProvider from "@/app/redux";
import Navbar from "./PanelNavbar";
import Sidebar from "./PanelSidebar";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import FeedbackSnackbar from "@/components/Utils/FeedbackSnackbar";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setUserData } from "@/state";
import { setHideSnackbar } from "@/state/snackbarSlice";
import { useGetUserQuery } from "@/state/api";

const PageWrapper = ({ children }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  return (
    <div
      className={clsx(
        "h-full w-full pt-18 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "md:pl-24" : "md:pl-76"
      )}
    >
      {children}
    </div>
  );
};

const PanelBootstrap = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const feedbackSnackbar = useAppSelector((state) => state.snackbar);

  const {
    data: userDataResponse,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetUserQuery();

  useEffect(() => {
    if (isSuccess && userDataResponse) {
      dispatch(setUserData(userDataResponse));
    }
  }, [isSuccess, userDataResponse, dispatch]);

  useEffect(() => {
    if (isError && error?.status === 401) {
      router.push("/login");
    }
  }, [isError, error, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500 text-center">
        <ErrorMessage
          message={
            error?.data?.message || error?.error || "Failed to load user data"
          }
        />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <PageWrapper>{children}</PageWrapper>
      <FeedbackSnackbar
        open={feedbackSnackbar.show}
        onClose={() => dispatch(setHideSnackbar())}
        message={feedbackSnackbar.message}
        severity={feedbackSnackbar.severity} // or "error", "warning", "info"
      />
    </>
  );
};

const PanelLayout = ({ children }) => {
  return (
    <StoreProvider>
      <PanelBootstrap>{children}</PanelBootstrap>
    </StoreProvider>
  );
};

export default PanelLayout;
