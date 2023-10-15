"use client";
import React from "react";
import Loader from "@/components/loader";
import Navbar from "@/components/navbar/navbar";
import Auth from "@/models/auth";
import { useSession } from "next-auth/react";

const DashboardPage = () => {
  // Session
  const { data: session, status } = useSession();
  const auth = session as Auth | null;

  if (status === "loading") {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg w-11/12 mx-auto">DashboardPage</div>
    </>
  );
};

export default DashboardPage;
