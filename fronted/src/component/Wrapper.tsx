import React from "react";

type WrapperProps = {
  classname?: string;
  children: React.ReactNode;
};

function Wrapper({ classname = "", children }: WrapperProps) {
  return (
    <div className={classname}>
      {children}
    </div>
  );
}

export default Wrapper;