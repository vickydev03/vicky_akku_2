export const dynamic = "force-dynamic";
import Signinview from "@/modules/signin/view/Signinview";
import React, { Suspense } from "react";
import SigninSkeleton from "@/component/SigninSkeleton";

function page() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<SigninSkeleton/>}>
        <Signinview />
      </Suspense>
    </div>
  );
}

export default page;
