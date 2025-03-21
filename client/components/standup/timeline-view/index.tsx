"use client"

import { useState, useEffect, useMemo } from "react"
import { format, isSameDay, startOfDay, addDays } from "date-fns"
import { vi } from "date-fns/locale"
import { isWeekend } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"

import { isHostingDay, getHolidayName } from "@/lib/utils/date-helpers"
import { getSprintDates } from "@/lib/utils/sprint-helpers"
import { type Squad, type SquadMember, type StandupHosting, type IncidentRotation } from "@/lib/api"
import { SprintHeader } from "./sprint-header"
import { TimelineDay } from "./timeline-day"

interface TimelineViewProps {
  currentTeam: Squad;
  visibleDays: Date[];
  cachedData: {
    squadMembers: SquadMember[];
    standupHostings: StandupHosting[];
    incidentRotations: IncidentRotation[];
  };
}

export function TimelineView({ 
  currentTeam,
  visibleDays,
  cachedData
}: TimelineViewProps) {
  const today = startOfDay(new Date())
  
  // Sử dụng dữ liệu cached
  const hostingMap = useMemo(() => {
    const map = new Map<string, SquadMember | null>();
    
    cachedData.standupHostings.forEach(hosting => {
      if (hosting && hosting.date) {
        const dateStr = format(new Date(hosting.date), "yyyy-MM-dd");
        if (hosting.member) {
          map.set(dateStr, {
            id: hosting.member.id,
            fullName: hosting.member.fullName,
            email: hosting.member.email,
            position: hosting.member.position,
            avatarUrl: hosting.member.avatarUrl,
            squadId: currentTeam.id,
            squadName: currentTeam.name,
            pid: hosting.member.id
          });
        }
      }
    });
    
    return map;
  }, [cachedData.standupHostings, currentTeam.id, currentTeam.name]);
  
  // Tìm host cho ngày cụ thể từ cache
  const getHost = (date: Date): SquadMember | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    return hostingMap.get(dateStr) || null;
  };
  
  // Tìm incident responders từ cache
  const getIncidentResponders = (date: Date): { primary: SquadMember | null, secondary: SquadMember | null } => {
    const dateStr = format(date, "yyyy-MM-dd");
    const rotation = cachedData.incidentRotations.find(r => {
      if (!r || !r.startDate || !r.endDate) return false;
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= start && checkDate <= end;
    });
    
    if (!rotation) return { primary: null, secondary: null };
    
    // Check for swaps
    const swap = rotation.swaps?.find(s => 
      s && s.swapDate && 
      format(new Date(s.swapDate), "yyyy-MM-dd") === dateStr && 
      s.status === 'APPROVED'
    );
    
    // Convert API member type to SquadMember type
    const convertToSquadMember = (member: { 
      id: string;
      fullName: string;
      email: string;
      position: string;
      avatarUrl?: string;
    } | null): SquadMember | null => {
      if (!member) return null;
      return {
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        position: member.position,
        avatarUrl: member.avatarUrl,
        squadId: currentTeam.id,
        squadName: currentTeam.name,
        pid: member.id
      };
    };
    
    let primary = convertToSquadMember(rotation.primaryMember);
    let secondary = convertToSquadMember(rotation.secondaryMember);
    
    // Apply swaps
    if (swap) {
      if (swap.requesterId === rotation.primaryMemberId) {
        primary = convertToSquadMember(swap.accepter);
      } else if (swap.requesterId === rotation.secondaryMemberId) {
        secondary = convertToSquadMember(swap.accepter);
      }
    }
    
    return { primary, secondary };
  };

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
          const host = isHostDay ? getHost(day) : null

          // Only get incident responders for Team Sonic
          const { primary: dayPrimary, secondary: daySecondary } = currentTeam.hasIncidentRoster
            ? getIncidentResponders(day)
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
    </div>
  )
} 