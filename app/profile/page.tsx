import Navbar from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar";
import React from "react";

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <div className="flex max-w-screen-lg mx-auto w-11/12 py-5">
        <SideBar />
        <div className="pl-14">
          <h1>Profile</h1>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
