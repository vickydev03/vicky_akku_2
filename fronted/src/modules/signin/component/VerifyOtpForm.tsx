"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

// ✅ Strict OTP validation schema
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
});

type OtpForm = z.infer<typeof otpSchema>;

function VerifyOtpForm({ phone }: { phone: string }) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onChange",
  });

  const otp = watch("otp");
  const trpc = useTRPC();
  const router = useRouter();
  const mutate = useMutation(
    trpc.user.verifyOtp.mutationOptions({
      onSuccess: () => {
        router.push(`/`);
        toast.success("OTP verified Successfully.");
      },
      onError: (error) => {
        console.log(error.data, 741);
        toast.error(
          error.data?.httpStatus == 429
            ? error.message
            : "Something went wrong.",
        );
      },
    }),
  );

  const onSubmit = async (data: OtpForm) => {
    console.log("OTP:", data.otp);
    console.log("phone", phone);
    await mutate.mutateAsync({ otp: data.otp, phone: phone });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-centera gap-6 mt-5"
    >
      <h2 className="text-lg font-semibold font-open-sauce text-[#A6A6A6]">
        Enter OTP
      </h2>

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(val) =>
          setValue("otp", val, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      >
        <InputOTPSlot className="bg-white md:size-12 rounded-lg" index={0} />
        <InputOTPSlot className="bg-white md:size-12 rounded-lg" index={1} />
        <InputOTPSlot className="bg-white md:size-12 rounded-lg" index={2} />
        <InputOTPSlot className="bg-white md:size-12 rounded-lg" index={3} />
        <InputOTPSlot className="bg-white md:size-12 rounded-lg" index={4} />
        <InputOTPSlot className="bg-white md:size-12 rounded-lg" index={5} />
      </InputOTP>

      {errors.otp && (
        <p className="text-sm text-red-500">{errors.otp.message}</p>
      )}

      <Button className=" rounded-full cursor-pointer py-6 text-md px-10 md:max-w-56 max-w-full">
        Login
      </Button>
    </form>
  );
}

export default VerifyOtpForm;
