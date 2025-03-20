// import * as React from "react";
// import { addDays, format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { enUS } from "date-fns/locale";
// import { cn } from "../utils";
// import { Button } from "./ui/button";
// import { DayPicker } from "react-day-picker";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// export function DatePickerComponent({
//   className,
//   label,
//   icon,
//   value,
//   onChange,
//   ...props
// }) {
//   const [date, setDate] = React.useState(null);
//   const [placeholder, setPlaceholder] = React.useState(null);
//   const [month, setMonth] = React.useState(new Date());

//   React.useEffect(() => {
//     setPlaceholder({ from: new Date(), to: addDays(new Date(), 7) });
//   }, []);

//   const handleSelect = (range) => {
//     setDate(
//       range || {
//         from: undefined,
//         to: undefined,
//       }
//     );
//     if (onChange) {
//       onChange(range);
//     }
//   };

//   React.useEffect(() => {
//     if (value && date && (value.from !== date.from || value.to !== date.to)) {
//       setDate(value);
//     }
//   }, [value, date]);

//   const getFormattedDate = (dateObj) => {
//     if (!dateObj) return "";
//     const { from, to } = dateObj;
//     if (from && to) {
//       return `${format(from, "dd LLL, y")} - ${format(to, "dd LLL, y")}`;
//     } else if (from) {
//       return format(from, "LLL dd, y");
//     }
//     return "";
//   };

//   const handlePrevMonth = () => {
//     setMonth((prev) => {
//       const newMonth = new Date(prev);
//       newMonth.setMonth(newMonth.getMonth() - 1);
//       return newMonth;
//     });
//   };

//   const handleNextMonth = () => {
//     setMonth((prev) => {
//       const newMonth = new Date(prev);
//       newMonth.setMonth(newMonth.getMonth() + 1);
//       return newMonth;
//     });
//   };

//   // Custom modifier to style weekends
//   const isWeekend = (date) => {
//     const day = date.getDay();
//     return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
//   };

//   return (
//     <div className={className}>
//       {label && <label className='text-text4Medium text-white'>{label}</label>}
//       <Popover>
//         <PopoverTrigger asChild>
//           <div className='relative'>
//             {icon && (
//               <div className='absolute left-2 top-1/2 transform -translate-y-1/2 z-10'>
//                 <img src={icon} alt='icon' width={18} height={18} />
//               </div>
//             )}
//             <Button
//               variant={"outline"}
//               className={cn(
//                 "w-full justify-start text-left font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 text-black border border-black",
//                 "inputSelectStyle",
//                 icon ? "pl-8" : "px-3",
//                 !date && "text-muted-foreground"
//               )}
//             >
//               <div className='flex items-center'>
//                 {!icon && <CalendarIcon className='mr-2 h-4 w-4' />}
//                 {date ? (
//                   <span>{getFormattedDate(date)}</span>
//                 ) : (
//                   <span className='text-black-200'>
//                     {getFormattedDate(placeholder)}
//                   </span>
//                 )}
//               </div>
//             </Button>
//           </div>
//         </PopoverTrigger>
//         <PopoverContent
//           className='w-auto p-0 z-50 bg-white shadow-lg'
//           align='start'
//         >
//           <div className='flex items-center justify-between px-4 py-3'>
//             <div className='text-black-400 text-text1Medium'>
//               {format(month, "MMMM yyyy")}
//             </div>
//             <div className='flex space-x-2'>
//               <button
//                 onClick={handlePrevMonth}
//                 className='p-1 border border-black-100 rounded-sm'
//               >
//                 <img
//                   src='/Images/ComponentIcons/CalendarArrow.svg'
//                   alt='Previous'
//                   width={10}
//                   height={16}
//                 />
//               </button>
//               <button
//                 onClick={handleNextMonth}
//                 className='p-1 border border-black-100 rounded-sm'
//               >
//                 <img
//                   src='/Images/ComponentIcons/CalendarArrow.svg'
//                   alt='Next'
//                   className='transform rotate-180'
//                   width={10}
//                   height={16}
//                 />
//               </button>
//             </div>
//           </div>
//           <DayPicker
//             mode='range'
//             month={month}
//             onMonthChange={setMonth}
//             selected={date}
//             onSelect={handleSelect}
//             numberOfMonths={1}
//             locale={enUS}
//             showOutsideDays={true}
//             weekStartsOn={1}
//             modifiers={{ weekend: isWeekend }}
//             modifiersStyles={{
//               weekend: { backgroundColor: "rgb(209, 213, 219)" }, // gray-300
//             }}
//             classNames={{
//               months: "flex flex-col",
//               month: "w-full",
//               weekday: "text-text3 text-black-500",
//               month_grid: "w-full",
//               nav: "hidden",
//               month_caption: "hidden",
//               caption: "hidden",
//               table: "border-collapse border-separate border-spacing-4", // Increased spacing
//               head_row: "flex",
//               head_cell:
//                 "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
//               row: "flex w-full mt-2 gap-4", // Increased gap between days
//               cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//               day: "aria-selected:opacity-100 text-center align-middle h-9 w-9 p-0 text-text3 text-black-300 rounded-md",
//               day_selected:
//                 "bg-secondary-700 text-white hover:bg-secondary-700 hover:text-white focus:bg-secondary-700 focus:text-white",
//               day_today: "bg-secondary-700 text-white",
//               day_outside: "text-muted-foreground opacity-50",
//               day_disabled: "text-muted-foreground opacity-50",
//               day_range_middle:
//                 "aria-selected:bg-accent aria-selected:text-accent-foreground",
//               day_hidden: "invisible",
//             }}
//             {...props}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }



