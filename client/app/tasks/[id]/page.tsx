"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowLeft,
  CalendarIcon,
  Clock,
  Target,
  Users,
  CheckCircle,
  XCircle,
  PauseCircle,
  MessageSquare,
  Link2,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getTaskById, getTaskAssignees, getTaskDependencies, getRelatedTasks, type Task } from "@/lib/tasks"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [taskDependencies, setTaskDependencies] = useState<{ task: Task; type: string }[]>([])
  const [relatedTasks, setRelatedTasks] = useState<{ task: Task; type: string }[]>([])
  const [assignees, setAssignees] = useState<any[]>([])

  useEffect(() => {
    if (params.id) {
      const taskData = getTaskById(params.id as string)
      if (taskData) {
        setTask(taskData)
        setTaskDependencies(getTaskDependencies(taskData))
        setRelatedTasks(getRelatedTasks(taskData.id))
        setAssignees(getTaskAssignees(taskData))
      } else {
        // Nếu không tìm thấy task, chuyển về trang Focus
        router.push("/focus")
      }
    }
  }, [params.id, router])

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Đang tải thông tin...</p>
      </div>
    )
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

  // Hiển thị màu dependency type
  const getDependencyTypeColor = (type: string) => {
    switch (type) {
      case "blocks":
        return "bg-red-100 text-red-800"
      case "blocked-by":
        return "bg-orange-100 text-orange-800"
      case "related-to":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Hiển thị text cho dependency type
  const getDependencyTypeText = (type: string) => {
    switch (type) {
      case "blocks":
        return "Blocks"
      case "blocked-by":
        return "Blocked by"
      case "related-to":
        return "Related to"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/focus">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono bg-gray-100">
                  {task.featureId}
                </Badge>
                <h1 className="text-2xl font-bold">{task.title}</h1>
              </div>
              <p className="text-gray-500 mt-1">Chi tiết task và các thông tin liên quan</p>
            </div>
          </div>
        </div>

        {/* Task details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main task info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Thông Tin Chi Tiết</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("font-medium", getPriorityColor(task.priority))}>
                    {task.priority}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : task.status === "Blocked"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }
                  >
                    {task.status === "Not Started"
                      ? "Chưa bắt đầu"
                      : task.status === "In Progress"
                        ? "Đang thực hiện"
                        : task.status === "Completed"
                          ? "Hoàn thành"
                          : "Bị chặn"}
                  </Badge>
                </div>
              </div>
              <CardDescription className="mt-4 text-base">{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline and progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Thời gian</p>
                        <p className="font-medium">
                          {format(task.startDate, "dd/MM/yyyy")} - {format(task.endDate, "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Điểm</p>
                        <p className="font-medium">{task.points} points</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tiến độ</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stakeholders */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Stakeholders:</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.stakeholders.map((stakeholder) => (
                      <Link href={`/stakeholders/${stakeholder}`} key={stakeholder}>
                        <Badge
                          variant="outline"
                          className={cn(
                            "cursor-pointer hover:ring-1 hover:ring-primary/30",
                            getStakeholderColor(stakeholder),
                          )}
                        >
                          {stakeholder}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Assignees */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Assignees:</h3>
                  <div className="flex flex-wrap gap-3">
                    {assignees.map((member) => (
                      <div key={member.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                        <Link href={`/members/${member.id}`}>
                          <Avatar className="h-8 w-8 border border-gray-200 hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                              {member.name
                                .split(" ")
                                .map((part: string) => part[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Squad */}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Squad</p>
                    <Link
                      href={`/members?squad=${task.squad}`}
                      className="font-medium hover:text-primary hover:underline transition-colors"
                    >
                      Squad {task.squad}
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Dependencies */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Dependencies</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {taskDependencies.length > 0 || relatedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {taskDependencies.map((dep) => (
                      <Link href={`/tasks/${dep.task.id}`} key={dep.task.id}>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="font-mono bg-gray-100">
                              {dep.task.featureId}
                            </Badge>
                            <Badge variant="outline" className={getDependencyTypeColor(dep.type)}>
                              {getDependencyTypeText(dep.type)}
                            </Badge>
                          </div>
                          <p className="font-medium">{dep.task.title}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <div
                              className={
                                dep.task.status === "Completed"
                                  ? "text-green-500"
                                  : dep.task.status === "In Progress"
                                    ? "text-blue-500"
                                    : dep.task.status === "Blocked"
                                      ? "text-red-500"
                                      : "text-gray-500"
                              }
                            >
                              {dep.task.status}
                            </div>
                            <span>•</span>
                            <div>{dep.task.progress}%</div>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {relatedTasks.map((dep) => (
                      <Link href={`/tasks/${dep.task.id}`} key={dep.task.id}>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="font-mono bg-gray-100">
                              {dep.task.featureId}
                            </Badge>
                            <Badge variant="outline" className={getDependencyTypeColor(dep.type)}>
                              {getDependencyTypeText(dep.type)}
                            </Badge>
                          </div>
                          <p className="font-medium">{dep.task.title}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <div
                              className={
                                dep.task.status === "Completed"
                                  ? "text-green-500"
                                  : dep.task.status === "In Progress"
                                    ? "text-blue-500"
                                    : dep.task.status === "Blocked"
                                      ? "text-red-500"
                                      : "text-gray-500"
                              }
                            >
                              {dep.task.status}
                            </div>
                            <span>•</span>
                            <div>{dep.task.progress}%</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Link2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p>Không có task phụ thuộc</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Notes */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Notes</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {task.notes && task.notes.length > 0 ? (
                  <div className="space-y-4">
                    {task.notes.map((note) => (
                      <div key={note.id} className="p-3 border rounded-lg">
                        <p className="text-sm">{note.content}</p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <div className="font-medium">{note.author}</div>
                          <div>
                            {format(note.createdAt, "dd/MM/yyyy HH:mm")}
                            {note.updatedAt && ` (updated: ${format(note.updatedAt, "dd/MM/yyyy HH:mm")})`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p>Không có ghi chú nào</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button className="w-full">Cập nhật trạng thái</Button>
              <Button variant="outline" className="w-full">
                Thêm ghi chú
              </Button>
              <Link href="/focus">
                <Button variant="ghost" className="w-full">
                  Quay lại Focus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

