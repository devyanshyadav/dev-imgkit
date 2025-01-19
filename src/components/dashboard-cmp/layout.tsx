import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="px-2 py-2 bg-shade/50 h-screen w-full md:px-4">
      <div className="max-w-7xl overflow-hidden mx-auto flex flex-col h-full space-y-3">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
