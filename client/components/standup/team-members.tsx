"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { isWeekend } from "date-fns"
import { vietnameseHolidays } from "@/lib/holidays"
import { format } from "date-fns"
import type { Squad, SquadMember, StandupHosting, IncidentRotation } from "@/lib/api"
import { fetchSquadMembers, fetchStandupHosting, fetchIncidentRotation } from "@/lib/api"

interface TeamMembersProps {
  squad: Squad
}

export function TeamMembers({ squad }: TeamMembersProps) {
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([])
  const [standupHostings, setStandupHostings] = useState<StandupHosting[]>([])
  const [incidentRotations, setIncidentRotations] = useState<IncidentRotation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data when squad changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const today = new Date()
        const todayStr = format(today, "yyyy-MM-dd")

        const [members, hostings, rotations] = await Promise.all([
          fetchSquadMembers(squad.id),
          fetchStandupHosting(squad.id, todayStr, todayStr),
          squad.hasIncidentRoster ? fetchIncidentRotation(squad.id, todayStr, todayStr) : Promise.resolve([])
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
    fetchData()
  }, [squad.id, squad.hasIncidentRoster])

  // Helper functions
  const isHostingDay = (date: Date) => {
    if (isWeekend(date)) return false
    const dateString = format(date, "yyyy-MM-dd")
    return !vietnameseHolidays.some((holiday) => holiday.date === dateString)
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
        pid: member.id // Using member id as pid since it's not provided in the API
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

  const today = new Date()
  const isHostingToday = isHostingDay(today)
  const hostToday = isHostingToday ? getHostForDate(today) : null
  const { primary, secondary } = squad.hasIncidentRoster 
    ? getIncidentResponders(today) 
    : { primary: null, secondary: null }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mt-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">{squad.name}</h2>
      <div className="flex flex-wrap gap-3">
        {squadMembers.map((member, index) => {
          const isHostingToday = isHostingDay(today) && hostToday?.id === member.id
          const isPrimary = squad.hasIncidentRoster && primary?.id === member.id
          const isSecondary = squad.hasIncidentRoster && secondary?.id === member.id

          // Combine role indicators
          const roles = []
          if (isHostingToday) roles.push("H")
          if (isPrimary) roles.push("P")
          if (isSecondary) roles.push("S")
          const rolesText = roles.length > 0 ? ` (${roles.join(", ")})` : ""

          return (
            <Link
              key={index}
              href={`/members/${member.id}`}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  flex items-center gap-2
                  ${isHostingToday
                    ? "bg-primary text-white hover:bg-primary/90"
                    : isPrimary
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : isSecondary
                        ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <span>{member.fullName}</span>
                {rolesText && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${isHostingToday
                      ? "bg-white/20"
                      : isPrimary
                        ? "bg-blue-200"
                        : isSecondary
                          ? "bg-purple-200"
                          : "bg-gray-200"
                    }
                  `}>
                    {rolesText}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 