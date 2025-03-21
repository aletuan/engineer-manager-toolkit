"use client"

import { useState, useEffect } from "react"
import { format, isSameDay, startOfDay, addDays } from "date-fns"
import { vi } from "date-fns/locale"
import { isWeekend } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"

import { isHostingDay, getHolidayName } from "@/lib/utils/date-helpers"
import { getSprintDates } from "@/lib/utils/sprint-helpers"
import { type Squad, type SquadMember } from "@/lib/api"
import { WeekHosts } from "../week-hosts"
import { SprintHeader } from "./sprint-header"
import { TimelineDay } from "./timeline-day"

interface TimelineViewProps {
  currentTeam: Squad
  getHostForDateFromAPI: (date: Date) => SquadMember | null
  getIncidentRespondersFromAPI: (date: Date) => { 
    primary: SquadMember | null
    secondary: SquadMember | null 
  }
  visibleDays: Date[]
}

export function TimelineView({ 
  currentTeam,
  getHostForDateFromAPI,
  getIncidentRespondersFromAPI,
  visibleDays
}: TimelineViewProps) {
  const today = startOfDay(new Date())

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        Lịch Stand-up {currentTeam.hasIncidentRoster ? "& Trực Incident" : ""}
      </h2>

      <div className="space-y-4">
        {visibleDays.map((day, index) => {
          const isToday = isSameDay(day, today)
          const holidayName = getHolidayName(day)
          const isHostDay = isHostingDay(day)
          const host = isHostDay ? getHostForDateFromAPI(day) : null

          // Only get incident responders for Team Sonic
          const { primary: dayPrimary, secondary: daySecondary } = currentTeam.hasIncidentRoster
            ? getIncidentRespondersFromAPI(day)
            : { primary: null, secondary: null }

          const daySprintDates = getSprintDates(day)
          const isFirstDayOfSprint = isSameDay(day, daySprintDates.start)

          return (
            <div key={index}>
              {isFirstDayOfSprint && (
                <SprintHeader sprintDates={daySprintDates} />
              )}

              <TimelineDay
                day={day}
                isToday={isToday}
                isHostDay={isHostDay}
                holidayName={holidayName}
                host={host}
                dayPrimary={dayPrimary}
                daySecondary={daySecondary}
                hasIncidentRoster={currentTeam.hasIncidentRoster}
              />
            </div>
          )
        })}
      </div>

      <WeekHosts squad={currentTeam} />
    </div>
  )
} 