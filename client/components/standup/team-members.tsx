"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { SquadMember } from "@/lib/api"

interface TeamMembersProps {
  squadMembers: SquadMember[]
  currentTeam: {
    name: string
    hasIncidentRoster: boolean
  }
  isHostingDay: (date: Date) => boolean
  getHostForDateFromAPI: (date: Date) => SquadMember | null
  getIncidentRespondersFromAPI: (date: Date) => {
    primary: SquadMember | null
    secondary: SquadMember | null
  }
}

export function TeamMembers({
  squadMembers,
  currentTeam,
  isHostingDay,
  getHostForDateFromAPI,
  getIncidentRespondersFromAPI,
}: TeamMembersProps) {
  const today = new Date()
  const isHostingToday = isHostingDay(today)
  const hostToday = isHostingToday ? getHostForDateFromAPI(today) : null
  const { primary, secondary } = currentTeam.hasIncidentRoster 
    ? getIncidentRespondersFromAPI(today) 
    : { primary: null, secondary: null }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">{currentTeam.name}</h2>
      <div className="flex flex-wrap gap-3">
        {squadMembers.map((member, index) => {
          const isHostingToday = isHostingDay(today) && hostToday?.id === member.id
          const isPrimary = currentTeam.hasIncidentRoster && primary?.id === member.id
          const isSecondary = currentTeam.hasIncidentRoster && secondary?.id === member.id

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