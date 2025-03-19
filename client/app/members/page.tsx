"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search, Users } from "lucide-react"
import { fetchSquads, fetchSquadMembers, type Squad, type SquadMember } from "@/lib/api"

interface MemberWithTeamInfo extends SquadMember {
  squadId: string
  squadName: string
}

export default function MembersPage() {
  const [activeTeam, setActiveTeam] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)
  const [squads, setSquads] = useState<Squad[]>([])
  const [members, setMembers] = useState<MemberWithTeamInfo[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch squads and initial members data
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const squadsData = await fetchSquads()
        setSquads(squadsData)

        // Set initial active squad
        if (squadsData.length > 0) {
          const initialSquadCode = squadsData[0].code
          setActiveTeam(initialSquadCode)
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch members when active team changes
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true)
        const currentSquad = squads.find(squad => squad.code === activeTeam)
        if (currentSquad) {
          const membersData = await fetchSquadMembers(currentSquad.id)
          const membersWithTeam = membersData.map(member => ({
            ...member,
            squadId: currentSquad.id,
            squadName: currentSquad.name
          }))
          setMembers(membersWithTeam)
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
      } finally {
        setLoading(false)
      }
    }

    if (squads.length > 0 && activeTeam) {
      fetchTeamMembers()
    }
  }, [activeTeam, squads])

  // Read query parameter when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setSearchParams(params)

      const squadParam = params.get("squad")
      if (squadParam && squads.some(squad => squad.code === squadParam)) {
        setActiveTeam(squadParam)
      }
    }
  }, [squads])

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentSquad = squads.find(squad => squad.code === activeTeam)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Thông Tin Thành Viên</h1>
                <p className="text-gray-500">Danh sách chi tiết các thành viên trong team</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Lịch Standup</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Team selector */}
          <div className="mt-6 mb-4">
            <Tabs
              value={activeTeam}
              className="w-full"
              onValueChange={setActiveTeam}
            >
              <TabsList className="grid w-full max-w-md" style={{ gridTemplateColumns: `repeat(${squads.length}, 1fr)` }}>
                {squads.map(squad => (
                  <TabsTrigger key={squad.id} value={squad.code}>
                    {squad.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Members list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500">Đang tải danh sách thành viên...</p>
            </div>
          ) : (
            <>
              {filteredMembers.map((member) => (
                <Link href={`/members/${member.id}`} key={member.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{member.fullName}</CardTitle>
                          <CardDescription>PID: {member.pid}</CardDescription>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">
                          {member.fullName
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium">{member.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vị trí:</span>
                          <span className="font-medium">{member.position}</span>
                        </div>
                        <div className="pt-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200">
                            {member.squadName}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {filteredMembers.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-500">Không tìm thấy thành viên nào phù hợp với từ khóa tìm kiếm.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

