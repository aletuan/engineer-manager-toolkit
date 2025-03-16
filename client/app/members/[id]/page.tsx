"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getMemberById, type TeamMember } from "@/lib/team-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, User, Building, Calendar, Shield } from "lucide-react"
import { getNextHostingDate } from "@/lib/rotation"
import { getNextIncidentDuty } from "@/lib/incident-roster"

export default function MemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [nextHostingDate, setNextHostingDate] = useState<Date | null>(null)
  const [nextIncidentDuty, setNextIncidentDuty] = useState<{
    role: "primary" | "secondary" | null
    startDate: Date | null
    endDate: Date | null
  }>({ role: null, startDate: null, endDate: null })

  useEffect(() => {
    if (params.id) {
      const memberData = getMemberById(params.id as string)
      if (memberData) {
        setMember(memberData)

        // Tìm ngày host standup tiếp theo
        const nextDate = getNextHostingDate(memberData.name)
        setNextHostingDate(nextDate)

        // Tìm lịch trực incident tiếp theo (chỉ cho Team Sonic)
        if (memberData.team === "Sonic") {
          const duty = getNextIncidentDuty(memberData.name)
          setNextIncidentDuty(duty)
        }
      } else {
        // Nếu không tìm thấy thành viên, chuyển về trang danh sách
        router.push("/members")
      }
    }
  }, [params.id, router])

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Đang tải thông tin...</p>
      </div>
    )
  }

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
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <h2 className="text-xl font-bold">{member.name}</h2>
                <p className="text-gray-500">{member.position}</p>
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.team === "Sonic" ? "bg-gray-200" : "bg-gray-300"
                    }`}
                  >
                    {member.squadName || `Squad ${member.team}`}
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
                    <p className="font-medium">{member.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Team</p>
                    <p className="font-medium">{member.squadName || `Squad ${member.team}`}</p>
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
                      {nextHostingDate ? (
                        <div className="mt-2">
                          <p className="text-gray-600">Lần host tiếp theo:</p>
                          <p className="text-lg font-medium mt-1">
                            {nextHostingDate.toLocaleDateString("vi-VN", {
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

                {/* Incident duty - only for Team Sonic */}
                {member.team === "Sonic" && (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-gray-700 mt-1" />
                      <div>
                        <h3 className="font-medium text-lg">Trực Incident</h3>
                        {nextIncidentDuty.role ? (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-600">Vai trò:</p>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200">
                                {nextIncidentDuty.role === "primary" ? "Primary" : "Secondary"}
                              </span>
                            </div>

                            {nextIncidentDuty.startDate && nextIncidentDuty.endDate && (
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
                            )}
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
                    <div className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">Host Stand-up</p>
                        <p className="text-sm text-gray-500">Thứ Hai, 04/03/2024</p>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">Hoàn thành</span>
                    </div>

                    {member.team === "Sonic" && (
                      <>
                        <div className="p-3 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">Trực Incident (Primary)</p>
                            <p className="text-sm text-gray-500">15/02/2024 - 28/02/2024</p>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Hoàn thành</span>
                        </div>
                        <div className="p-3 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">Trực Incident (Secondary)</p>
                            <p className="text-sm text-gray-500">01/01/2024 - 14/01/2024</p>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Hoàn thành</span>
                        </div>
                      </>
                    )}
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

