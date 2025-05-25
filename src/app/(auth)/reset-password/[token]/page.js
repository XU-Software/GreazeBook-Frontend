import React from "react";

const resetPassword = async ({ params }) => {
  const { token } = await params;

  return <div>resetPassword {token}</div>;
};

export default resetPassword;
