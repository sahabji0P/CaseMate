"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CalendarWidgetProps {
  fullSize?: boolean
}

export function CalendarWidget({ fullSize = false }: CalendarWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Sample events data
  const events = [
    { date: new Date(2025, 3, 28), title: "Court Hearing", type: "court" },
    { date: new Date(2025, 3, 30), title: "Document Deadline", type: "deadline" },
    { date: new Date(2025, 4, 5), title: "Client Meeting", type: "meeting" },
    { date: new Date(2025, 4, 10), title: "Filing Deadline", type: "deadline" },
    { date: new Date(2025, 4, 15), title: "Court Appearance", type: "court" },
  ]

  // Filter events for the selected date
  const selectedDateEvents = events.filter((event) => date && event.date.toDateString() === date.toDateString())

  return (
    <div className={cn("space-y-4", fullSize && "h-full")}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        components={{
          DayContent: (props) => {
            const date = props.date
            const hasEvent = events.some((event) => event.date.toDateString() === date.toDateString())

            return (
              <div className="relative h-9 w-9 p-0 font-normal aria-selected:opacity-100">
                <div
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-full",
                    hasEvent && "font-semibold",
                  )}
                >
                  {props.date.getDate()}
                </div>
                {hasEvent && (
                  <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
                )}
              </div>
            )
          },
        }}
      />

      {selectedDateEvents.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Events for {date?.toLocaleDateString()}</h3>
          <div className="space-y-2">
            {selectedDateEvents.map((event, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Badge
                      variant={
                        event.type === "court" ? "default" : event.type === "deadline" ? "destructive" : "outline"
                      }
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {fullSize && selectedDateEvents.length === 0 && (
        <div className="flex h-40 items-center justify-center border rounded-md">
          <p className="text-muted-foreground">No events for this date</p>
        </div>
      )}
    </div>
  )
}
