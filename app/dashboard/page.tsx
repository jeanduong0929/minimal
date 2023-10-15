"use client";
import React from "react";
import Loader from "@/components/loader";
import Navbar from "@/components/navbar/navbar";
import Auth from "@/models/auth";
import { useSession } from "next-auth/react";
import SideBar from "@/components/sidebar";

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
      <div className="flex max-w-screen-lg w-11/12 mx-auto py-5">
        <SideBar />
      </div>
    </>
  );
};

export default DashboardPage;
