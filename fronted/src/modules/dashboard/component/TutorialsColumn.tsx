import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  EllipsisVertical,
  CalendarDays,
  IndianRupee,
  FileText,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getTutorial } from "@/trpc/type";
import Link from "next/link";
import DeleteBox from "./DeleteBox";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTutorialFilters } from "@/modules/tutorials/hook/useTutorials";
import { useTRPC } from "@/trpc/client";

export const TutorialsColumn: ColumnDef<getTutorial>[] = [
  // 🖼️ Thumbnail + Title
  {
    accessorKey: "title",
    header: "Tutorial",
    cell: ({ row }) => {
      const { title, thumbnail, id } = row.original;

      return (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-12 h-12 rounded-lg object-cover border"
          />

          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-sm truncate">{title}</p>
            <p className="text-xs text-muted-foreground truncate">
              ID: {id.slice(0, 8)}...
            </p>
          </div>
        </div>
      );
    },
  },

  // 📝 Description
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm max-w-[250px]">
        <FileText className="size-4 text-muted-foreground shrink-0" />
        <div className="truncate line-clamp-1">
          <div dangerouslySetInnerHTML={{ __html: row.original.description }} />
        </div>
      </div>
    ),
  },

  // 💰 Price
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm font-medium">
        {/* <IndianRupee className="size-4 text-muted-foreground" /> */}₹{" "}
        {row.original.price.toLocaleString("en-IN")}
      </div>
    ),
  },

  // 📅 Created Date
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const formatted = format(new Date(row.original.createdAt), "MMM d, yyyy");

      return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-4" />
          {formatted}
        </div>
      );
    },
  },

  // ⚙️ Actions
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const trpc = useTRPC();
      const queryClient = useQueryClient();

      const [filters, setFilters] = useTutorialFilters();

      const mutate = useMutation(
        trpc.tutorials.tutorialDelete.mutationOptions({
          onSuccess: async () => {
            toast.success("Tutorial Deleted Sucessfully.");
            await queryClient.invalidateQueries(
              trpc.tutorials.getTutorials.queryOptions({ ...filters }),
            );
          },
          onError: () => {
            toast.error("Something went wrong.");
          },
        }),
      );

      // const updateChange = useMutation(
      //   trpc.tutorials.updateTutorial.mutationOptions({
      //     onSuccess: async () => {
      //       toast.success("Tutorial Updated.");
      //       await queryClient.invalidateQueries(
      //         trpc.tutorials.getTutorials.queryOptions({ ...filters }),
      //       );
      //     },
      //     onError: () => {
      //       toast.error("Something went wrong.");
      //     },
      //   }),
      // );

      const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await mutate.mutateAsync({ id: row.original.id });
      };

      // const handleChange= async(e:React.MouseEvent)=>{

      //   e.stopPropagation()

      //   await updateChange.mutateAsync({id:row.original.id,isPublished:!row.original.isPublished})

      // }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="rounded-md p-1 hover:bg-muted transition-colors"
          >
            <EllipsisVertical className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Manage Tutorial</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={`/dashboard/online-tutorials/${row.original.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>



            <DropdownMenuItem>
              <Link
                href={`/dashboard/online-tutorials/${row.original.id}/edit`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
                          <Link
                            href={`/dashboard/online-tutorials/enrollments?productId=${row.original.id}`}
                          >View Student's</Link>
            </DropdownMenuItem>
           
            <DeleteBox
              message="Deleting this class will permanently remove all related enrollment."
              handleDelete={handleDelete}
            />

          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
