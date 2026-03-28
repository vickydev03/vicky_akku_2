import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { getUser, getUsers } from "@/trpc/type";
import { format } from "date-fns";
import Link from "next/link";

export const userColumn: ColumnDef<getUsers[number]>[] = [
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className=" flex  items-center px-2 gap-2 md:gap-4 lg:gap-8 ">
          <p className={`  font-semibold text-md`}>{row.original.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <div className="">
          <p className="font-semibold  text-sm">{row.original.phone}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <div>
          <p className={`font-semibold  text-[12px]`}>{row.original.role}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "LastLoginAt",
    header: "Last Login",
    cell: ({ row }) => {

      const formattedDate = format(
          row.original.lastLoginAt,
          "do MMM yyyy , h b",
        ).toUpperCase();
      return (
        <div>
          <p className={`font-semibold  text-[12px]`}>{formattedDate}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div>
          <p className={`font-semibold   text-[12px]`}>
            {row.original.email ? row.original.email : "--"}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "isActive",
  //   header: "status",
  //   cell: ({ row }) => {
  //     return (
  //       <Badge
  //         className={
  //           row.original.
  //             ? "bg-green-100 text-green-300"
  //             : "bg-red-100 text-red-400"
  //         }
  //       >
  //         <span className={`${row.original.isAvailable && "text-center"}`}>
  //           {row.original.isAvailable ? "Available" : "Not Available"}
  //         </span>
  //       </Badge>
  //     );
  //   },
  // },
  {
    accessorKey: "update",
    header: "",
    cell: ({ row }) => {
      //   const [ConfirmDialog, confirm] = useConfirm(
      //     "Are you sure?",
      //     `the following action will remove all  associated  meetings`
      //   );
      const trpc = useTRPC();

      const queryClient = useQueryClient();
      //   const deleteRoom = useMutation(
      // trpc.user.deleteUser.mutationOptions({
      //   onSuccess: async () => {
      //     await queryClient.invalidateQueries(trpc.user.get.queryOptions());
      //     toast.success("Room deleted successfully");
      //   },
      //   onError: (error) => {
      //     toast.error(`Error deleting room: ${error.message}`);
      //   }
      // })
      //   );

      const handleDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const ok = await confirm();

        if (!ok) return;
      };
      return (
        <>
          {/* <ConfirmDialog /> */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
              <div className=" flex">
                <EllipsisVertical className="size-5 flex-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Manage Room</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => handleDelete(e)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Link href={`/dashboard/users/${row.original.id}`}>
                  View Detail's
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
