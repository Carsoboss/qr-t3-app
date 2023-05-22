import React from "react";
import Navbar from "../navigation/navbar";
import SocialLinksFooter from "../navigation/socialLinksFooter";

const AppLayout = ({ children }: {children: React.ReactElement}) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <SocialLinksFooter />
    </>
  )
};

export default AppLayout;
