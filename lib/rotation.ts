import { format, getDay, startOfYear, addDays, isWeekend } from "date-fns"
import { vietnameseHolidays } from "./holidays"
import { teamMembers } from "./team-data"

// Function to get the host for a specific date based on rotation
export function getHostForDate(date: Date, teamMembers: string[]): string {
  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = getDay(date)

  // Skip weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return "No standup (Weekend)"
  }

  // Calculate the number of weekdays since the start of the year
  // This ensures a consistent rotation pattern
  const startYear = startOfYear(date)
  let weekdayCount = 0

  // Count weekdays from start of year to the given date
  const currentDate = new Date(startYear)
  while (currentDate <= date) {
    const currentDayOfWeek = getDay(currentDate)
    if (currentDayOfWeek !== 0 && currentDayOfWeek !== 6) {
      weekdayCount++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Use modulo to cycle through team members
  const hostIndex = (weekdayCount - 1) % teamMembers.length
  return teamMembers[hostIndex]
}

// Check if a date is a hosting day (not weekend, not holiday)
export function isHostingDay(date: Date): boolean {
  if (isWeekend(date)) return false

  const dateString = format(date, "yyyy-MM-dd")
  if (vietnameseHolidays.some((holiday) => holiday.date === dateString)) return false

  return true
}

// Function to get the next hosting date for a specific member
export function getNextHostingDate(memberName: string): Date | null {
  const today = new Date()
  let currentDate = new Date(today)

  // Look ahead up to 60 days
  for (let i = 0; i < 60; i++) {
    currentDate = addDays(currentDate, 1)

    if (isHostingDay(currentDate)) {
      // Get team members based on the member's team
      const member = teamMembers.find((m) => m.name === memberName)
      if (!member) return null

      const teamMemberNames = teamMembers.filter((m) => m.team === member.team).map((m) => m.name)

      const hostForDate = getHostForDate(currentDate, teamMemberNames)

      if (hostForDate === memberName) {
        return currentDate
      }
    }
  }

  return null
}

