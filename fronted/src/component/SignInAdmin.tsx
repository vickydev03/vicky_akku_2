"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignInAdmin() {
  const trpc = useTRPC();
  const router = useRouter();
  const mutate = useMutation(
    trpc.user.adminLogin.mutationOptions({
      onSuccess: () => {
        toast.success("admin login successfully");
        router.push(`/dashboard`);
      },
      onError: (err) => {
        console.log(err, "sdfsd");
        const message =
  (err?.data as any)?.message ||
  err?.message ||
  "Something went wrong";
        toast.error(message);
      },
    }),
  );
  
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullPhone = `+91${formData.phone}`;

    try {
      console.log("Logging in admin:", {
        phone: fullPhone,
        password: formData.password,
      });
      await mutate.mutateAsync({
        phone: fullPhone,
        password: formData.password,
      });
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Panel</h2>
          <p className="mt-2 text-sm text-gray-500">Secure Password Login</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Phone Number */}
          <div className="space-y-3">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm select-none">
                +91
              </span>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-l-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Login as Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
