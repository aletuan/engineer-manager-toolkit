"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { isWeekend } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { SquadMember } from "@/lib/api"

interface TimelineDayProps {
  day: Date
  isToday: boolean
  isHostDay: boolean
  holidayName: string | null
  host: SquadMember | null
  dayPrimary: SquadMember | null
  daySecondary: SquadMember | null
  hasIncidentRoster: boolean
}

export function TimelineDay({
  day,
  isToday,
  isHostDay,
  holidayName,
  host,
  dayPrimary,
  daySecondary,
  hasIncidentRoster
}: TimelineDayProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center border-l-4 p-4 rounded-r-lg ${
        isToday ? "border-primary bg-primary/5" : "border-gray-200"
      } ${!isHostDay && "opacity-80"}`}
    >
      <div className="w-24 text-sm mb-2 sm:mb-0">
        <div className={`font-medium ${isToday && "text-primary"}`}>
          {format(day, "EEEE", { locale: vi })}
        </div>
        <div className="text-gray-500">{format(day, "dd/MM/yyyy", { locale: vi })}</div>
      </div>

      <div className="flex-1 ml-0 sm:ml-6">
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
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                isToday ? "bg-primary" : "bg-gray-600"
              }`}
            >
              {host.fullName.split(" ").map((part) => part[0]).join("")}
            </div>
            <Link 
              href={`/members/${host.id}`}
              className={`ml-3 font-medium hover:text-primary hover:underline ${
                isToday && "text-primary"
              }`}
            >
              {host.fullName}
            </Link>
          </div>
        ) : null}
      </div>

      {/* Only show incident responders for Team Sonic */}
      {hasIncidentRoster && (
        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={dayPrimary ? `/members/${dayPrimary.id}` : "#"}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    <span className="font-medium">P:</span>{" "}
                    {dayPrimary ? (
                      <span className="hover:text-blue-600">
                        {dayPrimary.fullName}
                      </span>
                    ) : "Không có primary"}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Primary Incident Responder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={daySecondary ? `/members/${daySecondary.id}` : "#"}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    <span className="font-medium">S:</span>{" "}
                    {daySecondary ? (
                      <span className="hover:text-purple-600">
                        {daySecondary.fullName}
                      </span>
                    ) : "Không có secondary"}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Secondary Incident Responder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
} 