"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { format, addDays, getDay } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { isWeekend } from "date-fns"
import { vietnameseHolidays } from "@/lib/holidays"
import type { Squad, SquadMember, StandupHosting, IncidentRotation } from "@/lib/api"
import { fetchStandupHosting, fetchIncidentRotation } from "@/lib/api"

interface WeekHostsProps {
  squad: Squad;
  cachedData?: {
    squadMembers: SquadMember[];
    standupHostings: StandupHosting[];
    incidentRotations: IncidentRotation[];
  };
}

// Cache lưu trữ data theo squadId
interface CacheEntry {
  timestamp: number;
  standupHostings: StandupHosting[];
  incidentRotations: IncidentRotation[];
}

const dataCache = new Map<string, CacheEntry>();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 phút cache

export function WeekHosts({ squad, cachedData }: WeekHostsProps) {
  const [standupHostings, setStandupHostings] = useState<StandupHosting[]>([])
  const [incidentRotations, setIncidentRotations] = useState<IncidentRotation[]>([])
  const [isLoading, setIsLoading] = useState(!cachedData)
  const [isError, setIsError] = useState(false)
  
  // Sử dụng useRef để lưu trữ request đang xử lý
  const requestInProgress = useRef<boolean>(false);
  const prevSquadId = useRef<string>("");
  
  // Tính weekDays một lần và cache lại
  const weekDays = useMemo(() => {
    const today = new Date()
    const dayOfWeek = getDay(today)
    const startDay = addDays(today, dayOfWeek === 0 ? -6 : 1 - dayOfWeek) // Start from Monday
    return Array.from({ length: 5 }, (_, i) => addDays(startDay, i))
  }, []);
  
  // Tính toán date range một lần
  const dateRange = useMemo(() => {
    const startDate = format(weekDays[0], "yyyy-MM-dd")
    const endDate = format(weekDays[weekDays.length - 1], "yyyy-MM-dd")
    return { startDate, endDate }
  }, [weekDays]);

  // Sử dụng cached data nếu có
  useEffect(() => {
    if (cachedData) {
      setStandupHostings(cachedData.standupHostings);
      setIncidentRotations(cachedData.incidentRotations);
      setIsLoading(false);
      return;
    }
  }, [cachedData]);

  // Fetch data when squad changes with debounce - chỉ gọi khi không có cachedData
  useEffect(() => {
    if (!squad.id || cachedData) return;
    
    // Nếu đang có request đang xử lý, không gọi tiếp
    if (requestInProgress.current) {
      console.log('Request in progress, skipping...');
      return;
    }
    
    // Nếu squadId không thay đổi, không làm gì
    if (squad.id === prevSquadId.current) {
      return;
    }
    
    prevSquadId.current = squad.id;
    
    // Debounce để tránh gọi API liên tục khi chuyển squad nhanh
    const timeoutId = setTimeout(async () => {
      // Đánh dấu đang xử lý request
      requestInProgress.current = true;
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Kiểm tra cache trước khi gọi API
        const cacheKey = squad.id;
        const cachedData = dataCache.get(cacheKey);
        const now = Date.now();
        
        // Nếu có cache và cache còn hiệu lực, sử dụng cache
        if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY_TIME)) {
          console.log('Using cached WeekHosts data for squad:', squad.name);
          setStandupHostings(cachedData.standupHostings);
          setIncidentRotations(cachedData.incidentRotations);
          setIsLoading(false);
          requestInProgress.current = false;
          return;
        }
        
        // Tạo delay giữa các API calls
        const fetchWithDelay = async <T,>(promise: Promise<T>): Promise<T> => {
          const result = await promise.catch(error => {
            console.error('API call failed:', error);
            throw error;
          });
          // Delay 300ms giữa các API calls
          await new Promise(resolve => setTimeout(resolve, 300));
          return result;
        };
        
        // Gọi API tuần tự để tránh rate limiting
        const hostings = await fetchWithDelay(
          fetchStandupHosting(squad.id, dateRange.startDate, dateRange.endDate)
        );
        
        const rotations = squad.hasIncidentRoster 
          ? await fetchWithDelay(
              fetchIncidentRotation(squad.id, dateRange.startDate, dateRange.endDate)
            ) 
          : [];

        // Lưu kết quả vào cache
        dataCache.set(cacheKey, {
          timestamp: now,
          standupHostings: hostings,
          incidentRotations: rotations
        });
        
        setStandupHostings(hostings);
        setIncidentRotations(rotations);
      } catch (error) {
        console.error('Error fetching week hosts data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
        // Kết thúc request
        requestInProgress.current = false;
      }
    }, 300); // Debounce 300ms
    
    // Cleanup function khi component unmount hoặc khi squad thay đổi
    return () => {
      clearTimeout(timeoutId);
    };
  }, [squad.id, squad.hasIncidentRoster, squad.name, dateRange, cachedData]);

  // Helper functions được memoized
  const hostingMap = useMemo(() => {
    const map = new Map<string, SquadMember | null>();
    
    standupHostings.forEach(hosting => {
      if (hosting && hosting.date) {
        const dateStr = format(new Date(hosting.date), "yyyy-MM-dd");
        if (hosting.member) {
          map.set(dateStr, {
            id: hosting.member.id,
            fullName: hosting.member.fullName,
            email: hosting.member.email,
            position: hosting.member.position,
            avatarUrl: hosting.member.avatarUrl,
            squadId: squad.id,
            squadName: squad.name,
            pid: hosting.member.id
          });
        }
      }
    });
    
    return map;
  }, [standupHostings, squad.id, squad.name]);
  
  // Tìm host cho ngày cụ thể - O(1) lookup
  const getHostForDate = (date: Date): SquadMember | null => {
    if (!date) return null;
    const dateStr = format(date, "yyyy-MM-dd");
    return hostingMap.get(dateStr) || null;
  };
  
  // Rotation map cũng được memoize
  const rotationMap = useMemo(() => {
    const map = new Map<string, { primary: SquadMember | null, secondary: SquadMember | null }>();
    
    // Pre-calculate giá trị cho mỗi ngày trong tuần
    weekDays.forEach(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      
      // Find rotation for this date
      const rotation = incidentRotations.find(r => {
        if (!r || !r.startDate || !r.endDate) return false;
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        const checkDate = new Date(dateStr);
        return checkDate >= start && checkDate <= end;
      });
      
      if (!rotation) {
        map.set(dateStr, { primary: null, secondary: null });
        return;
      }
      
      // Check for swaps
      const swap = rotation.swaps?.find(s => 
        s && s.swapDate && 
        format(new Date(s.swapDate), "yyyy-MM-dd") === dateStr && 
        s.status === 'APPROVED'
      );
      
      // Convert API member type to SquadMember type
      const convertToSquadMember = (member: { 
        id: string;
        fullName: string;
        email: string;
        position: string;
        avatarUrl?: string;
      } | null): SquadMember | null => {
        if (!member) return null;
        return {
          id: member.id,
          fullName: member.fullName,
          email: member.email,
          position: member.position,
          avatarUrl: member.avatarUrl,
          squadId: squad.id,
          squadName: squad.name,
          pid: member.id
        };
      };
      
      let primary = convertToSquadMember(rotation.primaryMember);
      let secondary = convertToSquadMember(rotation.secondaryMember);
      
      // Apply swaps
      if (swap) {
        if (swap.requesterId === rotation.primaryMemberId) {
          primary = convertToSquadMember(swap.accepter);
        } else if (swap.requesterId === rotation.secondaryMemberId) {
          secondary = convertToSquadMember(swap.accepter);
        }
      }
      
      map.set(dateStr, { primary, secondary });
    });
    
    return map;
  }, [incidentRotations, weekDays, squad.id, squad.name]);
  
  // Tìm incident responders cho ngày cụ thể - O(1) lookup
  const getIncidentResponders = (date: Date): { primary: SquadMember | null, secondary: SquadMember | null } => {
    if (!date) return { primary: null, secondary: null };
    const dateStr = format(date, "yyyy-MM-dd");
    return rotationMap.get(dateStr) || { primary: null, secondary: null };
  };
  
  // Helpers được memoize
  const isHostingDay = (date: Date) => {
    if (isWeekend(date)) return false;
    const dateString = format(date, "yyyy-MM-dd");
    return !vietnameseHolidays.some((holiday) => holiday.date === dateString);
  };
  
  const getHolidayName = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const holiday = vietnameseHolidays.find((h) => h.date === dateString);
    return holiday ? holiday.name : null;
  };

  // Tải lại dữ liệu
  const handleRetry = () => {
    // Reset cache cho squad này
    dataCache.delete(squad.id);
    // Force reset requestInProgress
    requestInProgress.current = false;
    // Force re-render
    setIsLoading(true);
    prevSquadId.current = "";
  };
  
  if (isError) {
    return (
      <div className="mt-8 border-t pt-6">
        <div className="text-center py-6">
          <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-8 border-t pt-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="font-medium mb-4">Host tuần này:</h3>
      <div className="grid grid-cols-5 gap-2">
        {weekDays.map((day, i) => {
          const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
          const isHostDay = isHostingDay(day)
          const host = isHostDay ? getHostForDate(day) : null
          const holidayName = getHolidayName(day)

          // Only get incident responders for Team Sonic
          const { primary: dayPrimary, secondary: daySecondary } = squad.hasIncidentRoster
            ? getIncidentResponders(day)
            : { primary: null, secondary: null }

          return (
            <Card key={i} className={`overflow-hidden ${isToday ? "border-primary" : ""}`}>
              <div className={`p-2 text-center text-sm ${isToday ? "bg-primary text-white" : "bg-gray-100"}`}>
                {format(day, "EEEE", { locale: vi })}
              </div>
              <CardContent className="p-3 text-center">
                {holidayName ? (
                  <div className="text-xs text-red-500">{holidayName}</div>
                ) : host ? (
                  <Link href={`/members/${host.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="font-medium mb-2 bg-green-100 text-green-800 rounded-full px-2 py-1 hover:bg-green-200 transition-colors"
                    >
                      {host.fullName}
                    </motion.div>
                  </Link>
                ) : (
                  <div className="text-gray-500 text-sm mb-2">Không có standup</div>
                )}

                {/* Only show incident responders for Team Sonic */}
                {squad.hasIncidentRoster && (
                  <div className="text-xs flex flex-col gap-1 mt-2">
                    <Link href={dayPrimary ? `/members/${dayPrimary.id}` : "#"}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 hover:bg-blue-200 transition-colors"
                      >
                        <span className="font-medium">P:</span>{" "}
                        {dayPrimary ? (
                          <span className="hover:text-blue-600">
                            {dayPrimary.fullName}
                          </span>
                        ) : 'Không có primary'}
                      </motion.div>
                    </Link>
                    <Link href={daySecondary ? `/members/${daySecondary.id}` : "#"}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 hover:bg-purple-200 transition-colors"
                      >
                        <span className="font-medium">S:</span>{" "}
                        {daySecondary ? (
                          <span className="hover:text-purple-600">
                            {daySecondary.fullName}
                          </span>
                        ) : 'Không có secondary'}
                      </motion.div>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 