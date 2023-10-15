import Navbar from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar";
import React from "react";

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <div className="flex max-w-screen-lg mx-auto w-11/12 py-5">
        <SideBar />
        <h1>Profile</h1>
      </div>
    </>
  );
};

export default ProfilePage;
