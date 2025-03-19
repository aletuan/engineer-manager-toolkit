"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns"
import Link from "next/link"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  PauseCircle,
  Search,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { fetchTasks, type Task } from "@/lib/api"

export default function FocusPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [activeSquad, setActiveSquad] = useState<"Sonic" | "Troy">("Sonic")
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const getWeekDates = () => {
    const start = startOfWeek(currentDate)
    const end = endOfWeek(currentDate)
    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd")
    }
  }

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true)
      try {
        const { startDate, endDate } = getWeekDates()
        const response = await fetchTasks({
          assignedTo: undefined,
          status: undefined,
          priority: undefined,
          page: 1,
          limit: 5,
          sortBy: "priority",
          sortOrder: "desc"
        })
        setAllTasks(response.tasks)
        setFilteredTasks(response.tasks)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [currentDate, activeSquad])

  useEffect(() => {
    const filtered = allTasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredTasks(filtered)
  }, [searchQuery, allTasks])

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate(current => 
      direction === "prev" ? subWeeks(current, 1) : addWeeks(current, 1)
    )
  }

  // Hiển thị trạng thái task
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TODO":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Chưa bắt đầu
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Đang thực hiện
          </Badge>
        )
      case "DONE":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Hoàn thành
          </Badge>
        )
      default:
        return null
    }
  }

  // Hiển thị icon trạng thái task
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case "TODO":
        return <Clock className="h-5 w-5 text-gray-500" />
      case "IN_PROGRESS":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "DONE":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  // Hiển thị màu ưu tiên
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 bg-red-50"
      case "MEDIUM":
        return "text-orange-600 bg-orange-50"
      case "LOW":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  // Hiển thị màu stakeholder
  const getStakeholderColor = (stakeholder: string) => {
    switch (stakeholder) {
      case "Fraud":
        return "bg-purple-100 text-purple-800"
      case "BEB":
        return "bg-blue-100 text-blue-800"
      case "ECOM":
        return "bg-green-100 text-green-800"
      case "CM":
        return "bg-orange-100 text-orange-800"
      case "CE":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Focus</h1>
                <p className="text-gray-500">
                  Top 5 tasks quan trọng của Squad {activeSquad} ({format(startOfWeek(currentDate), "dd/MM")} -{" "}
                  {format(endOfWeek(currentDate), "dd/MM/yyyy")})
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Lịch Stand-up</span>
                </Button>
              </Link>
              <Link href="/members">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Thành Viên</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Squad selector và Navigation */}
          <div className="mt-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs
              defaultValue="Sonic"
              className="w-full md:w-auto"
              onValueChange={(value) => setActiveSquad(value as "Sonic" | "Troy")}
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="Sonic">Squad Sonic</TabsTrigger>
                <TabsTrigger value="Troy">Squad Troy</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Tìm kiếm theo tiêu đề, mô tả, assignee hoặc stakeholder..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Main content - Top Tasks */}
        <div className="space-y-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono bg-gray-100">
                          {task.featureId}
                        </Badge>
                        <Badge variant="outline" className={cn("font-medium", getPriorityColor(task.priority))}>
                          {task.priority}
                        </Badge>
                        {getStatusBadge(task.status)}
                      </div>
                      <Link href={`/tasks/${task.id}`}>
                        <CardTitle className="text-xl hover:text-primary hover:underline transition-colors cursor-pointer">
                          {task.title}
                        </CardTitle>
                      </Link>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{task.points} points</span>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {format(new Date(task.createdAt), "dd/MM/yyyy")} - {format(new Date(task.dueDate), "dd/MM/yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tiến độ</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3 sm:mt-0">
                      {task.stakeholders?.map((stakeholder) => (
                        <Link href={`/stakeholders/${stakeholder.id}`} key={stakeholder.id}>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs cursor-pointer hover:ring-1 hover:ring-primary/30",
                              getStakeholderColor(stakeholder.code)
                            )}
                          >
                            {stakeholder.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t">
                  <div className="w-full">
                    <p className="text-sm text-gray-500 mb-2">Assignees:</p>
                    <div className="flex flex-wrap gap-2">
                      {task.assignees?.map((assignee) => (
                        <TooltipProvider key={assignee.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/members/${assignee.memberId}`}>
                                <Avatar className="h-8 w-8 border border-gray-200 hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                                    {assignee.member.fullName
                                      .split(" ")
                                      .map((part) => part[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{assignee.member.fullName}</p>
                              <p className="text-xs text-gray-500">{assignee.member.position}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Không có task nào phù hợp với tìm kiếm</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc chọn một khoảng thời gian khác.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

