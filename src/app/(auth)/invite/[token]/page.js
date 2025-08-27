import React from "react";
import InvitePage from "@/components/auth/invite/InvitePage";

const Invite = async ({ params }) => {
  const { token } = await params;

  return <InvitePage token={token} />;
};

export default Invite;