import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { enUS } from "date-fns/locale";
import { cn } from "../utils";
import { Button } from "./ui/button";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
    setMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setMonth((prev) => {
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
      {label && <label className='text-text4Medium text-white'>{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <div className='relative'>
            {icon && (
              <div className='absolute left-2 top-1/2 transform -translate-y-1/2 z-10'>
                <img src={icon} alt='icon' width={18} height={18} />
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
              <div className='flex items-center'>
                {!icon && <CalendarIcon className='mr-2 h-4 w-4' />}
                {date ? (
                  <span>{getFormattedDate(date)}</span>
                ) : (
                  <span className='text-black-200'>
                    {getFormattedDate(placeholder)}
                  </span>
                )}
              </div>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0 z-50 bg-white shadow-lg'
          align='start'
        >
          <div className='flex items-center justify-between px-4 py-3'>
            <div className='text-black-400 text-text1Medium'>
              {format(month, "MMMM yyyy")}
            </div>
            <div className='flex space-x-2'>
              <button
                onClick={handlePrevMonth}
                className='p-1 border border-black-100 rounded-sm'
              >
                <img
                  src='/Images/ComponentIcons/CalendarArrow.svg'
                  alt='Previous'
                  width={10}
                  height={16}
                />
              </button>
              <button
                onClick={handleNextMonth}
                className='p-1 border border-black-100 rounded-sm'
              >
                <img
                  src='/Images/ComponentIcons/CalendarArrow.svg'
                  alt='Next'
                  className='transform rotate-180'
                  width={10}
                  height={16}
                />
              </button>
            </div>
          </div>
          <DayPicker
            mode='range'
            month={month}
            onMonthChange={setMonth}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            locale={enUS}
            showOutsideDays={true}
            weekStartsOn={1}
            modifiers={{ weekend: isWeekend }}
            modifiersStyles={{
              weekend: { backgroundColor: "rgb(209, 213, 219)" },
            }}
            classNames={{
              months: "flex flex-col",
              month: "w-full",
              weekday: "text-text3 text-black-500",
              month_grid: "w-full",
              nav: "hidden",
              month_caption: "hidden",
              caption: "hidden",
              table: "w-full grid grid-rows-7 gap-1",
              head_row: "grid grid-cols-7 gap-1", 
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2 gap-4", 
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "aria-selected:opacity-100 text-center align-middle h-9 w-9 p-0 text-text3 text-black-300 rounded-md",
              day_selected:
                "bg-secondary-700 text-white hover:bg-secondary-700 hover:text-white focus:bg-secondary-700 focus:text-white",
              today: "bg-secondary-700 text-white",
              range_start: "!bg-secondary-700 !text-white",
              range_end: "!bg-secondary-700 !text-white",
              range_middle: "!bg-secondary-700 !text-white",
              week: "grid grid-cols-7 gap-1",
              weekdays: "grid grid-cols-7 gap-1",
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

