"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { isWeekend } from "date-fns"
import { vietnameseHolidays } from "@/lib/holidays"
import { format } from "date-fns"
import type { Squad, SquadMember, StandupHosting, IncidentRotation } from "@/lib/api"
import { fetchSquadMembers, fetchStandupHosting, fetchIncidentRotation } from "@/lib/api"

interface TeamMembersProps {
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
  squadMembers: SquadMember[];
  standupHostings: StandupHosting[];
  incidentRotations: IncidentRotation[];
}

const dataCache = new Map<string, CacheEntry>();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 phút cache

export function TeamMembers({ squad, cachedData }: TeamMembersProps) {
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([])
  const [standupHostings, setStandupHostings] = useState<StandupHosting[]>([])
  const [incidentRotations, setIncidentRotations] = useState<IncidentRotation[]>([])
  const [isLoading, setIsLoading] = useState(!cachedData)
  const [isError, setIsError] = useState(false)
  
  // Sử dụng useRef để kiểm soát và tránh gọi API nhiều lần
  const requestInProgress = useRef<boolean>(false);
  const prevSquadId = useRef<string>("");
  
  // Ngày hôm nay được memoized
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => format(today, "yyyy-MM-dd"), [today]);

  // Sử dụng cached data nếu có
  useEffect(() => {
    if (cachedData) {
      setSquadMembers(cachedData.squadMembers);
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
          console.log('Using cached TeamMembers data for squad:', squad.name);
          setSquadMembers(cachedData.squadMembers);
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
        const members = await fetchWithDelay(
          fetchSquadMembers(squad.id)
        );
        
        const hostings = await fetchWithDelay(
          fetchStandupHosting(squad.id, todayStr, todayStr)
        );
        
        const rotations = squad.hasIncidentRoster 
          ? await fetchWithDelay(
              fetchIncidentRotation(squad.id, todayStr, todayStr)
            ) 
          : [];

        // Lưu kết quả vào cache
        dataCache.set(cacheKey, {
          timestamp: now,
          squadMembers: members,
          standupHostings: hostings,
          incidentRotations: rotations
        });
        
        setSquadMembers(members);
        setStandupHostings(hostings);
        setIncidentRotations(rotations);
      } catch (error) {
        console.error('Error fetching team members data:', error);
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
  }, [squad.id, squad.hasIncidentRoster, squad.name, todayStr, cachedData]);

  // Helper functions được memoized
  const isHostingDay = useMemo(() => (date: Date) => {
    if (isWeekend(date)) return false;
    const dateString = format(date, "yyyy-MM-dd");
    return !vietnameseHolidays.some((holiday) => holiday.date === dateString);
  }, []);

  // Xây dựng hostMap để tìm kiếm nhanh
  const hostMap = useMemo(() => {
    const map = new Map<string, SquadMember>();
    
    standupHostings.forEach(hosting => {
      if (hosting && hosting.date && hosting.member) {
        const dateStr = format(new Date(hosting.date), "yyyy-MM-dd");
        // Convert API member type to SquadMember type
        const member: SquadMember = {
          id: hosting.member.id,
          fullName: hosting.member.fullName,
          email: hosting.member.email,
          position: hosting.member.position,
          avatarUrl: hosting.member.avatarUrl,
          squadId: squad.id,
          squadName: squad.name,
          pid: hosting.member.id // Using member id as pid since it's not provided in the API
        };
        map.set(dateStr, member);
      }
    });
    
    return map;
  }, [standupHostings, squad.id, squad.name]);
  
  // Chỉ cần tìm host cho ngày hôm nay
  const getHostForDate = useMemo(() => (date: Date): SquadMember | null => {
    if (!date) return null;
    const dateStr = format(date, "yyyy-MM-dd");
    return hostMap.get(dateStr) || null;
  }, [hostMap]);

  // Xây dựng rotation map
  const rotationData = useMemo(() => {
    // Set default values
    let primary: SquadMember | null = null;
    let secondary: SquadMember | null = null;
    
    if (!squad.hasIncidentRoster || incidentRotations.length === 0) {
      return { primary, secondary };
    }
    
    const dateStr = todayStr;
    
    // Find rotation for today
    const rotation = incidentRotations.find(r => {
      if (!r || !r.startDate || !r.endDate) return false;
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= start && checkDate <= end;
    });
    
    if (!rotation) return { primary, secondary };
    
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
    
    primary = convertToSquadMember(rotation.primaryMember);
    secondary = convertToSquadMember(rotation.secondaryMember);
    
    // Apply swaps
    if (swap) {
      if (swap.requesterId === rotation.primaryMemberId) {
        primary = convertToSquadMember(swap.accepter);
      } else if (swap.requesterId === rotation.secondaryMemberId) {
        secondary = convertToSquadMember(swap.accepter);
      }
    }
    
    return { primary, secondary };
  }, [incidentRotations, squad.hasIncidentRoster, squad.id, squad.name, todayStr]);
  
  // Memoize các giá trị quan trọng để tránh tính toán lại
  const isHostingToday = useMemo(() => isHostingDay(today), [isHostingDay, today]);
  const hostToday = useMemo(() => isHostingToday ? getHostForDate(today) : null, [isHostingToday, getHostForDate, today]);
  const { primary, secondary } = rotationData;
  
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
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
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
      <div className="bg-white rounded-xl shadow-md p-6 mt-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">{squad.name}</h2>
      <div className="flex flex-wrap gap-3">
        {squadMembers.map((member, index) => {
          const isHostingToday = isHostingDay(today) && hostToday?.id === member.id
          const isPrimary = squad.hasIncidentRoster && primary?.id === member.id
          const isSecondary = squad.hasIncidentRoster && secondary?.id === member.id

          // Combine role indicators
          const roles = []
          if (isHostingToday) roles.push("H")
          if (isPrimary) roles.push("P")
          if (isSecondary) roles.push("S")
          const rolesText = roles.length > 0 ? ` (${roles.join(", ")})` : ""

          return (
            <Link
              key={index}
              href={`/members/${member.id}`}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  flex items-center gap-2
                  ${isHostingToday
                    ? "bg-primary text-white hover:bg-primary/90"
                    : isPrimary
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : isSecondary
                        ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <span>{member.fullName}</span>
                {rolesText && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${isHostingToday
                      ? "bg-white/20"
                      : isPrimary
                        ? "bg-blue-200"
                        : isSecondary
                          ? "bg-purple-200"
                          : "bg-gray-200"
                    }
                  `}>
                    {rolesText}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 