"use client"

import { useState, useEffect, useMemo } from "react"
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay } from "date-fns"
import { fetchSquads, fetchSquadMembers, fetchStandupHosting, fetchIncidentRotation, type Squad, type SquadMember, type StandupHosting, type IncidentRotation } from "@/lib/api"
import { Skeleton } from '@/components/ui/skeleton'
import { StandupHeader } from "@/components/standup/header"
import { TimelineView } from "@/components/standup/timeline-view"
import { CalendarView } from "@/components/standup/calendar-view"
import { TeamMembers } from "@/components/standup/team-members"
import { WeekHosts } from "@/components/standup/week-hosts"

// Interface để lưu trữ dữ liệu theo squad
interface SquadData {
  members: SquadMember[];
  standupHostings: StandupHosting[];
  incidentRotations: IncidentRotation[];
  isLoaded: boolean;
}

export default function StandupCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [visibleDays, setVisibleDays] = useState<Date[]>([])
  const [activeTab, setActiveTab] = useState<"timeline" | "calendar">("timeline")
  const [activeTeam, setActiveTeam] = useState<string>("")
  
  // State for API data
  const [squads, setSquads] = useState<Squad[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  
  // Lưu trữ dữ liệu của tất cả squad
  const [allSquadsData, setAllSquadsData] = useState<Record<string, SquadData>>({})
  
  // Tính toán date ranges dựa trên view hiện tại
  const dateRanges = useMemo(() => {
    const today = new Date()
    const timelineStartDate = format(today, "yyyy-MM-dd")
    const timelineEndDate = format(addDays(today, 14), "yyyy-MM-dd")
    const calendarStartDate = format(startOfMonth(currentDate), "yyyy-MM-dd")
    const calendarEndDate = format(endOfMonth(currentDate), "yyyy-MM-dd")
    
    return {
      timeline: { startDate: timelineStartDate, endDate: timelineEndDate },
      calendar: { startDate: calendarStartDate, endDate: calendarEndDate }
    }
  }, [currentDate])
  
  // Get current team data from cache
  const currentTeam = squads.find(squad => squad.id === activeTeam) || {
    id: "",
    name: "",
    code: "",
    hasIncidentRoster: false
  }
  
  // Lấy dữ liệu của squad hiện tại từ cache
  const currentSquadData = useMemo(() => {
    return allSquadsData[activeTeam] || { 
      members: [],
      standupHostings: [],
      incidentRotations: [],
      isLoaded: false
    };
  }, [activeTeam, allSquadsData]);
  
  // Destructure current squad data for easier access
  const { members: squadMembers, standupHostings, incidentRotations } = currentSquadData;
  
  // Function to load data for a specific squad
  const loadSquadData = async (squad: Squad, dateRange: { startDate: string, endDate: string }) => {
    try {
      // Skip if already loaded
      if (allSquadsData[squad.id]?.isLoaded) {
        return;
      }
      
      const [members, hostings, rotations] = await Promise.all([
        fetchSquadMembers(squad.id),
        fetchStandupHosting(squad.id, dateRange.startDate, dateRange.endDate),
        fetchIncidentRotation(squad.id, dateRange.startDate, dateRange.endDate)
      ]);
      
      setAllSquadsData(prev => ({
        ...prev,
        [squad.id]: {
          members,
          standupHostings: hostings,
          incidentRotations: rotations,
          isLoaded: true
        }
      }));
    } catch (error) {
      console.error(`Error loading data for squad ${squad.name}:`, error);
    }
  };

  // Fetch initial squads data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const squadsData = await fetchSquads();
        setSquads(squadsData);
        
        if (squadsData.length > 0) {
          setActiveTeam(squadsData[0].id);
        }
        
        setIsInitialLoading(false);
      } catch (error) {
        console.error('Error fetching squads:', error);
        setIsInitialLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Load data for active squad when it changes or hasn't been loaded yet
  useEffect(() => {
    if (!activeTeam || isInitialLoading) return;
    
    const squad = squads.find(s => s.id === activeTeam);
    if (!squad) return;
    
    const dateRange = activeTab === "timeline" 
      ? dateRanges.timeline
      : dateRanges.calendar;
    
    loadSquadData(squad, dateRange);
  }, [activeTeam, activeTab, isInitialLoading, dateRanges, squads]);

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
      if (!r?.startDate || !r?.endDate) return false;
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      const checkDate = new Date(format(date, "yyyy-MM-dd"))
      return checkDate >= start && checkDate <= end
    })

    if (!rotation) return { primary: null, secondary: null }

    const primary = rotation.primaryMemberId ? squadMembers.find(m => m.id === rotation.primaryMemberId) || null : null
    const secondary = rotation.secondaryMemberId ? squadMembers.find(m => m.id === rotation.secondaryMemberId) || null : null

    // Check for swaps
    const swap = rotation.swaps?.find(s => 
      s?.swapDate && format(new Date(s.swapDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") && 
      s.status === 'APPROVED'
    )
    
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
  
  // Check if current squad data is still loading
  const isLoading = isInitialLoading || (activeTeam && !allSquadsData[activeTeam]?.isLoaded);

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
            visibleDays={visibleDays}
            cachedData={{
              squadMembers,
              standupHostings,
              incidentRotations
            }}
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

        {/* WeekHosts component sử dụng dữ liệu từ cache */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <WeekHosts 
            squad={currentTeam} 
            cachedData={{
              squadMembers,
              standupHostings,
              incidentRotations
            }} 
          />
        </div>

        {/* TeamMembers component sử dụng dữ liệu từ cache */}
        <TeamMembers 
          squad={currentTeam} 
          cachedData={{
            squadMembers,
            standupHostings,
            incidentRotations
          }} 
        />
      </div>
    </div>
  )
}

