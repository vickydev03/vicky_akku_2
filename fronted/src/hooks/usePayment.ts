"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
// import { trpc } from "@/utils/trpc"; // Your tRPC client path
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const usePayment = () => {
  const router = useRouter();
  const trpc = useTRPC();
  // Define Mutations
  const createOrder = useMutation(
    trpc.order.create.mutationOptions({
      onError: (err) => {
        console.log(err, "sdfsd");
        const message =
          (err?.data as any)?.message || err?.message || "Something went wrong";
        toast.error(message);
      },
    }),
  );
  const verifyPayment = useMutation(
    trpc.order.verify.mutationOptions({
      onSuccess: () => {
        toast.success("Purchased Sucessfully");
      },
      onError: (err) => {
        console.log(err, "sdfsd");
        const message =
          (err?.data as any)?.message || err?.message || "Something went wrong";
        toast.error(message);
      },
    }),
  );

  const startPayment = async (
    productId: string,
    productType: "WORKSHOP" | "TUTORIAL" | "CLASS",
  ) => {
    try {
      // 1. Call tRPC to create Order
      const data = await createOrder.mutateAsync({ productId, productType });

      const options = {
        key: data.keyId,
        amount: data.order.amount * 100,
        currency: "INR",
        name: "Vicky Akku",
        order_id: data.order.razorpayOrderId,

        handler: async (response: any) => {
          // 2. Call tRPC to Verify
          const isVerified = await verifyPayment.mutateAsync({
            orderId: data.order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (isVerified.success) {
            router.push("/profile");
          }
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.log(err);
      //         // toast.error(err.message);
      //         const message =
      //   (err?.data as any)?.message ||
      //   err?.message ||
      //   "Something went wrong";
      //         toast.error(message);
      //   alert(err.message || "Payment failed to initialize");
    }
  };

  return {
    startPayment,
    isLoading: createOrder.isPending || verifyPayment.isPending,
  };
};
