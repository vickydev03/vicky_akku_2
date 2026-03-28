"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import toast from "react-hot-toast";

const locationSchema = z.object({

  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  pincode: z
    .string()
    .regex(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .optional()
    .or(z.literal("")),
  place: z.string().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export default function LocationForm() {
    const trpc=useTRPC()
    const mutate=useMutation(trpc.workshop.CreateLocation.mutationOptions({
        onSuccess:()=>{
            toast.success("Location Created")
        },
        onError:()=>{
            toast.error("Something went wrong.")

        }
    }))


  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LocationFormValues) => {
    
    try {
      setServerError(null);
      setSuccess(false);
        
      

      console.log(data,45678)
        
      await mutate.mutateAsync({

        name:data.name,
        address:data.address,
        state:data.state,
        city:data.city,
        country:data.country,
        pincode:data.pincode,
        place:data.place

      })

      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      setServerError("Failed to create location. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Create Location</CardTitle>
          <CardDescription>Add a new workshop location</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {serverError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Location created successfully</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Location Name" error={errors.name?.message} touched={touchedFields.name}>
                <Input placeholder="e.g. Main Hall" {...register("name")} />
              </Field>

              <Field label="City" error={errors.city?.message} touched={touchedFields.city}>
                <Input placeholder="e.g. Indore" {...register("city")} />
              </Field>

              <Field label="State" error={errors.state?.message} touched={touchedFields.state}>
                <Input placeholder="e.g. MP" {...register("state")} />
              </Field>

              <Field label="Country" error={errors.country?.message} touched={touchedFields.country}>
                <Input placeholder="e.g. India" {...register("country")} />
              </Field>

              <Field label="Pincode" error={errors.pincode?.message} touched={touchedFields.pincode}>
                <Input placeholder="6 digit code" {...register("pincode")} />
              </Field>

              <Field label="Place">
                <Input placeholder="Optional" {...register("place")} />
              </Field>
            </div>

            <Field label="Full Address" error={errors.address?.message} touched={touchedFields.address}>
              <Textarea placeholder="Enter full address" {...register("address")} />
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Location"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, touched, children }: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && touched && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
