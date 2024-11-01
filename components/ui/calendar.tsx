"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import "react-day-picker/dist/style.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className="p-3"
      classNames={{
        root: "w-full",
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "relative flex justify-center items-center h-10",
        caption_label: "font-medium text-sm",
        nav: "flex items-center gap-1",
        nav_button: "inline-flex items-center justify-center rounded-md text-sm font-medium h-7 w-7 bg-transparent p-0 hover:bg-accent",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7",
        head_cell: "text-sm font-medium text-center text-muted-foreground p-2",
        row: "grid grid-cols-7 mt-2",
        cell: "text-center text-sm relative p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day: "inline-flex items-center justify-center rounded-md w-8 h-8 p-0 font-normal hover:bg-accent hover:text-accent-foreground aria-selected:opacity-100",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}

export { Calendar }