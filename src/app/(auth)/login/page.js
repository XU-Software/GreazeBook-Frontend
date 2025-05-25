import React from "react";
import LoginForm from "@/components/auth/login/LoginForm";

const Login = () => {
  return (
    <div className="container mx-auto min-h-screen flex items-center">
      <main className="w-full flex items-center justify-center flex-col md:flex-row p-5 md:p-0">
        <LoginForm />
        <div className="w-full md:w-[50%] bg-black min-h-20"></div>
      </main>
      <footer className=""></footer>
    </div>
  );
};

export default Login;
