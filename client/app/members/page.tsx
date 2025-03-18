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
  team: "Sonic" | "Troy"
  squadName: string
}

export default function MembersPage() {
  const [activeTeam, setActiveTeam] = useState<"Sonic" | "Troy">("Sonic")
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

        // Get initial squad ID based on active team
        const initialSquad = squadsData.find(squad => squad.name.includes(activeTeam))
        if (initialSquad) {
          const membersData = await fetchSquadMembers(initialSquad.id)
          const membersWithTeam = membersData.map(member => ({
            ...member,
            team: activeTeam,
            squadName: initialSquad.name
          }))
          setMembers(membersWithTeam)
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch members when active team changes
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true)
        const currentSquad = squads.find(squad => squad.name.includes(activeTeam))
        if (currentSquad) {
          const membersData = await fetchSquadMembers(currentSquad.id)
          const membersWithTeam = membersData.map(member => ({
            ...member,
            team: activeTeam,
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

    if (squads.length > 0) {
      fetchTeamMembers()
    }
  }, [activeTeam, squads])

  // Read query parameter when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setSearchParams(params)

      const squadParam = params.get("squad")
      if (squadParam === "Sonic" || squadParam === "Troy") {
        setActiveTeam(squadParam)
      }
    }
  }, [])

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              defaultValue={activeTeam}
              value={activeTeam}
              className="w-full"
              onValueChange={(value) => setActiveTeam(value as "Sonic" | "Troy")}
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="Sonic">Squad Sonic</TabsTrigger>
                <TabsTrigger value="Troy">Squad Troy</TabsTrigger>
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
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              member.team === "Sonic" ? "bg-gray-200" : "bg-gray-300"
                            }`}
                          >
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

