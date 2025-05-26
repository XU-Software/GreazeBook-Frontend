import React from "react";
import PeoplePageContainer from "@/components/panel/company/people/PeoplePageContainer";
import { cookies } from "next/headers";

async function getCompanyUsersData() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/company/users`,
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
      console.error("Failed to fetch company users data:", res.statusText);
      throw new Error("Failed to fetch company users data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching company users data:", error);
    return { error: true, message: error.message || "Something went wrong" };
  }
}

const PeoplesPage = async () => {
  const companyUsersData = await getCompanyUsersData();
  return <PeoplePageContainer data={companyUsersData} />;
};

export default PeoplesPage;
