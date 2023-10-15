import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="max-w-screen-lg mx-auto w-11/12 text-center py-10">
        &copy; {year} All rights reserved.
      </footer>
    </>
  );
};

export default Footer;
