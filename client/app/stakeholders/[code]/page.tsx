"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getStakeholderByCode, type Stakeholder } from "@/lib/stakeholders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, User, Building, FileText, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { tasks } from "@/lib/tasks"
import { cn } from "@/lib/utils"

export default function StakeholderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [stakeholder, setStakeholder] = useState<Stakeholder | null>(null)
  const [relatedTasks, setRelatedTasks] = useState<typeof tasks>([])

  useEffect(() => {
    if (params.code) {
      const stakeholderData = getStakeholderByCode(params.code as any)
      if (stakeholderData) {
        setStakeholder(stakeholderData)

        // Lấy các task liên quan đến stakeholder này
        const filteredTasks = tasks.filter((task) => task.stakeholders.includes(stakeholderData.code))
        setRelatedTasks(filteredTasks)
      } else {
        // Nếu không tìm thấy stakeholder, chuyển về trang Focus
        router.push("/focus")
      }
    }
  }, [params.code, router])

  if (!stakeholder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Đang tải thông tin...</p>
      </div>
    )
  }

  // Hiển thị màu cho badge stakeholder
  const getStakeholderColor = (stakeholderCode: string) => {
    switch (stakeholderCode) {
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
              <h1 className="text-2xl font-bold">Thông Tin Stakeholder</h1>
              <p className="text-gray-500">Chi tiết về stakeholder và các task liên quan</p>
            </div>
          </div>
        </div>

        {/* Stakeholder details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stakeholder info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thông Tin Stakeholder</CardTitle>
                <Badge variant="outline" className={cn("font-medium", getStakeholderColor(stakeholder.code))}>
                  {stakeholder.code}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">{stakeholder.name}</h2>
                  <p className="text-gray-600 mt-2">{stakeholder.description}</p>
                </div>

                {stakeholder.contactName && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Người phụ trách</p>
                      <p className="font-medium">{stakeholder.contactName}</p>
                    </div>
                  </div>
                )}

                {stakeholder.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email liên hệ</p>
                      <p className="font-medium">{stakeholder.contactEmail}</p>
                    </div>
                  </div>
                )}

                {stakeholder.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{stakeholder.contactPhone}</p>
                    </div>
                  </div>
                )}

                {stakeholder.groupName && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nhóm</p>
                      <p className="font-medium">{stakeholder.groupName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between">
                  <Link href="/focus">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Quay lại Focus</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Task Liên Quan</CardTitle>
              <CardDescription>Danh sách các task có liên quan đến {stakeholder.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {relatedTasks.length > 0 ? (
                <div className="space-y-4">
                  {relatedTasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono bg-gray-100">
                              {task.featureId}
                            </Badge>
                            <Badge variant="outline" className={cn("font-medium", getPriorityColor(task.priority))}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(task.startDate).toLocaleDateString()} -{" "}
                            {new Date(task.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
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
                            {task.status}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100">
                            {task.progress}%
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Assignees: {task.assignees.join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">Không có task nào liên quan</h3>
                  <p className="text-gray-500 mt-1">Hiện tại không có task nào liên quan đến stakeholder này.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

