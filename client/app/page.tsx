"use client"

import { useState, useEffect } from "react"
import { addDays, format, isSameDay, isWeekend, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfDay } from "date-fns"
import { vi } from "date-fns/locale"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Target,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { vietnameseHolidays } from "@/lib/holidays"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchSquads, fetchSquadMembers, fetchStandupHosting, fetchIncidentRotation, type Squad, type SquadMember, type StandupHosting, type IncidentRotation } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { StandupHeader } from "@/components/standup/header"
import { WeekHosts } from "@/components/standup/week-hosts"
import { TeamMembers } from "@/components/standup/team-members"

export default function StandupCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [visibleDays, setVisibleDays] = useState<Date[]>([])
  const [activeTab, setActiveTab] = useState<"timeline" | "calendar">("timeline")
  const [activeTeam, setActiveTeam] = useState<string>("")
  
  // State for API data
  const [squads, setSquads] = useState<Squad[]>([])
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([])
  const [standupHostings, setStandupHostings] = useState<StandupHosting[]>([])
  const [incidentRotations, setIncidentRotations] = useState<IncidentRotation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get current team data
  const currentTeam = squads.find(squad => squad.id === activeTeam) || {
    id: "",
    name: "",
    code: "",
    hasIncidentRoster: false
  }

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const squadsData = await fetchSquads()
        setSquads(squadsData)
        if (squadsData.length > 0) {
          setActiveTeam(squadsData[0].id)
        }
      } catch (error) {
        console.error('Error fetching squads:', error)
      }
    }
    fetchInitialData()
  }, [])

  // Fetch squad members when active team changes
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!activeTeam) return
      setIsLoading(true)
      try {
        // Calculate date range based on current view
        const today = new Date()
        const startDate = activeTab === "timeline" 
          ? format(today, "yyyy-MM-dd") // For timeline view, start from today
          : format(startOfMonth(currentDate), "yyyy-MM-dd") // For calendar view, start from first day of month
        
        const endDate = activeTab === "timeline"
          ? format(addDays(today, 14), "yyyy-MM-dd") // For timeline view, show next 14 days
          : format(endOfMonth(currentDate), "yyyy-MM-dd") // For calendar view, end at last day of month

        const [members, hostings, rotations] = await Promise.all([
          fetchSquadMembers(activeTeam),
          fetchStandupHosting(activeTeam, startDate, endDate),
          fetchIncidentRotation(activeTeam)
        ])
        setSquadMembers(members)
        setStandupHostings(hostings)
        setIncidentRotations(rotations)
      } catch (error) {
        console.error('Error fetching team data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeamData()
  }, [activeTeam, activeTab, currentDate])

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

  // Get host for a specific date
  const getHostForDateFromAPI = (date: Date): SquadMember | null => {
    const hosting = standupHostings.find(h => format(new Date(h.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    return hosting?.memberId ? squadMembers.find(m => m.id === hosting.memberId) || null : null
  }

  // Get incident responders for a specific date
  const getIncidentRespondersFromAPI = (date: Date): { primary: SquadMember | null, secondary: SquadMember | null } => {
    const rotation = incidentRotations.find(r => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      const checkDate = new Date(format(date, "yyyy-MM-dd"))
      return checkDate >= start && checkDate <= end
    })

    if (!rotation) return { primary: null, secondary: null }

    const primary = rotation.primaryMemberId ? squadMembers.find(m => m.id === rotation.primaryMemberId) || null : null
    const secondary = rotation.secondaryMemberId ? squadMembers.find(m => m.id === rotation.secondaryMemberId) || null : null

    // Check for swaps
    const swap = rotation.swaps?.find(s => format(new Date(s.swapDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") && s.status === 'APPROVED')
    if (swap) {
      if (swap.requesterId === rotation.primaryMemberId) {
        const swappedPrimary = squadMembers.find(m => m.id === swap.accepterId) || null
        return { primary: swappedPrimary, secondary }
      } else if (swap.requesterId === rotation.secondaryMemberId) {
        const swappedSecondary = squadMembers.find(m => m.id === swap.accepterId) || null
        return { primary, secondary: swappedSecondary }
      }
    }

    return { primary, secondary }
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

  // Check if a date is the start of a sprint
  const isSprintStart = (date: Date) => {
    // Sprint starts on Wednesday (day 3)
    if (getDay(date) !== 3) return false;

    // Get sprint dates for this date
    const { start } = getSprintDates(date);
    
    // Check if this date is the start date of the sprint
    return isSameDay(date, start);
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

  const today = startOfDay(new Date())
  const monthDays = getDaysInMonth(currentDate)
  const weekDays = getWeekDays()

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-10 w-[200px] mb-4" />
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <StandupHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          squads={squads}
          activeTeam={activeTeam}
          setActiveTeam={setActiveTeam}
          currentTeam={currentTeam}
        />

        {/* Main content */}
        {activeTab === "timeline" && (
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
                      <div className="bg-gray-200 p-2 rounded-lg mb-2 text-sm font-medium">
                        Sprint {daySprintDates.sprintNumber}: {format(daySprintDates.start, "dd/MM")} - {format(daySprintDates.end, "dd/MM")}
                      </div>
                    )}

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
                      {currentTeam.hasIncidentRoster && (
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
                  </div>
                )
              })}
            </div>

            <WeekHosts squad={currentTeam} />
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {format(currentDate, "'Tháng' MM 'năm' yyyy", { locale: vi })}
              </h2>
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
                <div key={`empty-${i}`} className="p-2 h-28 bg-gray-50 rounded-md"></div>
              ))}

              {/* Calendar days */}
              {monthDays.map((day, i) => {
                const isToday = isSameDay(day, today)
                const holidayName = getHolidayName(day)
                const isHostDay = isHostingDay(day)
                const host = isHostDay ? getHostForDateFromAPI(day) : null

                // Only get incident responders for Team Sonic
                const { primary: dayPrimary, secondary: daySecondary } = currentTeam.hasIncidentRoster
                  ? getIncidentRespondersFromAPI(day)
                  : { primary: null, secondary: null }

                const isSprintStartDay = isSprintStart(day)

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
                    <div className={cn("text-right mb-1", isToday && "font-bold text-primary")}>{format(day, "d")}</div>

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

            <WeekHosts squad={currentTeam} />
          </div>
        )}

        <TeamMembers squad={currentTeam} />
      </div>
    </div>
  )
}

