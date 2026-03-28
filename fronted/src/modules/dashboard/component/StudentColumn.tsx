import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getAccess } from "@/trpc/type";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTRPC } from "@/trpc/client";
import {useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDashboardUserFilters } from "../hooks/useDashboardClasses";

export const enrollmentColumn: ColumnDef<getAccess>[] = [
  {
    accessorKey: "tutorial",
    header: "Tutorial",
    cell: ({ row }) => {
      return (
        <p className="font-medium text-sm px-2">
          {row.original.tutorial.title}
        </p>
      );
    },
  },
  {
    accessorKey: "user",
    header: "User Name",
    cell: ({ row }) => {
      return <p className="text-sm font-medium">{row.original.user.name}</p>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <p className="text-xs text-muted-foreground">
          {row.original.user.phone}
        </p>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Enrolled At",
    cell: ({ row }) => {
      const formatted = format(new Date(row.original.createdAt), "MMM d, yyyy");
      return <p className="text-xs text-muted-foreground">{formatted}</p>;
    },
  },

  // ✅ ONLY ACTION: VIEW USER
  {
    id: "actions",
    header: "User",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/users/${row.original.userId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="size-3" />
          View User
        </Link>
      );
    },
  },
  {
    id: "actions-remove-access",
    header: "Remove-access",
    cell: ({ row }) => {
        const [filters, setFilters] = useDashboardUserFilters();
        
      const queryClient = useQueryClient();
      const trpc=useTRPC()
      const removeMutate=useMutation(trpc.tutorials.removeAccess.mutationOptions({
        onSuccess:async()=>{
          toast.success("Access Removed")
          await queryClient.invalidateQueries(
        trpc.tutorials.getStudents.queryOptions({...filters})
      );
        },
        onError:()=>{
          toast.error("Something went wrong!")
        }
      }))
      const handleRemove=async()=>{
        await removeMutate.mutateAsync({userId:row.original.userId,tutorialId:row.original.tutorialId})
      }

      return (

         <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
        onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-blue-100 text-red-600 hover:bg-blue-200 transition"
        >
          <ExternalLink className="size-3" />
          Remove Access
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="capitalize">
            The Student will be no longer can access the tutorial's
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={"destructive"} onClick={handleRemove}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      );
    },
  },
];

export const studentsColumn: ColumnDef<any>[] = [
  {
    accessorKey: "user.name",
    header: "User Name",
    cell: ({ row }) => {
      return <p className="text-sm px-4 font-medium ">{row.original.user.name}</p>;
    },
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <p className="text-xs text-muted-foreground">{row.original.user.phone}</p>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Enrolled At",
    cell: ({ row }) => {
      const formatted = format(new Date(row.original.createdAt), "MMM d, yyyy");
      return <p className="text-xs text-muted-foreground">{formatted}</p>;
    },
  },
  {
    id: "actions",
    header: "User",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/users/${row.original.userId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="size-3" />
          View User
        </Link>
      );
    },
  },
  
];
