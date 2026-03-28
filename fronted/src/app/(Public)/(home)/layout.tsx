import Navbar from "@/component/Navbar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5">
     
      {children}
    </div>
  );
}

export default layout;
