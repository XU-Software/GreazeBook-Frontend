"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetSingleAccountQuery } from "@/state/api";
import NextLink from "next/link";
import DynamicBreadcrumbs from "@/components/Utils/DynamicBreadcrumbs";
import LoadingSpinner from "@/components/Utils/LoadingSpinner";
import ErrorMessage from "@/components/Utils/ErrorMessage";
import { Card, Button } from "@mui/material";
import { formatDateWithTime } from "@/utils/dateFormatter";
import { formatToLocalCurrency } from "@/utils/currencyFormatter";

const AccountPage = () => {
  const params = useParams();
  const pathName = usePathname();
  const { accountId } = params;

  const {
    data: accountData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleAccountQuery(accountId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !accountData) {
    return (
      <ErrorMessage
        message={
          error?.data?.message || error?.error || "Failed to load account"
        }
        onRetry={refetch}
      />
    );
  }

  const {
    account: {
      customerNumber,
      accountName,
      tradeType,
      location,
      dsp,
      balance,
      contactInformation,
      createdAt,
      updatedAt,
    },
    bookingGroupedByStatus,
    bookingSummary,
    invoiceSummary,
    accountsReceivableGroupedByStatus,
    accountsReceivableSummary,
    paymentSummary,
    pendingExcessGroupedByStatus,
    pendingExcessSummary,
    refundGroupedByStatus,
    refundSummary,
    creditMemoSummary,
  } = accountData?.data;

  return (
    <div>
      <DynamicBreadcrumbs />
      <Card
        variant="outlined"
        sx={{ mb: 3, p: 2, color: "inherit" }}
        className="container m-auto flex flex-col gap-4"
      >
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{accountName}</h2>
            <p>Customer Number: {customerNumber}</p>
          </div>
          <div className="flex flex-col">
            <p>Created: {formatDateWithTime(createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-md border border-gray-300 p-2 bg-blue-100">
            ACCOUNT INFORMATION
          </p>
          <p>Trade Type: {tradeType}</p>
          <p>Location: {location}</p>
          <p>DSP: {dsp}</p>
          <p>Contact Information: {contactInformation}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-md border border-gray-300 p-2 bg-blue-100">
            STATEMENT OF ACCOUNT SUMMARY
          </p>
          <p>Outstanding Balance: {formatToLocalCurrency(balance)}</p>
          <p>
            Total Sales Amount:{" "}
            {formatToLocalCurrency(accountsReceivableSummary.totalSales || 0)}
          </p>
          <p>
            Total Payments Amount:{" "}
            {formatToLocalCurrency(paymentSummary._sum.amount || 0)}
          </p>
          <p>
            Over Payments Amount:{" "}
            {formatToLocalCurrency(pendingExcessSummary.totalAmount || 0)}
          </p>
          <p>
            Refunds Amount:{" "}
            {formatToLocalCurrency(refundSummary.totalAmount || 0)}
          </p>
          <p>
            Credit Memos Amount:{" "}
            {formatToLocalCurrency(creditMemoSummary._sum.amount || 0)}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-md border border-gray-300 p-2 bg-blue-100">
            DETAILED STATEMENT OF ACCOUNT
          </p>
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Bookings</p>
              <Button
                variant="contained"
                color="primary"
                component={NextLink}
                href={`${pathName}/bookings`}
              >
                Manage Bookings
              </Button>
            </div>
            <p>
              Total Number of Bookings:
              {bookingSummary.totalCount || 0}
            </p>
            {bookingGroupedByStatus.map((booking) => {
              return (
                <p key={booking.status}>
                  {booking.status}:{booking._count || 0}
                </p>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Invoices</p>
              <Button
                variant="contained"
                color="primary"
                component={NextLink}
                href={`${pathName}/invoices`}
              >
                View Invoices
              </Button>
            </div>
            <p>
              Total Number of Invoices:
              {invoiceSummary._count || 0}
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Accounts Receivables</p>
              <Button
                variant="contained"
                color="primary"
                component={NextLink}
                href={`${pathName}/accounts-receivables`}
              >
                Manage Accounts Receivables
              </Button>
            </div>
            <p>
              Total Number of Accounts Receivable:
              {accountsReceivableSummary.totalCount || 0}
            </p>
            {accountsReceivableGroupedByStatus.map((accountsReceivable) => {
              return (
                <p key={accountsReceivable.status}>
                  {accountsReceivable.status}:{accountsReceivable._count || 0}
                </p>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Payments</p>
              <Button
                variant="contained"
                color="primary"
                component={NextLink}
                href={`${pathName}/payments`}
              >
                View Payments
              </Button>
            </div>
            <p>
              Total Number of Payments:
              {paymentSummary._count || 0}
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Over Payments</p>
              <Button
                variant="contained"
                color="primary"
                component={NextLink}
                href={`${pathName}/overpayments`}
              >
                Manage Over Payments
              </Button>
            </div>
            <p>
              Total Number of Over Payments:
              {pendingExcessSummary.totalCount || 0}
            </p>
            {pendingExcessGroupedByStatus.map((pendingExcess) => {
              return (
                <p key={pendingExcess.status}>
                  {pendingExcess.status}:{pendingExcess._count || 0}
                </p>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Refunds</p>
              <Button
                variant="contained"
                color="primary"
                component={NextLink}
                href={`${pathName}/refunds`}
              >
                Manage Refunds
              </Button>
            </div>
            <p>
              Total Number of Refunds:
              {refundSummary.totalCount || 0}
            </p>
            {refundGroupedByStatus.map((refund) => {
              return (
                <p key={refund.status}>
                  {refund.status}:{refund._count || 0}
                </p>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Credit Memos</p>
              <Button
                variant="contained"
                color="primary"
                component={NextLink}
                href={`${pathName}/credit-memos`}
              >
                View Credit Memos
              </Button>
            </div>
            <p>
              Total Number of Credit Memos:
              {creditMemoSummary._count || 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountPage;
