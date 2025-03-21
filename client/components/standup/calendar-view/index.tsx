"use client"

import { format, getDay } from "date-fns"
import { vi } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarGrid } from "./calendar-grid"
import type { Squad, SquadMember } from "@/lib/api"

interface CalendarViewProps {
  currentTeam: Squad
  currentDate: Date
  monthDays: Date[]
  getHostForDateFromAPI: (date: Date) => SquadMember | null
  getIncidentRespondersFromAPI: (date: Date) => {
    primary: SquadMember | null
    secondary: SquadMember | null
  }
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function CalendarView({
  currentTeam,
  currentDate,
  monthDays,
  getHostForDateFromAPI,
  getIncidentRespondersFromAPI,
  onPrevMonth,
  onNextMonth
}: CalendarViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {format(currentDate, "'Tháng' MM 'năm' yyyy", { locale: vi })}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CalendarGrid
        monthDays={monthDays}
        currentTeam={currentTeam}
        getHostForDateFromAPI={getHostForDateFromAPI}
        getIncidentRespondersFromAPI={getIncidentRespondersFromAPI}
      />
    </div>
  )
} 