"use client"

import { format, startOfDay } from "date-fns"
import { vi } from "date-fns/locale"
import {
  CalendarIcon,
  Users,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Target,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Squad, SquadMember } from "@/lib/api"

interface HeaderProps {
  activeTab: "timeline" | "calendar"
  setActiveTab: (tab: "timeline" | "calendar") => void
  squads: Squad[]
  activeTeam: string
  setActiveTeam: (teamId: string) => void
  currentTeam: {
    name: string
    hasIncidentRoster: boolean
  }
  isHostingDay: (date: Date) => boolean
  getHolidayName: (date: Date) => string | null
  getHostForDateFromAPI: (date: Date) => SquadMember | null
  getIncidentRespondersFromAPI: (date: Date) => {
    primary: SquadMember | null
    secondary: SquadMember | null
  }
  getSprintDates: (date: Date) => {
    start: Date
    end: Date
    sprintNumber: number
  }
}

export function StandupHeader({
  activeTab,
  setActiveTab,
  squads,
  activeTeam,
  setActiveTeam,
  currentTeam,
  isHostingDay,
  getHolidayName,
  getHostForDateFromAPI,
  getIncidentRespondersFromAPI,
  getSprintDates,
}: HeaderProps) {
  const today = startOfDay(new Date())
  const { primary, secondary } = currentTeam.hasIncidentRoster 
    ? getIncidentRespondersFromAPI(today) 
    : { primary: null, secondary: null }
  const sprintDates = getSprintDates(today)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-3 rounded-full">
            <CalendarIcon className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Lịch Stand-up</h1>
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
            <span>Lịch Stand-up</span>
          </Button>
          <Button
            variant={activeTab === "calendar" ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar className="h-4 w-4" />
            <span>Lịch Tháng</span>
          </Button>
          <Link href="/members">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Thành Viên</span>
            </Button>
          </Link>
          <Link href="/focus">
            <Button variant="outline" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Focus</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Team selector */}
      <div className="mt-6 mb-4">
        <Tabs value={activeTeam} onValueChange={setActiveTeam}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            {squads.map(squad => (
              <TabsTrigger key={squad.id} value={squad.id}>
                {squad.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Today's info */}
      <div className={`mt-4 grid grid-cols-1 ${currentTeam.hasIncidentRoster ? "md:grid-cols-2" : ""} gap-4`}>
        {/* Standup host */}
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">{format(today, "EEEE, dd/MM/yyyy", { locale: vi })}</div>
              <div className="font-bold text-lg">
                {isHostingDay(today)
                  ? (() => {
                      const host = getHostForDateFromAPI(today)
                      return host ? (
                        <>
                          Host hôm nay:{" "}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                          >
                            <Link href={`/members/${host.id}`}>
                              <Badge variant="outline" className="bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 transition-colors">
                                {host.fullName}
                              </Badge>
                            </Link>
                          </motion.div>
                        </>
                      ) : "Không có host"
                    })()
                  : getHolidayName(today)
                    ? `Hôm nay là ${getHolidayName(today)} - Không có standup`
                    : "Hôm nay là cuối tuần - Không có standup"}
              </div>
            </div>
          </div>
        </div>

        {/* Incident responders - only for Team Sonic */}
        {currentTeam.hasIncidentRoster && (
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <ShieldAlert className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  Sprint {sprintDates.sprintNumber}: {format(sprintDates.start, "dd/MM")} - {format(sprintDates.end, "dd/MM")}
                </div>
                <div className="font-bold text-lg flex flex-wrap items-center gap-2">
                  <span>Trực Incident:</span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {primary ? (
                      <Link href={`/members/${primary.id}`}>
                        <Badge variant="outline" className="bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 transition-colors">
                          Primary: {primary.fullName}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge variant="outline" className="bg-gray-200 text-gray-800 border-gray-300">
                        Primary: Không có primary
                      </Badge>
                    )}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {secondary ? (
                      <Link href={`/members/${secondary.id}`}>
                        <Badge variant="outline" className="bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 transition-colors">
                          Secondary: {secondary.fullName}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge variant="outline" className="bg-gray-200 text-gray-800 border-gray-300">
                        Secondary: Không có secondary
                      </Badge>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 