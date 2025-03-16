"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { type Task, getTopTasksForWeek, getTaskAssignees } from "@/lib/tasks"

export default function FocusPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [activeSquad, setActiveSquad] = useState<"Sonic" | "Troy">("Sonic")
  const [tasks, setTasks] = useState<Task[]>([])

  // Cập nhật danh sách task khi thay đổi ngày hoặc squad
  useEffect(() => {
    setTasks(getTopTasksForWeek(currentDate, activeSquad))
  }, [currentDate, activeSquad])

  // Xử lý chuyển đổi thời gian
  const handlePrevious = () => {
    const prevWeek = new Date(currentDate)
    prevWeek.setDate(prevWeek.getDate() - 7)
    setCurrentDate(prevWeek)
  }

  const handleNext = () => {
    const nextWeek = new Date(currentDate)
    nextWeek.setDate(nextWeek.getDate() + 7)
    setCurrentDate(nextWeek)
  }

  const handleThisWeek = () => {
    setCurrentDate(new Date())
  }

  // Lấy ngày bắt đầu và kết thúc của tuần hiện tại
  const getWeekRange = (date: Date) => {
    const day = date.getDay()
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - day + (day === 0 ? -6 : 1)) // Lấy thứ 2 đầu tuần

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // Chủ nhật cuối tuần

    return { startOfWeek, endOfWeek }
  }

  // Hiển thị trạng thái task
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Not Started":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Chưa bắt đầu
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Đang thực hiện
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Hoàn thành
          </Badge>
        )
      case "Blocked":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Bị chặn
          </Badge>
        )
      default:
        return null
    }
  }

  // Hiển thị icon trạng thái task
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Not Started":
        return <PauseCircle className="h-5 w-5 text-gray-500" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Blocked":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Hiển thị màu ưu tiên
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-orange-600 bg-orange-50"
      case "Low":
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

  const { startOfWeek, endOfWeek } = getWeekRange(currentDate)

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
                  Top 5 tasks quan trọng của Squad {activeSquad} ({format(startOfWeek, "dd/MM")} -{" "}
                  {format(endOfWeek, "dd/MM/yyyy")})
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

          {/* Squad selector */}
          <div className="mt-6 mb-4">
            <Tabs
              defaultValue="Sonic"
              className="w-full"
              onValueChange={(value) => setActiveSquad(value as "Sonic" | "Troy")}
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="Sonic">Squad Sonic</TabsTrigger>
                <TabsTrigger value="Troy">Squad Troy</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Date navigation */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleThisWeek}>
                Tuần này
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main content - Top Tasks */}
        <div className="space-y-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
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
                      <CardTitle className="text-xl">{task.title}</CardTitle>
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
                          {format(task.startDate, "dd/MM/yyyy")} - {format(task.endDate, "dd/MM/yyyy")}
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
                      {task.stakeholders.map((stakeholder) => (
                        <Badge
                          key={stakeholder}
                          variant="outline"
                          className={cn("text-xs", getStakeholderColor(stakeholder))}
                        >
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t">
                  <div className="w-full">
                    <p className="text-sm text-gray-500 mb-2">Assignees:</p>
                    <div className="flex flex-wrap gap-2">
                      {getTaskAssignees(task).map((member) => (
                        <TooltipProvider key={member.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/members/${member.id}`}>
                                <Avatar className="h-8 w-8 border border-gray-200 hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                                    {member.name
                                      .split(" ")
                                      .map((part) => part[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{member.name}</p>
                              <p className="text-xs text-gray-500">{member.position}</p>
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
              <h3 className="text-lg font-medium mb-2">Không có task nào trong khoảng thời gian này</h3>
              <p className="text-gray-500">Thử chọn một khoảng thời gian khác hoặc thêm task mới.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

