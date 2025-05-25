import React from "react";
import RegisterCompanyForm from "@/components/auth/register-company/RegisterCompanyForm";

const RegisterCompany = () => {
  return (
    <div className="w-full">
      <div className="container m-auto min-h-screen flex flex-row">
        <div className="w-[50%]">Welcome to GreazeBook</div>
        <div className="w-[50%] px-10">
          <RegisterCompanyForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;
