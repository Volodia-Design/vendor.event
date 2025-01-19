import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { enUS } from "date-fns/locale";
// import { cn } from "@/lib/utils"
import { cn } from "../utils";
import { Button } from "../components/ui/button";
import { DayPicker } from "react-day-picker"; // Changed from Calendar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { useEffect, useState } from "react";

export function DatePickerComponent({
  className,
  label,
  icon,
  value,
  onChange,
  ...props
}) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    setDate(value || { from: new Date(), to: addDays(new Date(), 7) });
  }, []);

  const handleSelect = (range) => {
    setDate(
      range || {
        from: undefined,
        to: undefined,
      }
    );
    if (onChange) {
      onChange(range);
    }
  };

  useEffect(() => {
    if (value && (value.from !== date.from || value.to !== date.to)) {
      setDate(value);
    }
  }, [value]);

  return (
    <div className={className}>
      {label && <label className="text-text4Medium text-white">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            {icon && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                <img src={icon} alt="icon" width={18} height={18} />
              </div>
            )}
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 text-black border border-black",
                "inputSelectStyle",
                icon ? "pl-8" : "px-3",
                !date && "text-muted-foreground"
              )}
            >
              <div className="flex items-center">
                {!icon && <CalendarIcon className="mr-2 h-4 w-4" />}
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
              </div>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={enUS}
            showOutsideDays={false}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            {...props}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
