import { type TeamMember, teamMembers } from "./team-data"

export type StakeholderType = "Fraud" | "BEB" | "ECOM" | "CM" | "CE" | "Other"

export type TaskPriority = "High" | "Medium" | "Low"

export type Task = {
  id: string
  featureId: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  points: number // Số ngày cần hoàn thành
  assignees: string[] // Danh sách tên các thành viên
  stakeholders: StakeholderType[]
  priority: TaskPriority
  status: "Not Started" | "In Progress" | "Completed" | "Blocked"
  progress: number // 0-100%
  squad: "Sonic" | "Troy" // Thêm trường squad để phân biệt task của từng squad
}

// Hàm helper để tạo ngày tương đối so với ngày hiện tại
function getRelativeDate(daysFromNow: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date
}

// Cập nhật danh sách các task mẫu
export const tasks: Task[] = [
  {
    id: "task-1",
    featureId: "F12345",
    title: "Tích hợp hệ thống thanh toán mới",
    description:
      "Tích hợp API thanh toán mới từ đối tác và cập nhật giao diện người dùng để hỗ trợ các phương thức thanh toán mới.",
    startDate: getRelativeDate(-2),
    endDate: getRelativeDate(3),
    points: 5,
    assignees: ["Daniel Nguyen", "Phuc Nguyen", "Viet Anh"],
    stakeholders: ["ECOM", "CE"],
    priority: "High",
    status: "In Progress",
    progress: 60,
    squad: "Sonic",
  },
  {
    id: "task-2",
    featureId: "F12346",
    title: "Cải thiện hiệu suất trang chủ",
    description:
      "Tối ưu hóa thời gian tải trang chủ bằng cách cải thiện các truy vấn cơ sở dữ liệu và triển khai bộ nhớ đệm.",
    startDate: getRelativeDate(0),
    endDate: getRelativeDate(4),
    points: 3,
    assignees: ["Andy Le", "Tony Dai"],
    stakeholders: ["CE"],
    priority: "Medium",
    status: "In Progress",
    progress: 30,
    squad: "Sonic",
  },
  {
    id: "task-3",
    featureId: "F12347",
    title: "Triển khai hệ thống phát hiện gian lận",
    description:
      "Phát triển và triển khai thuật toán phát hiện gian lận mới để giảm thiểu rủi ro gian lận trong giao dịch.",
    startDate: getRelativeDate(-1),
    endDate: getRelativeDate(9),
    points: 8,
    assignees: ["Chicharito Vu", "Hoa Nguyen"],
    stakeholders: ["Fraud", "ECOM"],
    priority: "High",
    status: "In Progress",
    progress: 40,
    squad: "Sonic",
  },
  {
    id: "task-4",
    featureId: "F12348",
    title: "Cập nhật trang thông tin cá nhân",
    description:
      "Thiết kế lại trang thông tin cá nhân để cải thiện trải nghiệm người dùng và bổ sung các tính năng mới.",
    startDate: getRelativeDate(2),
    endDate: getRelativeDate(6),
    points: 4,
    assignees: ["Harry Nguyen", "Kiet Chung"],
    stakeholders: ["CE"],
    priority: "Medium",
    status: "Not Started",
    progress: 0,
    squad: "Troy",
  },
  {
    id: "task-5",
    featureId: "F12349",
    title: "Tích hợp API đối tác mới",
    description: "Tích hợp API từ đối tác mới để mở rộng dịch vụ và cung cấp thêm tính năng cho người dùng.",
    startDate: getRelativeDate(-3),
    endDate: getRelativeDate(1),
    points: 4,
    assignees: ["Dany Nguyen", "Luy Hoang"],
    stakeholders: ["BEB", "ECOM"],
    priority: "High",
    status: "In Progress",
    progress: 75,
    squad: "Troy",
  },
  {
    id: "task-6",
    featureId: "F12350",
    title: "Cải thiện quy trình đăng ký",
    description: "Đơn giản hóa quy trình đăng ký để tăng tỷ lệ chuyển đổi và cải thiện trải nghiệm người dùng mới.",
    startDate: getRelativeDate(4),
    endDate: getRelativeDate(7),
    points: 3,
    assignees: ["Andy Le", "Viet Anh"],
    stakeholders: ["CE", "CM"],
    priority: "Medium",
    status: "Not Started",
    progress: 0,
    squad: "Sonic",
  },
  {
    id: "task-7",
    featureId: "F12351",
    title: "Phát triển tính năng thông báo mới",
    description: "Phát triển hệ thống thông báo mới để cải thiện tương tác với người dùng và tăng mức độ tương tác.",
    startDate: getRelativeDate(7),
    endDate: getRelativeDate(11),
    points: 4,
    assignees: ["Daniel Nguyen", "Tony Dai"],
    stakeholders: ["CE", "CM"],
    priority: "Low",
    status: "Not Started",
    progress: 0,
    squad: "Sonic",
  },
  {
    id: "task-8",
    featureId: "F12352",
    title: "Tối ưu hóa SEO",
    description: "Triển khai các thay đổi để cải thiện thứ hạng tìm kiếm và tăng lưu lượng truy cập hữu cơ.",
    startDate: getRelativeDate(1),
    endDate: getRelativeDate(5),
    points: 4,
    assignees: ["Phuc Nguyen", "Hoa Nguyen"],
    stakeholders: ["CM"],
    priority: "Medium",
    status: "In Progress",
    progress: 50,
    squad: "Sonic",
  },
  {
    id: "task-9",
    featureId: "F12353",
    title: "Cập nhật chính sách bảo mật",
    description: "Cập nhật chính sách bảo mật để tuân thủ các quy định mới và cải thiện bảo vệ dữ liệu người dùng.",
    startDate: getRelativeDate(8),
    endDate: getRelativeDate(10),
    points: 2,
    assignees: ["Chicharito Vu"],
    stakeholders: ["BEB", "CE"],
    priority: "High",
    status: "Not Started",
    progress: 0,
    squad: "Sonic",
  },
  {
    id: "task-10",
    featureId: "F12354",
    title: "Triển khai hệ thống phân tích dữ liệu mới",
    description: "Triển khai hệ thống phân tích dữ liệu mới để cải thiện việc ra quyết định dựa trên dữ liệu.",
    startDate: getRelativeDate(-5),
    endDate: getRelativeDate(10),
    points: 10,
    assignees: ["Kiet Chung", "Luy Hoang", "Harry Nguyen"],
    stakeholders: ["BEB", "ECOM", "CM"],
    priority: "High",
    status: "In Progress",
    progress: 20,
    squad: "Troy",
  },
  {
    id: "task-11",
    featureId: "F12355",
    title: "Phát triển tính năng chat trực tiếp",
    description: "Xây dựng hệ thống chat trực tiếp để hỗ trợ khách hàng ngay trên trang web và ứng dụng di động.",
    startDate: getRelativeDate(0),
    endDate: getRelativeDate(7),
    points: 6,
    assignees: ["Harry Nguyen", "Dany Nguyen"],
    stakeholders: ["CE", "CM"],
    priority: "Medium",
    status: "Not Started",
    progress: 0,
    squad: "Troy",
  },
  {
    id: "task-12",
    featureId: "F12356",
    title: "Tối ưu hóa quy trình thanh toán",
    description: "Cải thiện trải nghiệm thanh toán để giảm tỷ lệ bỏ giỏ hàng và tăng tỷ lệ chuyển đổi.",
    startDate: getRelativeDate(-1),
    endDate: getRelativeDate(5),
    points: 5,
    assignees: ["Kiet Chung", "Luy Hoang"],
    stakeholders: ["ECOM", "CE"],
    priority: "High",
    status: "In Progress",
    progress: 35,
    squad: "Troy",
  },
]

