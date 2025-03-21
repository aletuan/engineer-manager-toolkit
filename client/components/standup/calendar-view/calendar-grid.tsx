"use client"

import { format, isSameDay, startOfDay, getDay, isWeekend } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Squad, SquadMember } from "@/lib/api"
import { isHostingDay, getHolidayName } from "@/lib/utils/date-helpers"
import { getSprintDates, isSprintStart } from "@/lib/utils/sprint-helpers"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  monthDays: Date[]
  currentTeam: Squad
  getHostForDateFromAPI: (date: Date) => SquadMember | null
  getIncidentRespondersFromAPI: (date: Date) => {
    primary: SquadMember | null
    secondary: SquadMember | null
  }
}

export function CalendarGrid({
  monthDays,
  currentTeam,
  getHostForDateFromAPI,
  getIncidentRespondersFromAPI
}: CalendarGridProps) {
  const today = startOfDay(new Date())

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Day names */}
      {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, i) => (
        <div key={i} className="text-center font-medium p-2 text-gray-500">
          {day}
        </div>
      ))}

      {/* Empty cells for days before the first day of month */}
      {Array.from({ length: getDay(monthDays[0]) }).map((_, i) => (
        <div key={`empty-${i}`} className="p-2 h-28 bg-gray-50 rounded-md"></div>
      ))}

      {/* Calendar days */}
      {monthDays.map((day, i) => {
        const isToday = isSameDay(day, today)
        const holidayName = getHolidayName(day)
        const isHostDay = isHostingDay(day)
        const host = isHostDay ? getHostForDateFromAPI(day) : null
        const isSprintStartDay = isSprintStart(day)

        // Only get incident responders for Team Sonic
        const { primary: dayPrimary, secondary: daySecondary } = currentTeam.hasIncidentRoster
          ? getIncidentRespondersFromAPI(day)
          : { primary: null, secondary: null }

        return (
          <div
            key={i}
            className={cn(
              "p-2 h-28 rounded-md border overflow-hidden",
              isToday ? "border-primary bg-primary/5" : "border-gray-100",
              isWeekend(day) && "bg-gray-50",
              isSprintStartDay && "border-gray-400",
            )}
          >
            <div className={cn("text-right mb-1", isToday && "font-bold text-primary")}>
              {format(day, "d")}
            </div>

            {isSprintStartDay && (
              <div className="text-xs bg-gray-200 text-gray-700 rounded px-1 py-0.5 mb-1">
                Sprint {getSprintDates(day).sprintNumber} Start
              </div>
            )}

            {holidayName && (
              <div className="text-xs text-red-500 truncate" title={holidayName}>
                {holidayName}
              </div>
            )}

            {host && (
              <Link href={`/members/${host.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-1 bg-green-100 rounded p-1 text-xs truncate text-green-800 hover:bg-green-200 transition-colors"
                  title={`Host: ${host.fullName}`}
                >
                  <span className="font-medium">H:</span>{" "}
                  <span className="hover:text-green-600">
                    {host.fullName}
                  </span>
                </motion.div>
              </Link>
            )}

            {/* Only show incident responders for Team Sonic */}
            {currentTeam.hasIncidentRoster && (
              <div className="mt-1 flex flex-col gap-1">
                <Link href={dayPrimary ? `/members/${dayPrimary.id}` : "#"}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-100 rounded p-1 text-xs truncate text-blue-800 hover:bg-blue-200 transition-colors"
                    title={`Primary: ${dayPrimary?.fullName || 'Không có primary'}`}
                  >
                    <span className="font-medium">P:</span>{" "}
                    {dayPrimary ? (
                      <span className="hover:text-blue-600">
                        {dayPrimary.fullName}
                      </span>
                    ) : 'Không có primary'}
                  </motion.div>
                </Link>
                <Link href={daySecondary ? `/members/${daySecondary.id}` : "#"}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-100 rounded p-1 text-xs truncate text-purple-800 hover:bg-purple-200 transition-colors"
                    title={`Secondary: ${daySecondary?.fullName || 'Không có secondary'}`}
                  >
                    <span className="font-medium">S:</span>{" "}
                    {daySecondary ? (
                      <span className="hover:text-purple-600">
                        {daySecondary.fullName}
                      </span>
                    ) : 'Không có secondary'}
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 