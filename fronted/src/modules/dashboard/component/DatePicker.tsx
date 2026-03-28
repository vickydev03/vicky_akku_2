// "use client";

// import * as React from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent } from "@/components/ui/card";
// import { addDays, format } from "date-fns";
// import { type DateRange } from "react-day-picker";

// export function CalendarRange() {

//   const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
//     from: filters.startDate ? new Date(filters.startDate) : undefined,
//     to: filters.endDate ? new Date(filters.endDate) : undefined,
//   });

//   const handleSelect = (range: DateRange | undefined) => {
//     setDateRange(range);

//     if (!range?.from) {
//       // clear filters if nothing selected
//       setFilters({
//         startDate: "",
//         endDate: "",
//         page: 1, // reset pagination
//       });
//       return;
//     }

//     setFilters({
//       startDate: format(range.from, "yyyy-MM-dd"),
//       endDate: range.to ? format(range.to, "yyyy-MM-dd") : "",
//       page: 1, // reset page when filtering
//     });
//   };

//   return (
//     <Card className="mx-auto w-fit p-0">
//       <CardContent className="p-0">
//         <Calendar
//           mode="range"
//           defaultMonth={dateRange?.from}
//           selected={dateRange}
//           onSelect={handleSelect}
//           numberOfMonths={2}
//         //   disabled={(date) =>
//         //     date > new Date() || date < new Date("1900-01-01")
//         //   }
//         />
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { useRegularClassesFilters } from "@/modules/regular-classes/hooks/hook/useRegularClasses";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

export function DatePickerWithRange() {
  const [filters, setFilters] = useRegularClassesFilters();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  });

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);

    if (!range?.from) {
      // clear filters if nothing selected
      setFilters({
        startDate: "",
        endDate: "",
        page: 1, // reset pagination
      });
      return;
    }

    setFilters({
      startDate: format(range.from, "yyyy-MM-dd"),
      endDate: range.to ? format(range.to, "yyyy-MM-dd") : "",
      page: 1, // reset page when filtering
    });
  };

  return (
    <Field className="mx-auto w-60">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
