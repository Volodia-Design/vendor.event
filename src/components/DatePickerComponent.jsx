import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { enUS } from "date-fns/locale";
import { cn } from "../utils";
import { Button } from "./ui/button";
import { DayPicker } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

export function DatePickerComponent({
  className,
  label,
  icon,
  value,
  onChange,
  ...props
}) {
  const [date, setDate] = React.useState(null);
  const [placeholder, setPlaceholder] = React.useState(null);
  const [month, setMonth] = React.useState(new Date());

  React.useEffect(() => {
    setPlaceholder({ from: new Date(), to: addDays(new Date(), 7) });
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

  React.useEffect(() => {
    if (value && date && (value.from !== date.from || value.to !== date.to)) {
      setDate(value);
    }
  }, [value, date]);

  const getFormattedDate = (dateObj) => {
    if (!dateObj) return "";
    const { from, to } = dateObj;
    if (from && to) {
      return `${format(from, "dd LLL, y")} - ${format(to, "dd LLL, y")}`;
    } else if (from) {
      return format(from, "LLL dd, y");
    }
    return "";
  };

  const handlePrevMonth = () => {
    setMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  // Custom modifier to style weekends
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

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
                {date ? (
                  <span>{getFormattedDate(date)}</span>
                ) : (
                  <span className="text-black-200">
                    {getFormattedDate(placeholder)}
                  </span>
                )}
              </div>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50 bg-white shadow-lg" align="start">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="font-medium">
              {format(month, 'MMMM yyyy')}
            </div>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth} className="p-1">
                <img 
                  src="/Images/ComponentIcons/SelectArrow.svg" 
                  alt="Previous" 
                  className="transform rotate-180" 
                  width={16} 
                  height={16} 
                />
              </button>
              <button onClick={handleNextMonth} className="p-1">
                <img 
                  src="/Images/ComponentIcons/SelectArrow.svg" 
                  alt="Next" 
                  width={16} 
                  height={16} 
                />
              </button>
            </div>
          </div>
          <DayPicker
            mode="range"
            month={month}
            onMonthChange={setMonth}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            locale={enUS}
            showOutsideDays={false}
            weekStartsOn={1} 
            modifiers={{ weekend: isWeekend }}
            classNames={{
              months: "flex flex-col space-y-4",
              month: "w-full",
              weekdays: "text-primary-500",
              nav: "hidden",
              month_caption: "hidden",
              caption: "hidden", 
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