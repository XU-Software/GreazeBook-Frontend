import React from "react";
import ResetPasswordPage from "@/components/auth/reset-password/ResetPasswordPage";

const resetPassword = async ({ params }) => {
  const { token } = await params;

  return <ResetPasswordPage token={token} />;
};

export default resetPassword;
