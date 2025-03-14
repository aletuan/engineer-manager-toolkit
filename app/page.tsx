"use client"

import { useState, useEffect } from "react"
import { addDays, format, isSameDay, isWeekend, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Users, Calendar, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { vietnameseHolidays } from "@/lib/holidays"
import { getHostForDate } from "@/lib/rotation"
import { cn } from "@/lib/utils"

export default function StandupCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [visibleDays, setVisibleDays] = useState<Date[]>([])
  const [activeTab, setActiveTab] = useState<"timeline" | "calendar">("timeline")

  const teamMembers = ["Andy Le", "Daniel Nguyen", "Chicharito Vu", "Phuc Nguyen", "Viet Anh", "Hoa Nguyen", "Tony Dai"]

  // Generate days for the timeline view (next 14 days)
  useEffect(() => {
    const today = new Date()
    const days = Array.from({ length: 14 }, (_, i) => addDays(today, i))
    setVisibleDays(days)
  }, [])

  // Check if a date is a hosting day (not weekend, not holiday)
  const isHostingDay = (date: Date) => {
    if (isWeekend(date)) return false

    const dateString = format(date, "yyyy-MM-dd")
    if (vietnameseHolidays.some((holiday) => holiday.date === dateString)) return false

    return true
  }

  // Get holiday name if the date is a holiday
  const getHolidayName = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    const holiday = vietnameseHolidays.find((h) => h.date === dateString)
    return holiday ? holiday.name : null
  }

  // Get days for the month view
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  // Navigate to previous/next month in calendar view
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentDate(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentDate(nextMonth)
  }

  // Get days for the week view (starting from Monday)
  const getWeekDays = () => {
    const today = new Date()
    const dayOfWeek = getDay(today)
    const startDay = addDays(today, dayOfWeek === 0 ? -6 : 1 - dayOfWeek) // Start from Monday

    return Array.from({ length: 5 }, (_, i) => addDays(startDay, i))
  }

  const today = new Date()
  const monthDays = getDaysInMonth(currentDate)
  const weekDays = getWeekDays()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Lịch Hosting Standup</h1>
                <p className="text-gray-500">Thứ Hai - Thứ Sáu (trừ ngày lễ)</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={activeTab === "timeline" ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab("timeline")}
              >
                <Users className="h-4 w-4" />
                <span>Lịch Host</span>
              </Button>
              <Button
                variant={activeTab === "calendar" ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab("calendar")}
              >
                <Calendar className="h-4 w-4" />
                <span>Lịch Tháng</span>
              </Button>
            </div>
          </div>

          {/* Today's host */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{format(today, "EEEE, dd/MM/yyyy", { locale: vi })}</div>
                <div className="font-bold text-lg">
                  {isHostingDay(today)
                    ? `Host hôm nay: ${getHostForDate(today, teamMembers)}`
                    : getHolidayName(today)
                      ? `Hôm nay là ${getHolidayName(today)} - Không có standup`
                      : "Hôm nay là cuối tuần - Không có standup"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        {activeTab === "timeline" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Lịch Trình Host Standup</h2>

            <div className="space-y-4">
              {visibleDays.map((day, index) => {
                const isToday = isSameDay(day, today)
                const holidayName = getHolidayName(day)
                const isHostDay = isHostingDay(day)
                const host = isHostDay ? getHostForDate(day, teamMembers) : null

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center border-l-4 p-4 rounded-r-lg",
                      isToday ? "border-primary bg-primary/5" : "border-gray-200",
                      !isHostDay && "opacity-70",
                    )}
                  >
                    <div className="w-24 text-sm">
                      <div className={cn("font-medium", isToday && "text-primary")}>
                        {format(day, "EEEE", { locale: vi })}
                      </div>
                      <div className="text-gray-500">{format(day, "dd/MM/yyyy", { locale: vi })}</div>
                    </div>

                    <div className="flex-1 ml-6">
                      {holidayName ? (
                        <div className="text-red-500">
                          <span className="font-medium">{holidayName}</span>
                          <span className="text-sm ml-2">- Không có standup</span>
                        </div>
                      ) : isWeekend(day) ? (
                        <div className="text-gray-500">Cuối tuần - Không có standup</div>
                      ) : host ? (
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm",
                              isToday ? "bg-primary" : "bg-gray-600",
                            )}
                          >
                            {host
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </div>
                          <span className={cn("ml-3 font-medium", isToday && "text-primary")}>{host}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{format(currentDate, "MMMM yyyy", { locale: vi })}</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day names */}
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, i) => (
                <div key={i} className="text-center font-medium p-2 text-gray-500">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: getDay(monthDays[0]) }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 h-24 bg-gray-50 rounded-md"></div>
              ))}

              {/* Calendar days */}
              {monthDays.map((day, i) => {
                const isToday = isSameDay(day, today)
                const holidayName = getHolidayName(day)
                const isHostDay = isHostingDay(day)
                const host = isHostDay ? getHostForDate(day, teamMembers) : null

                return (
                  <div
                    key={i}
                    className={cn(
                      "p-2 h-24 rounded-md border overflow-hidden",
                      isToday ? "border-primary bg-primary/5" : "border-gray-100",
                      isWeekend(day) && "bg-gray-50",
                    )}
                  >
                    <div className={cn("text-right mb-1", isToday && "font-bold text-primary")}>{format(day, "d")}</div>

                    {holidayName && (
                      <div className="text-xs text-red-500 truncate" title={holidayName}>
                        {holidayName}
                      </div>
                    )}

                    {host && (
                      <div className="mt-1 bg-gray-100 rounded p-1 text-xs truncate" title={host}>
                        {host}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* This week's hosts */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-medium mb-4">Host tuần này:</h3>
              <div className="grid grid-cols-5 gap-2">
                {weekDays.map((day, i) => {
                  const isToday = isSameDay(day, today)
                  const isHostDay = isHostingDay(day)
                  const host = isHostDay ? getHostForDate(day, teamMembers) : null
                  const holidayName = getHolidayName(day)

                  return (
                    <Card key={i} className={cn("overflow-hidden", isToday && "border-primary")}>
                      <div className={cn("p-2 text-center text-sm", isToday ? "bg-primary text-white" : "bg-gray-100")}>
                        {format(day, "EEEE", { locale: vi })}
                      </div>
                      <CardContent className="p-3 text-center">
                        {holidayName ? (
                          <div className="text-xs text-red-500">{holidayName}</div>
                        ) : host ? (
                          <div className="font-medium">{host}</div>
                        ) : (
                          <div className="text-gray-500 text-sm">Không có standup</div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Team members */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Thành viên Team</h2>
          <div className="flex flex-wrap gap-3">
            {teamMembers.map((member, index) => {
              const isHostingToday = isHostingDay(today) && getHostForDate(today, teamMembers) === member

              return (
                <div
                  key={index}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    isHostingToday ? "bg-primary text-white" : "bg-gray-100 text-gray-700",
                  )}
                >
                  {member}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

