import { format, isWeekend, addDays, getDay } from "date-fns"
import { vietnameseHolidays } from "@/lib/holidays"

/**
 * Check if a date is a hosting day (not weekend, not holiday)
 */
export function isHostingDay(date: Date): boolean {
  if (isWeekend(date)) return false
  const dateString = format(date, "yyyy-MM-dd")
  return !vietnameseHolidays.some((holiday) => holiday.date === dateString)
}

/**
 * Get holiday name if the date is a holiday
 */
export function getHolidayName(date: Date): string | null {
  const dateString = format(date, "yyyy-MM-dd")
  const holiday = vietnameseHolidays.find((h) => h.date === dateString)
  return holiday ? holiday.name : null
}

/**
 * Get days for the week view (starting from Monday)
 */
export function getWeekDays(): Date[] {
  const today = new Date()
  const dayOfWeek = getDay(today)
  const startDay = addDays(today, dayOfWeek === 0 ? -6 : 1 - dayOfWeek) // Start from Monday
  return Array.from({ length: 5 }, (_, i) => addDays(startDay, i))
} 