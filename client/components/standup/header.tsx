"use client"

import { useState, useEffect } from "react"
import { format, startOfDay, getDay } from "date-fns"
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
import { isWeekend } from "date-fns"
import { vietnameseHolidays } from "@/lib/holidays"
import type { Squad, SquadMember, StandupHosting, IncidentRotation } from "@/lib/api"
import { fetchStandupHosting, fetchIncidentRotation } from "@/lib/api"

interface HeaderProps {
  activeTab: "timeline" | "calendar"
  setActiveTab: (tab: "timeline" | "calendar") => void
  squads: Squad[]
  activeTeam: string
  setActiveTeam: (teamId: string) => void
  currentTeam: Squad
}

export function StandupHeader({
  activeTab,
  setActiveTab,
  squads,
  activeTeam,
  setActiveTeam,
  currentTeam,
}: HeaderProps) {
  const [standupHostings, setStandupHostings] = useState<StandupHosting[]>([])
  const [incidentRotations, setIncidentRotations] = useState<IncidentRotation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const today = startOfDay(new Date())

  // Fetch data when currentTeam changes
  useEffect(() => {
    const fetchData = async () => {
      if (!currentTeam.id) return
      setIsLoading(true)
      try {
        const todayStr = format(today, "yyyy-MM-dd")

        const [hostings, rotations] = await Promise.all([
          fetchStandupHosting(currentTeam.id, todayStr, todayStr),
          currentTeam.hasIncidentRoster ? fetchIncidentRotation(currentTeam.id, todayStr, todayStr) : Promise.resolve([])
        ])

        setStandupHostings(hostings)
        setIncidentRotations(rotations)
      } catch (error) {
        console.error('Error fetching header data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [currentTeam.id, currentTeam.hasIncidentRoster])

  // Helper functions
  const isHostingDay = (date: Date) => {
    if (isWeekend(date)) return false
    const dateString = format(date, "yyyy-MM-dd")
    return !vietnameseHolidays.some((holiday) => holiday.date === dateString)
  }

  const getHolidayName = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    const holiday = vietnameseHolidays.find((h) => h.date === dateString)
    return holiday ? holiday.name : null
  }

  const getHostForDate = (date: Date): SquadMember | null => {
    const dateStr = format(date, "yyyy-MM-dd")
    const hosting = standupHostings.find(h => format(new Date(h.date), "yyyy-MM-dd") === dateStr)
    if (!hosting?.member) return null
    
    // Convert API member type to SquadMember type
    return {
      id: hosting.member.id,
      fullName: hosting.member.fullName,
      email: hosting.member.email,
      position: hosting.member.position,
      avatarUrl: hosting.member.avatarUrl,
      squadId: currentTeam.id,
      squadName: currentTeam.name,
      pid: hosting.member.id
    }
  }

  const getIncidentResponders = (date: Date): { primary: SquadMember | null, secondary: SquadMember | null } => {
    const dateStr = format(date, "yyyy-MM-dd")
    const rotation = incidentRotations.find(r => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      const checkDate = new Date(dateStr)
      return checkDate >= start && checkDate <= end
    })

    if (!rotation) return { primary: null, secondary: null }

    // Check for swaps
    const swap = rotation.swaps?.find(s => 
      format(new Date(s.swapDate), "yyyy-MM-dd") === dateStr && 
      s.status === 'APPROVED'
    )

    // Convert API member type to SquadMember type
    const convertToSquadMember = (member: { 
      id: string;
      fullName: string;
      email: string;
      position: string;
      avatarUrl?: string;
    } | null): SquadMember | null => {
      if (!member) return null
      return {
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        position: member.position,
        avatarUrl: member.avatarUrl,
        squadId: currentTeam.id,
        squadName: currentTeam.name,
        pid: member.id
      }
    }

    let primary = convertToSquadMember(rotation.primaryMember)
    let secondary = convertToSquadMember(rotation.secondaryMember)

    if (swap) {
      if (swap.requesterId === rotation.primaryMemberId) {
        primary = convertToSquadMember(swap.accepter)
      } else if (swap.requesterId === rotation.secondaryMemberId) {
        secondary = convertToSquadMember(swap.accepter)
      }
    }

    return { primary, secondary }
  }

  // Get sprint dates (start and end) for a given date
  const getSprintDates = (date: Date) => {
    // Find the start of the financial year
    const financialYearStart = new Date(date.getFullYear(), 9, 1); // Month is 0-based, so 9 is October
    if (date < financialYearStart) {
      financialYearStart.setFullYear(financialYearStart.getFullYear() - 1);
    }

    // Find the first Wednesday after financial year start
    let firstSprintStart = new Date(financialYearStart);
    while (getDay(firstSprintStart) !== 3) { // 3 is Wednesday
      firstSprintStart.setDate(firstSprintStart.getDate() + 1);
    }

    // Calculate days since first sprint start
    const daysSinceStart = Math.floor((date.getTime() - firstSprintStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate sprint number and days into current sprint
    const sprintNumber = Math.floor(daysSinceStart / 14) + 1;
    const daysToAdd = (sprintNumber - 1) * 14;

    // Calculate current sprint start and end dates
    const sprintStart = new Date(firstSprintStart);
    sprintStart.setDate(firstSprintStart.getDate() + daysToAdd);
    const sprintEnd = new Date(sprintStart);
    sprintEnd.setDate(sprintStart.getDate() + 13);

    return { start: sprintStart, end: sprintEnd, sprintNumber }
  }

  const { primary, secondary } = currentTeam.hasIncidentRoster 
    ? getIncidentResponders(today) 
    : { primary: null, secondary: null }
  const sprintDates = getSprintDates(today)

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="h-10 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="mt-6 mb-4">
          <div className="h-10 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

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
                      const host = getHostForDate(today)
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