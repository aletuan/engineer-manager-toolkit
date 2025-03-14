import { getDay, startOfYear } from "date-fns"

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

