import { format } from "date-fns"

interface SprintHeaderProps {
  sprintDates: {
    start: Date
    end: Date
    sprintNumber: number
  }
}

export function SprintHeader({ sprintDates }: SprintHeaderProps) {
  return (
    <div className="bg-gray-200 p-2 rounded-lg mb-2 text-sm font-medium">
      Sprint {sprintDates.sprintNumber}: {format(sprintDates.start, "dd/MM")} - {format(sprintDates.end, "dd/MM")}
    </div>
  )
} 