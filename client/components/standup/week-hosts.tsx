"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { SquadMember } from "@/lib/api"

interface WeekHostsProps {
  weekDays: Date[]
  currentTeam: {
    hasIncidentRoster: boolean
  }
  isHostingDay: (date: Date) => boolean
  getHolidayName: (date: Date) => string | null
  getHostForDateFromAPI: (date: Date) => SquadMember | null
  getIncidentRespondersFromAPI: (date: Date) => {
    primary: SquadMember | null
    secondary: SquadMember | null
  }
}

export function WeekHosts({
  weekDays,
  currentTeam,
  isHostingDay,
  getHolidayName,
  getHostForDateFromAPI,
  getIncidentRespondersFromAPI,
}: WeekHostsProps) {
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="font-medium mb-4">Host tuần này:</h3>
      <div className="grid grid-cols-5 gap-2">
        {weekDays.map((day, i) => {
          const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
          const isHostDay = isHostingDay(day)
          const host = isHostDay ? getHostForDateFromAPI(day) : null
          const holidayName = getHolidayName(day)

          // Only get incident responders for Team Sonic
          const { primary: dayPrimary, secondary: daySecondary } = currentTeam.hasIncidentRoster
            ? getIncidentRespondersFromAPI(day)
            : { primary: null, secondary: null }

          return (
            <Card key={i} className={`overflow-hidden ${isToday ? "border-primary" : ""}`}>
              <div className={`p-2 text-center text-sm ${isToday ? "bg-primary text-white" : "bg-gray-100"}`}>
                {format(day, "EEEE", { locale: vi })}
              </div>
              <CardContent className="p-3 text-center">
                {holidayName ? (
                  <div className="text-xs text-red-500">{holidayName}</div>
                ) : host ? (
                  <Link href={`/members/${host.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="font-medium mb-2 bg-green-100 text-green-800 rounded-full px-2 py-1 hover:bg-green-200 transition-colors"
                    >
                      {host.fullName}
                    </motion.div>
                  </Link>
                ) : (
                  <div className="text-gray-500 text-sm mb-2">Không có standup</div>
                )}

                {/* Only show incident responders for Team Sonic */}
                {currentTeam.hasIncidentRoster && (
                  <div className="text-xs flex flex-col gap-1 mt-2">
                    <Link href={dayPrimary ? `/members/${dayPrimary.id}` : "#"}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 hover:bg-blue-200 transition-colors"
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
                        className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 hover:bg-purple-200 transition-colors"
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
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 