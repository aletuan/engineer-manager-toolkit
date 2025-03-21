import { getDay, format } from "date-fns"

interface SprintDates {
  start: Date
  end: Date
  sprintNumber: number
}

/**
 * Get sprint dates (start and end) for a given date
 */
export function getSprintDates(date: Date): SprintDates {
  // Find the start of the financial year
  const financialYearStart = new Date(date.getFullYear(), 9, 1) // Month is 0-based, so 9 is October
  if (date < financialYearStart) {
    financialYearStart.setFullYear(financialYearStart.getFullYear() - 1)
  }

  // Find the first Wednesday after financial year start
  let firstSprintStart = new Date(financialYearStart)
  while (getDay(firstSprintStart) !== 3) { // 3 is Wednesday
    firstSprintStart.setDate(firstSprintStart.getDate() + 1)
  }

  // Calculate days since first sprint start
  const daysSinceStart = Math.floor((date.getTime() - firstSprintStart.getTime()) / (1000 * 60 * 60 * 24))
  
  // Calculate sprint number and days into current sprint
  const sprintNumber = Math.floor(daysSinceStart / 14) + 1
  const daysToAdd = (sprintNumber - 1) * 14

  // Calculate current sprint start and end dates
  const sprintStart = new Date(firstSprintStart)
  sprintStart.setDate(firstSprintStart.getDate() + daysToAdd)
  const sprintEnd = new Date(sprintStart)
  sprintEnd.setDate(sprintStart.getDate() + 13)

  return { start: sprintStart, end: sprintEnd, sprintNumber }
}

/**
 * Check if a date is the start of a sprint
 */
export function isSprintStart(date: Date): boolean {
  // Sprint starts on Wednesday (day 3)
  if (getDay(date) !== 3) return false

  // Get sprint dates for this date
  const { start } = getSprintDates(date)
  
  // Check if this date is the start date of the sprint
  return format(date, "yyyy-MM-dd") === format(start, "yyyy-MM-dd")
} 