// Hàm lấy top 5 task quan trọng nhất trong tuần theo squad
export function getTopTasksForWeek(date: Date, squad: "Sonic" | "Troy"): Task[] {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)) // Lấy thứ 2 đầu tuần
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Chủ nhật cuối tuần
  endOfWeek.setHours(23, 59, 59, 999)

  // Lọc các task trong tuần và theo squad
  const tasksInWeek = tasks.filter((task) => {
    return (
      task.squad === squad &&
      ((task.startDate <= endOfWeek && task.endDate >= startOfWeek) || // Task diễn ra trong tuần
        (task.startDate >= startOfWeek && task.startDate <= endOfWeek) || // Task bắt đầu trong tuần
        (task.endDate >= startOfWeek && task.endDate <= endOfWeek)) // Task kết thúc trong tuần
    )
  })

  // Sắp xếp theo độ ưu tiên và tiến độ
  const sortedTasks = tasksInWeek.sort((a, b) => {
    // Ưu tiên theo mức độ ưu tiên
    const priorityOrder = { High: 0, Medium: 1, Low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }

    // Nếu cùng mức độ ưu tiên, ưu tiên task có deadline sớm hơn
    return a.endDate.getTime() - b.endDate.getTime()
  })

  // Trả về top 5 task
  return sortedTasks.slice(0, 5)
}

// Hàm lấy tất cả task trong tháng theo squad
export function getTasksForMonth(date: Date, squad: "Sonic" | "Troy"): Task[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999)

  // Lọc các task trong tháng và theo squad
  return tasks.filter((task) => {
    return (
      task.squad === squad &&
      ((task.startDate <= endOfMonth && task.endDate >= startOfMonth) || // Task diễn ra trong tháng
        (task.startDate >= startOfMonth && task.startDate <= endOfMonth) || // Task bắt đầu trong tháng
        (task.endDate >= startOfMonth && task.endDate <= endOfMonth)) // Task kết thúc trong tháng
    )
  })
}

// Hàm lấy thông tin chi tiết của một task theo ID
export function getTaskById(taskId: string): Task | undefined {
  return tasks.find((task) => task.id === taskId)
}

// Hàm lấy thông tin chi tiết của các thành viên được gán cho một task
export function getTaskAssignees(task: Task): TeamMember[] {
  return teamMembers.filter((member) => task.assignees.includes(member.name))
}

