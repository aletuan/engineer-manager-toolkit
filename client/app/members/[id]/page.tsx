"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, User, Building, Calendar, Shield } from "lucide-react"
import { 
  fetchMemberDetails, 
  fetchMemberStandupHistory, 
  fetchMemberIncidentHistory,
  type MemberDetails,
  type StandupHosting,
  type IncidentRotation
} from "@/lib/api"

export default function MemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [member, setMember] = useState<MemberDetails | null>(null)
  const [standupHistory, setStandupHistory] = useState<StandupHosting[]>([])
  const [incidentHistory, setIncidentHistory] = useState<IncidentRotation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMemberData(memberId: string) {
      try {
        setIsLoading(true)
        const [details, standupData, incidentData] = await Promise.all([
          fetchMemberDetails(memberId),
          fetchMemberStandupHistory(memberId),
          fetchMemberIncidentHistory(memberId)
        ])

        if (details) {
          setMember(details)
          setStandupHistory(standupData)
          setIncidentHistory(incidentData)
        } else {
          // Nếu không tìm thấy thành viên, chuyển về trang danh sách
          router.push("/members")
        }
      } catch (error) {
        console.error('Error fetching member data:', error)
        router.push("/members")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchMemberData(params.id as string)
    }
  }, [params.id, router])

  // Tìm ngày host standup tiếp theo từ lịch sử
  const nextStandupHosting = standupHistory
    .filter(hosting => new Date(hosting.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  // Tìm lịch trực incident tiếp theo từ lịch sử
  const nextIncidentDuty = incidentHistory
    .filter(rotation => new Date(rotation.endDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .map(rotation => ({
      role: rotation.primaryMemberId === member?.id ? "primary" : "secondary",
      startDate: new Date(rotation.startDate),
      endDate: new Date(rotation.endDate)
    }))[0]

  if (isLoading || !member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Đang tải thông tin...</p>
      </div>
    )
  }

  // Lấy 5 lịch sử standup gần nhất
  const recentStandupHistory = standupHistory
    .filter(hosting => new Date(hosting.date) <= new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Lấy 5 lịch sử incident rotation gần nhất
  const recentIncidentHistory = incidentHistory
    .filter(rotation => new Date(rotation.endDate) <= new Date())
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/members">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Thông Tin Chi Tiết</h1>
              <p className="text-gray-500">Thông tin cá nhân và lịch trình của thành viên</p>
            </div>
          </div>
        </div>

        {/* Member details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Thông Tin Cá Nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 mb-4">
                  {member.fullName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <h2 className="text-xl font-bold">{member.fullName}</h2>
                <p className="text-gray-500">{member.position}</p>
                <div className="mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200">
                    {member.squad.name}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">PID</p>
                    <p className="font-medium">{member.pid}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{member.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Team</p>
                    <p className="font-medium">{member.squad.name}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between">
                  <Link href="/">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Xem Lịch Stand-up</span>
                    </Button>
                  </Link>
                  <Link href="/members">
                    <Button variant="outline">Danh Sách Thành Viên</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Lịch Trình</CardTitle>
              <CardDescription>Thông tin về lịch host standup và trực incident</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Standup hosting */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-700 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg">Host Stand-up</h3>
                      {nextStandupHosting ? (
                        <div className="mt-2">
                          <p className="text-gray-600">Lần host tiếp theo:</p>
                          <p className="text-lg font-medium mt-1">
                            {new Date(nextStandupHosting.date).toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 mt-2">Không tìm thấy thông tin lịch host sắp tới.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Incident duty - only for squads with incident roster */}
                {member.squad.hasIncidentRoster && (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-gray-700 mt-1" />
                      <div>
                        <h3 className="font-medium text-lg">Trực Incident</h3>
                        {nextIncidentDuty ? (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-600">Vai trò:</p>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200">
                                {nextIncidentDuty.role === "primary" ? "Primary" : "Secondary"}
                              </span>
                            </div>

                            <div className="mt-2">
                              <p className="text-gray-600">Thời gian trực:</p>
                              <p className="text-lg font-medium mt-1">
                                {nextIncidentDuty.startDate.toLocaleDateString("vi-VN", {
                                  day: "numeric",
                                  month: "numeric",
                                })}{" "}
                                -{" "}
                                {nextIncidentDuty.endDate.toLocaleDateString("vi-VN", {
                                  day: "numeric",
                                  month: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 mt-2">Không tìm thấy thông tin lịch trực incident sắp tới.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent history */}
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-4">Lịch Sử Gần Đây</h3>
                  <div className="space-y-3">
                    {recentStandupHistory.map((hosting) => (
                      <div key={hosting.id} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">Host Stand-up</p>
                          <p className="text-sm text-gray-500">
                            {new Date(hosting.date).toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{hosting.status}</span>
                      </div>
                    ))}

                    {member.squad.hasIncidentRoster && recentIncidentHistory.map((rotation) => (
                      <div key={rotation.id} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Trực Incident ({rotation.primaryMemberId === member.id ? "Primary" : "Secondary"})
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(rotation.startDate).toLocaleDateString("vi-VN", {
                              day: "numeric",
                              month: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(rotation.endDate).toLocaleDateString("vi-VN", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {new Date(rotation.endDate) < new Date() ? "Hoàn thành" : "Chưa hoàn thành"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

