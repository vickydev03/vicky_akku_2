import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  EllipsisVertical,
  MapPin,
  CalendarDays,
  DollarSign,
  Tag,
  ToggleLeft,
  ToggleRight,
  IndianRupee,
  BookOpen,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getClasses, getSubscribersType } from "@/trpc/type";

// export type SubscriptionRow = z.infer<typeof subscriptionSchema>;

export const SubscribersColumns: ColumnDef<getSubscribersType>[] = [
  // 👤 User Info (Thumbnail + Name + Email)
  {
    accessorKey: "user.name",
    header: "Subscriber",
    cell: ({ row }) => {
      const { name, email, avatar } = row.original.user;
      return (
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0 px-2">
            <p className="font-semibold text-sm truncate max-w-[150px]">
              {name}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {email}
            </p>
          </div>
        </div>
      );
    },
  },

  // 📍 Class Information
  {
    accessorKey: "classId",
    header: "Enrolled Class",
    cell: ({ row }) => {
      console.log(row.original, 565656);
      return (
        <div className="flex items-center gap-2 text-sm font-medium">
          <BookOpen className="size-4 text-primary" />
          <span>
            {row.original.class && row.original?.class.title}
          </span>
        </div>
      );
    },
  },

  // ✅ Status (Calculated from endDate and createdAt)
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const endDate = row.original.class?.endDate;
      // Active if current date is before endDate
      const isActive = endDate ? new Date() < new Date(endDate) : false;

      return isActive ? (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs gap-1 hover:bg-emerald-100">
          <ToggleRight className="size-3" /> Active
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs gap-1 opacity-70">
          <ToggleLeft className="size-3" /> Expired
        </Badge>
      );
    },
  },

  // 📅 Subscription Date
  {
    accessorKey: "createdAt",
    header: "Joined On",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <CalendarDays className="size-4 shrink-0" />
        <span>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</span>
      </div>
    ),
  },

  // ⚙️ Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const sub = row.original;
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="rounded-md p-1 hover:bg-muted transition-colors">
            <EllipsisVertical className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Subscription Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* View User Profile */}
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/users/${sub.userId}`}
                className="cursor-pointer"
              >
                <User className="mr-2 size-4" /> View User Profile
              </Link>
            </DropdownMenuItem>

            {/* View Regular Class */}
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/regular-classes/${sub.classId}`}
                className="cursor-pointer"
              >
                <BookOpen className="mr-2 size-4" /> View Class Details
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="text-destructive focus:text-destructive">
              Cancel Subscription
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
