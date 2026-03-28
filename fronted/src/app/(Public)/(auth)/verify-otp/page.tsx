export const dynamic = "force-dynamic";
import VerifyOtpView from "@/modules/signin/view/VerifyOtpView";
import React, { Suspense } from "react";
import VerifyOtpSkeleton from "@/component/VerifyOtpSkeleton";

type PageProps = {
  searchParams: {
    phone?: string;
    name?: string;
  };
};

async function Page({ searchParams }: PageProps) {
  const { phone, name } =await searchParams;
  console.log(phone,name)
 if(!phone||!name) return <div>
    Not found
 </div>

  return (
    <div className="w-full h-full">
      
            <Suspense fallback={<VerifyOtpSkeleton/>}>
              <VerifyOtpView phone={phone} name={name} />
            </Suspense>
    </div>  
  );
}

export default Page;