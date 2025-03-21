"use client"

import { useState, useEffect } from "react"
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay } from "date-fns"
import { fetchSquads, fetchSquadMembers, fetchStandupHosting, fetchIncidentRotation, type Squad, type SquadMember, type StandupHosting, type IncidentRotation } from "@/lib/api"
import { Skeleton } from '@/components/ui/skeleton'
import { StandupHeader } from "@/components/standup/header"
import { TimelineView } from "@/components/standup/timeline-view"
import { CalendarView } from "@/components/standup/calendar-view"
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

  const monthDays = getDaysInMonth(currentDate)

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
          <TimelineView
            currentTeam={currentTeam}
            getHostForDateFromAPI={getHostForDateFromAPI}
            getIncidentRespondersFromAPI={getIncidentRespondersFromAPI}
            visibleDays={visibleDays}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarView
            currentTeam={currentTeam}
            currentDate={currentDate}
            monthDays={monthDays}
            getHostForDateFromAPI={getHostForDateFromAPI}
            getIncidentRespondersFromAPI={getIncidentRespondersFromAPI}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        )}

        <TeamMembers squad={currentTeam} />
      </div>
    </div>
  )
}

