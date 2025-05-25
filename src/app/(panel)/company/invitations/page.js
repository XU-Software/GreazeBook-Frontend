import React from "react";
import InvitationsPageContainer from "@/components/panel/company/invitations/InvitationsPageContainer";
import { cookies } from "next/headers";

async function getCompanyInvitationsData() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/company/invites`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${tokenCookie}`,
        },
        cache: "no-store", // Always fresh
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.error(
        "Failed to fetch company invitations data:",
        res.statusText
      );
      throw new Error("Failed to fetch company invitations data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching company invitations data:", error);
    return { error: true, message: error.message || "Something went wrong" };
  }
}

const InvitationsPage = async () => {
  const companyInvitationsData = await getCompanyInvitationsData();
  return <InvitationsPageContainer data={companyInvitationsData} />;
};

export default InvitationsPage;
