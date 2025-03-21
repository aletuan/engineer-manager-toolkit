"use client"

import { useState, useEffect } from "react"
import { format, addDays, getDay } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { isWeekend } from "date-fns"
import { vietnameseHolidays } from "@/lib/holidays"
import type { Squad, SquadMember, StandupHosting, IncidentRotation } from "@/lib/api"
import { fetchStandupHosting, fetchIncidentRotation } from "@/lib/api"

interface WeekHostsProps {
  squad: Squad
}

export function WeekHosts({ squad }: WeekHostsProps) {
  const [standupHostings, setStandupHostings] = useState<StandupHosting[]>([])
  const [incidentRotations, setIncidentRotations] = useState<IncidentRotation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get days for the week view (starting from Monday)
  const getWeekDays = () => {
    const today = new Date()
    const dayOfWeek = getDay(today)
    const startDay = addDays(today, dayOfWeek === 0 ? -6 : 1 - dayOfWeek) // Start from Monday
    return Array.from({ length: 5 }, (_, i) => addDays(startDay, i))
  }

  const weekDays = getWeekDays()

  // Fetch data when squad changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const startDate = format(weekDays[0], "yyyy-MM-dd")
        const endDate = format(weekDays[weekDays.length - 1], "yyyy-MM-dd")

        const [hostings, rotations] = await Promise.all([
          fetchStandupHosting(squad.id, startDate, endDate),
          squad.hasIncidentRoster ? fetchIncidentRotation(squad.id, startDate, endDate) : Promise.resolve([])
        ])

        setStandupHostings(hostings)
        setIncidentRotations(rotations)
      } catch (error) {
        console.error('Error fetching week hosts data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [squad.id, squad.hasIncidentRoster])

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
      squadId: squad.id,
      squadName: squad.name,
      pid: hosting.member.id // Using member id as pid since it's not provided in the API
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
        squadId: squad.id,
        squadName: squad.name,
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

  if (isLoading) {
    return (
      <div className="mt-8 border-t pt-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="font-medium mb-4">Host tuần này:</h3>
      <div className="grid grid-cols-5 gap-2">
        {weekDays.map((day, i) => {
          const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
          const isHostDay = isHostingDay(day)
          const host = isHostDay ? getHostForDate(day) : null
          const holidayName = getHolidayName(day)

          // Only get incident responders for Team Sonic
          const { primary: dayPrimary, secondary: daySecondary } = squad.hasIncidentRoster
            ? getIncidentResponders(day)
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
                {squad.hasIncidentRoster && (
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