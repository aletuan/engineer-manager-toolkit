import { addDays, differenceInDays, startOfYear } from "date-fns"
import { teamMembers } from "./team-data"

// Function to determine who's on incident duty for a given date
export function getIncidentResponders(date: Date, teamMembers: string[]) {
  // Each sprint lasts 2 weeks (14 days)
  const sprintDuration = 14

  // Calculate the number of days since the start of the year
  const startYear = startOfYear(date)
  const daysSinceStartOfYear = differenceInDays(date, startYear)

  // Calculate which sprint we're in (0-indexed)
  const sprintNumber = Math.floor(daysSinceStartOfYear / sprintDuration)

  // Determine primary and secondary responders based on the sprint number
  // We'll rotate through the team members, with a different rotation for primary and secondary
  const primaryIndex = sprintNumber % teamMembers.length
  // Secondary is offset by half the team size to ensure different people
  const secondaryIndex = (primaryIndex + Math.ceil(teamMembers.length / 2)) % teamMembers.length

  return {
    primary: teamMembers[primaryIndex],
    secondary: teamMembers[secondaryIndex],
  }
}

// Function to get sprint dates (start and end) for a given date
export function getSprintDates(date: Date) {
  const startYear = startOfYear(date)
  const daysSinceStartOfYear = differenceInDays(date, startYear)
  const sprintNumber = Math.floor(daysSinceStartOfYear / 14)

  const sprintStart = addDays(startYear, sprintNumber * 14)
  const sprintEnd = addDays(sprintStart, 13)

  return { start: sprintStart, end: sprintEnd }
}

// Function to get the next incident duty for a specific member
export function getNextIncidentDuty(memberName: string) {
  const today = new Date()
  let currentDate = new Date(today)
  let result = {
    role: null as "primary" | "secondary" | null,
    startDate: null as Date | null,
    endDate: null as Date | null,
  }

  // Look ahead up to 6 sprints (12 weeks)
  for (let i = 0; i < 6; i++) {
    // Get the sprint dates
    const sprintDates = getSprintDates(currentDate)

    // Get team members for Sonic team only
    const sonicMembers = teamMembers.filter((m) => m.team === "Sonic").map((m) => m.name)

    // Get incident responders for this sprint
    const { primary, secondary } = getIncidentResponders(sprintDates.start, sonicMembers)

    if (primary === memberName) {
      result = {
        role: "primary",
        startDate: sprintDates.start,
        endDate: sprintDates.end,
      }
      break
    } else if (secondary === memberName) {
      result = {
        role: "secondary",
        startDate: sprintDates.start,
        endDate: sprintDates.end,
      }
      break
    }

    // Move to the next sprint
    currentDate = addDays(sprintDates.end, 1)
  }

  return result
}

