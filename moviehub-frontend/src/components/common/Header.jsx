import React from "react";
import Navbar from "./Navbar";

export const Header = () => {
  return (
    <header style={{ width: "100%", zIndex: 1000 }}>
      <Navbar />
    </header>
  );
};

export default Header;
