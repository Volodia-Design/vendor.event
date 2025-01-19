"use client"
import * as React from "react"
import Image from "next/image"
import { parse } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TimePicker({
  className,
  label,
  icon,
  value,
  onChange,
  step = 30,
  ...props
}) {
  // Parse the initial value string into from/to object
  const parseTimeRange = (timeString) => {
    if (!timeString) return { from: "10:00 AM", to: "5:00 PM" }
    const [from, to] = timeString.split(" - ")
    return { from, to }
  }

  const [timeRange, setTimeRange] = React.useState(parseTimeRange(value))

  const generateTimeOptions = () => {
    const times = []
    const periods = ["AM", "PM"]

    periods.forEach(period => {
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute = 0; minute < 60; minute += step) {
          const formattedHour = hour.toString().padStart(2, "0")
          const formattedMinute = minute.toString().padStart(2, "0")
          times.push(`${formattedHour}:${formattedMinute} ${period}`)
        }
      }
    })

    return times
  }

  const compareTime = (time1, time2) => {
    if (!time1 || !time2) return 0
    
    try {
      const date1 = parse(time1, "hh:mm aa", new Date())
      const date2 = parse(time2, "hh:mm aa", new Date())
      return date1.getTime() - date2.getTime()
    } catch (error) {
      return 0
    }
  }

  const handleTimeChange = (type, newTime) => {
    const updatedRange = {
      ...timeRange,
      [type]: newTime,
    }
    setTimeRange(updatedRange)
    
    // Call onChange with formatted string
    if (onChange) {
      const formattedTime = `${updatedRange.from} - ${updatedRange.to}`
      onChange(formattedTime)
    }
  }

  React.useEffect(() => {
    const newTimeRange = parseTimeRange(value)
    if (newTimeRange.from !== timeRange.from || newTimeRange.to !== timeRange.to) {
      setTimeRange(newTimeRange)
    }
  }, [value])

  return (
    <div className={className}>
      {label && (
        <label className="text-text4Medium text-white">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            {icon && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                <Image src={icon} alt="icon" width={18} height={18} />
              </div>
            )}
        <Button
  variant={"outline"}
  className={cn(
    "w-full justify-start text-left font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 text-black border border-black",
    "inputSelectStyle",
    icon ? "pl-8" : "px-3",
    !timeRange && "text-muted-foreground"
  )}
>

              <div className="flex items-center">
                {timeRange?.from && timeRange?.to ? (
                  `${timeRange.from} - ${timeRange.to}`
                ) : (
                  <span>Select time</span>
                )}
              </div>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">From</span>
              <Select
                value={timeRange.from}
                onValueChange={(value) => handleTimeChange("from", value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map((time) => (
                    <SelectItem key={`from-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">To</span>
              <Select
                value={timeRange.to}
                onValueChange={(value) => handleTimeChange("to", value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions()
                    .filter((time) => !timeRange.from || compareTime(time, timeRange.from) > 0)
                    .map((time) => (
                      <SelectItem key={`to-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}