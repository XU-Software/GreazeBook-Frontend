"use client";
import { useEffect } from "react";
import { socket } from "@/socket";
import { useAppDispatch } from "@/app/redux";
import { api } from "@/state/api"; // Your RTK Query API slice

export default function SocketListeners({ userData }) {
  const dispatch = useAppDispatch();

  const userId = userData?.userId;

  useEffect(() => {
    if (!userId) return;

    // List all of the socket io listeners here when transaction or changes happens

    {
      /* Accounts Event Listeners*/
    }
    socket.on("account_added", () => {
      dispatch(api.util.invalidateTags([{ type: "Accounts", id: "LIST" }]));
    });
    socket.on("accounts_added", () => {
      dispatch(api.util.invalidateTags([{ type: "Accounts", id: "LIST" }]));
    });
    socket.on("accounts_deleted", (affectedAccountIds) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Accounts", id: "LIST" },
          ...affectedAccountIds.map((accountId) => ({
            type: "Account",
            id: accountId,
          })),
        ])
      );
    });
    socket.on("account_set_opening_ar", (accountId) => {
      dispatch(
        api.util.invalidateTags([
          [
            {
              type: "Accounts",
              id: "LIST",
            },
            { type: "Account", id: accountId },
            { type: "AccountMetrics", id: accountId },
            { type: "AccountDetails", id: accountId },
            { type: "AccountsReceivables", id: "LIST" },
          ],
        ])
      );
    });
    socket.on("account_update_info", (accountId) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Accounts", id: "LIST" },
          { type: "Account", id: accountId },
        ])
      );
    });

    {
      /* Products Event Listeners*/
    }
    socket.on("product_added", () => {
      dispatch(
        api.util.invalidateTags([
          { type: "Products", id: "LIST" },
          { type: "ProductsToRestock", id: "LIST" },
        ])
      );
    });
    socket.on("products_added", () => {
      dispatch(
        api.util.invalidateTags([
          { type: "Products", id: "LIST" },
          { type: "ProductsToRestock", id: "LIST" },
        ])
      );
    });
    socket.on("products_deleted", (affectedProductIds) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Products", id: "LIST" },
          { type: "ProductsToRestock", id: "LIST" },
          ...affectedProductIds.map((productId) => ({
            type: "Product",
            id: productId,
          })),
        ])
      );
    });
    socket.on("product_update_info", (productId) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Products", id: "LIST" },
          { type: "Product", id: productId },
        ])
      );
    });
    socket.on("product_add_stocks", (productId) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Products", id: "LIST" },
          { type: "ProductsToRestock", id: "LIST" },
          { type: "Product", id: productId },
          { type: "StockHistoryList", id: productId },
        ])
      );
    });
    socket.on("product_remove_stocks", (productId) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Products", id: "LIST" },
          { type: "ProductsToRestock", id: "LIST" },
          { type: "Product", id: productId },
          { type: "StockHistoryList", id: productId },
        ])
      );
    });

    {
      /*Bookings Event Listeners*/
    }
    socket.on("booking_submit", (accountId) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Bookings", id: "LIST" },
          { type: "Accounts", id: "LIST" },
          { type: "Account", id: accountId },
          { type: "Orders", id: "LIST" },
        ])
      );
    });
    socket.on("bookings_deleted", (affectedBookingIds) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Bookings", id: "LIST" },
          ...affectedBookingIds.map((bookingId) => ({
            type: "Booking",
            id: bookingId,
          })),
        ])
      );
    });
    socket.on("booking_update_pending", (bookingId) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Bookings", id: "LIST" },
          { type: "Booking", id: bookingId },
        ])
      );
    });
    socket.on("orders_update_pending", ({ bookingId, affectedOrderIds }) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Bookings", id: "LIST" },
          { type: "Booking", id: bookingId },
          { type: "Orders", id: "LIST" },
          ...affectedOrderIds.map((orderId) => ({
            type: "Order",
            id: orderId,
          })),
        ])
      );
    });
    socket.on("booking_order_added", (bookingId) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Bookings", id: "LIST" },
          { type: "Booking", id: bookingId },
          { type: "Orders", id: "LIST" },
        ])
      );
    });
    socket.on("booking_note_added", (bookingId) => {
      dispatch(api.util.invalidateTags([{ type: "Booking", id: bookingId }]));
    });
    socket.on("booking_approved", ({ bookingId, affectedProductIds }) => {
      dispatch(
        api.util.invalidateTags([
          { type: "Bookings", id: "LIST" },
          { type: "Booking", id: bookingId },
          { type: "Invoices", id: "LIST" },
          { type: "Sales", id: "LIST" },
          { type: "AccountsReceivables", id: "LIST" },
          { type: "Products", id: "LIST" },
          { type: "ProductsToRestock", id: "LIST" },
          ...(affectedProductIds?.length
            ? affectedProductIds.map((productId) => ({
                type: "Product",
                id: productId,
              }))
            : []),
        ])
      );
    });
    socket.on("booking_deleted", () => {
      dispatch(api.util.invalidateTags([{ type: "Bookings", id: "LIST" }]));
    });

    {
      /*Accounts Receivables Event Listeners*/
    }
    socket.on(
      "ar_payment",
      ({
        accountsReceivableId,
        affectedPendingExcessIds,
        newPendingExcessCreated,
        affectedAccountId,
        usedCreditMemoId,
      }) => {
        // newPendingExcessCreated is a boolean
        // usedCreditMemoId is either creditMemoId or null
        dispatch(
          api.util.invalidateTags([
            { type: "AccountsReceivables", id: "LIST" },
            { type: "AccountsReceivable", id: accountsReceivableId },
            { type: "Payments", id: "LIST" },
            ...(usedCreditMemoId && [
              { type: "CreditMemos", id: "LIST" },
              { type: "CreditMemo", id: usedCreditMemoId },
            ]),
            ...(affectedAccountId && [
              { type: "AccountMetrics", id: affectedAccountId },
              { type: "AccountDetails", id: affectedAccountId },
            ]),
            ...(Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0 &&
              affectedPendingExcessIds.map((pendingExcessId) => ({
                type: "PendingExcess",
                id: pendingExcessId,
              }))),
            (Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0) ||
              (newPendingExcessCreated && {
                type: "PendingExcesses",
                id: "LIST",
              }),
          ])
        );
      }
    );
    socket.on(
      "ar_void_payment",
      ({
        accountsReceivableId,
        paymentId,
        affectedPendingExcessIds,
        newPendingExcessCreated,
        affectedAccountId,
        affectedCreditMemoId,
      }) => {
        dispatch(
          api.util.invalidateTags([
            { type: "AccountsReceivables", id: "LIST" },
            { type: "AccountsReceivable", id: accountsReceivableId },
            { type: "Payments", id: "LIST" },
            { type: "Payment", id: paymentId },
            ...(affectedCreditMemoId && [
              { type: "CreditMemos", id: "LIST" },
              { type: "CreditMemo", id: affectedCreditMemoId },
            ]),
            ...(affectedAccountId && [
              { type: "AccountMetrics", id: affectedAccountId },
              { type: "AccountDetails", id: affectedAccountId },
            ]),
            ...(Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0 &&
              affectedPendingExcessIds.map((pendingExcessId) => ({
                type: "PendingExcess",
                id: pendingExcessId,
              }))),
            (Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0) ||
              (newPendingExcessCreated && {
                type: "PendingExcesses",
                id: "LIST",
              }),
          ])
        );
      }
    );
    socket.on(
      "ar_cancel_sale",
      ({
        accountsReceivableId,
        saleId,
        affectedAccountId,
        affectedProductId,
        affectedPendingExcessIds,
        newPendingExcessCreated,
      }) => {
        dispatch(
          api.util.invalidateTags([
            { type: "AccountsReceivables", id: "LIST" },
            { type: "AccountsReceivable", id: accountsReceivableId },
            { type: "Sales", id: "LIST" },
            { type: "Sale", id: saleId },
            ...(affectedAccountId && [
              { type: "AccountMetrics", id: affectedAccountId },
              { type: "AccountDetails", id: affectedAccountId },
            ]),
            ...(affectedProductId && [
              { type: "Product", id: affectedProductId },
              { type: "Products", id: "LIST" },
              { type: "ProductsToRestock", id: "LIST" },
            ]),
            ...(Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0 &&
              affectedPendingExcessIds.map((pendingExcessId) => ({
                type: "PendingExcess",
                id: pendingExcessId,
              }))),
            (Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0) ||
              (newPendingExcessCreated && {
                type: "PendingExcesses",
                id: "LIST",
              }),
          ])
        );
      }
    );
    socket.on(
      "ar_change_sale",
      ({
        accountsReceivableId,
        saleId,
        affectedAccountId,
        affectedProductIds,
        affectedPendingExcessIds,
        newPendingExcessCreated,
      }) => {
        dispatch(
          api.util.invalidateTags([
            { type: "AccountsReceivables", id: "LIST" },
            { type: "AccountsReceivable", id: accountsReceivableId },
            { type: "Sales", id: "LIST" },
            { type: "Sale", id: saleId },
            { type: "Orders", id: "LIST" },
            { type: "Products", id: "LIST" },
            { type: "ProductsToRestock", id: "LIST" },
            ...(affectedAccountId && [
              { type: "AccountMetrics", id: affectedAccountId },
              { type: "AccountDetails", id: affectedAccountId },
            ]),
            ...Array.from(new Set(affectedProductIds || []))
              .filter(Boolean)
              .map((productId) => ({ type: "Product", id: productId })),
            ...(Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0 &&
              affectedPendingExcessIds.map((pendingExcessId) => ({
                type: "PendingExcess",
                id: pendingExcessId,
              }))),
            (Array.isArray(affectedPendingExcessIds) &&
              affectedPendingExcessIds.length > 0) ||
              (newPendingExcessCreated && {
                type: "PendingExcesses",
                id: "LIST",
              }),
          ])
        );
      }
    );
    socket.on(
      "pending_excess_to_refund",
      ({ accountsReceivableId, pendingExcessId, affectedAccountId }) => {
        dispatch(
          api.util.invalidateTags([
            { type: "AccountsReceivables", id: "LIST" },
            { type: "AccountsReceivable", id: accountsReceivableId },
            { type: "PendingExcesses", id: "LIST" },
            { type: "PendingExcess", id: pendingExcessId },
            { type: "Refunds", id: "LIST" },
            ...(affectedAccountId && [
              { type: "AccountMetrics", id: affectedAccountId },
              { type: "AccountDetails", id: affectedAccountId },
            ]),
          ])
        );
      }
    );
    socket.on(
      "pending_excess_to_credit_memo",
      ({ accountsReceivableId, pendingExcessId, affectedAccountId }) => {
        dispatch(
          api.util.invalidateTags([
            { type: "AccountsReceivables", id: "LIST" },
            { type: "AccountsReceivable", id: accountsReceivableId },
            { type: "PendingExcesses", id: "LIST" },
            { type: "PendingExcess", id: pendingExcessId },
            { type: "CreditMemos", id: "LIST" },
            ...(affectedAccountId && [
              { type: "AccountMetrics", id: affectedAccountId },
              { type: "AccountDetails", id: affectedAccountId },
            ]),
          ])
        );
      }
    );

    return () => {
      //Accounts
      socket.off("account_added");
      socket.off("accounts_added");
      socket.off("accounts_deleted");
      socket.off("account_set_opening_ar");
      socket.off("account_update_info");

      //Products
      socket.off("product_added");
      socket.off("products_added");
      socket.off("products_deleted");
      socket.off("product_update_info");
      socket.off("product_add_stocks");
      socket.off("product_remove_stocks");

      //Bookings
      socket.off("booking_submit");
      socket.off("bookings_deleted");
      socket.off("booking_update_pending");
      socket.off("orders_update_pending");
      socket.off("booking_order_added");
      socket.off("booking_note_added");
      socket.off("booking_approved");
      socket.off("booking_deleted");

      //Accounts Receivables
      socket.off("ar_payment");
      socket.off("ar_void_payment");
      socket.off("ar_cancel_sale");
      socket.off("ar_change_sale");
      socket.off("pending_excess_to_refund");
      socket.off("pending_excess_to_credit_memo");
    };
  }, [dispatch, userId]);

  return null;
}
