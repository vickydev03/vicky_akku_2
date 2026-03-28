"use client"
import { loginSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import { code } from "@/app/cdoe";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function LoginForm() {
  const trpc=useTRPC()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });
  const name=form.getValues("name")
  
  const  phone=form.getValues("phone")
  const [countryCode, setCountryCode] = useState<{
    name: string;
    dial_code: string;
    code: string;
  }>(code[0]);

  //   const selectCountryCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setCountryCode(e.target.value);
  //   };
  const [isOpen, setIsOpen] = useState(false);
  console.log(countryCode.dial_code, 7878);
  const router=useRouter()
  const mutate=useMutation(trpc.user.requestOtp.mutationOptions({
    onSuccess:(data)=>{
      // console.log(data,"miss you")
      router.push(`/verify-otp?name=${data.data.name}&phone=${ encodeURIComponent(data.data.phone)}`)
      toast.success("OTP sent Successfully.")
    },
    onError:(error)=>{
      console.log(error)
      toast.error("Something went wrong")
    }
  }))

  const handleSubmit=async(data:z.infer<typeof loginSchema>)=>{
    // console.log(name)
    const updatedData={...data,phone:countryCode.dial_code+data.phone}
    console.log(updatedData,"from test")
    await mutate.mutateAsync({...updatedData})
  }
  return (
    <div className="flex flex-col mt-5">
      <div className="md:max-w-[80%]">
        <form onSubmit={form.handleSubmit(handleSubmit)} >
          <div className="flex flex-col gap-4">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="name field"
                      className=" font-open-sauce font-medium text-lg md:text-xl capitalize text-[#A6A6A6]"
                    >
                      your good name
                    </FieldLabel>
                    <Input
                      className="bg-white rounded-full py-6 placeholder:text-[#A6A6A6]"
                      {...field}
                      id="name-field"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="name field"
                      className=" font-open-sauce font-medium text-lg md:text-xl capitalize text-[#A6A6A6]"
                    >
                      Contact
                    </FieldLabel>
                    <div className="w-full bg-white text-[#A6A6A6] shadow-xs transition-[color,box-shadow] border rounded-full py-2 flex gap-3 px-3 items-center h-fit">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-fit">
                          <Button
                            variant="outline"
                            className="rounded-full  w-fit  border-none shadow-none"
                          >
                            {countryCode.dial_code}{" "}
                            <ChevronDown className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" className="h-56">
                          {code.map((e) => (
                            <DropdownMenuItem
                              role="button"
                              className={`${e.code == countryCode.code && "opacity-50"}`}
                              onClick={() => setCountryCode(e)}
                            >
                              {e.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Input
                        className=" placeholder:text-[#A6A6A6] border-none shadow-none    outline-none"
                        {...field}
                        id="name-field"
                        aria-invalid={fieldState.invalid}
                        placeholder=""
                        autoComplete="off"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            {/* <div className="flex items-center justify-center md:justify-normal"> */}
            <Button className=" rounded-full cursor-pointer py-6 text-md px-10 md:max-w-56 max-w-full">
              Send Otp
            </Button>
            {/* </div> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
