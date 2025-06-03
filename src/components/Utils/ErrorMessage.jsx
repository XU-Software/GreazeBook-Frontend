import { useState } from "react";
import FeedbackSnackbar from "./FeedbackSnackbar";
import { Button, CircularProgress } from "@mui/material";

const ErrorMessage = ({ message = "Something went wrong", onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  // Data for Feedback snackbar either success or error
  const [snackbarInfo, setSnackbarInfo] = useState({
    show: false,
    success: false,
    message: "",
  });

  const handleRetry = async () => {
    if (!onRetry) return;

    try {
      setIsRetrying(true);
      await onRetry();
      setSnackbarInfo({
        show: true,
        success: true,
        message: "Success",
      });
    } catch (error) {
      setSnackbarInfo({
        show: true,
        success: false,
        message:
          err?.data?.message ||
          err?.error ||
          err?.message ||
          "Retry failed. Please try again later.",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-red-50 text-red-700 p-4 rounded-md shadow-sm border border-red-200 space-y-2">
      <p className="text-sm font-medium">{message}</p>

      {onRetry && (
        <Button
          size="small"
          variant="outlined"
          sx={{
            px: 4,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "error.main",
            color: "white",
            fontSize: "0.75rem", // text-xs ~ 12px
            borderRadius: 1, // ~ 4px (rounded)
            "&:hover": {
              backgroundColor: "error.dark",
            },
            "&:disabled": {
              opacity: 0.6,
              color: "white",
            },
          }}
          startIcon={
            isRetrying ? (
              <CircularProgress size={16} sx={{ color: "#ffffff" }} />
            ) : null
          }
          onClick={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? "Retrying..." : "Retry"}
        </Button>
      )}
      <FeedbackSnackbar
        open={snackbarInfo.show}
        onClose={() => setSnackbarInfo((prev) => ({ ...prev, show: false }))}
        message={snackbarInfo.message}
        severity={snackbarInfo.success ? "success" : "error"} // or "error", "warning", "info"
      />
    </div>
  );
};

export default ErrorMessage;
