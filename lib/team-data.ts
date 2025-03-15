// Dữ liệu chi tiết của các thành viên trong team

export type TeamMember = {
  id: string
  name: string
  pid: string
  email: string
  phone: string
  team: "Sonic" | "Troy"
  position: string
  avatar?: string
  squadName?: string
}

export const teamMembers: TeamMember[] = [
  // Team Sonic
  {
    id: "andy-le",
    name: "Andy Le",
    pid: "S001",
    email: "andy.le@company.com",
    phone: "0901 234 567",
    team: "Sonic",
    position: "Frontend Developer",
    squadName: "Squad Sonic",
  },
  {
    id: "daniel-nguyen",
    name: "Daniel Nguyen",
    pid: "S002",
    email: "daniel.nguyen@company.com",
    phone: "0902 345 678",
    team: "Sonic",
    position: "Backend Developer",
    squadName: "Squad Sonic",
  },
  {
    id: "chicharito-vu",
    name: "Chicharito Vu",
    pid: "S003",
    email: "chicharito.vu@company.com",
    phone: "0903 456 789",
    team: "Sonic",
    position: "DevOps Engineer",
    squadName: "Squad Sonic",
  },
  {
    id: "phuc-nguyen",
    name: "Phuc Nguyen",
    pid: "S004",
    email: "phuc.nguyen@company.com",
    phone: "0904 567 890",
    team: "Sonic",
    position: "QA Engineer",
    squadName: "Squad Sonic",
  },
  {
    id: "viet-anh",
    name: "Viet Anh",
    pid: "S005",
    email: "viet.anh@company.com",
    phone: "0905 678 901",
    team: "Sonic",
    position: "Product Manager",
    squadName: "Squad Sonic",
  },
  {
    id: "hoa-nguyen",
    name: "Hoa Nguyen",
    pid: "S006",
    email: "hoa.nguyen@company.com",
    phone: "0906 789 012",
    team: "Sonic",
    position: "UI/UX Designer",
    squadName: "Squad Sonic",
  },
  {
    id: "tony-dai",
    name: "Tony Dai",
    pid: "S007",
    email: "tony.dai@company.com",
    phone: "0907 890 123",
    team: "Sonic",
    position: "Full Stack Developer",
    squadName: "Squad Sonic",
  },

  // Team Troy
  {
    id: "harry-nguyen",
    name: "Harry Nguyen",
    pid: "T001",
    email: "harry.nguyen@company.com",
    phone: "0908 901 234",
    team: "Troy",
    position: "Team Lead",
    squadName: "Squad Troy",
  },
  {
    id: "dany-nguyen",
    name: "Dany Nguyen",
    pid: "T002",
    email: "dany.nguyen@company.com",
    phone: "0909 012 345",
    team: "Troy",
    position: "Backend Developer",
    squadName: "Squad Troy",
  },
  {
    id: "kiet-chung",
    name: "Kiet Chung",
    pid: "T003",
    email: "kiet.chung@company.com",
    phone: "0910 123 456",
    team: "Troy",
    position: "Frontend Developer",
    squadName: "Squad Troy",
  },
  {
    id: "luy-hoang",
    name: "Luy Hoang",
    pid: "T004",
    email: "luy.hoang@company.com",
    phone: "0911 234 567",
    team: "Troy",
    position: "Data Analyst",
    squadName: "Squad Troy",
  },
]

// Hàm lấy danh sách thành viên theo team
export function getTeamMembers(team: "Sonic" | "Troy"): TeamMember[] {
  return teamMembers.filter((member) => member.team === team)
}

// Hàm lấy thông tin chi tiết của một thành viên theo ID
export function getMemberById(id: string): TeamMember | undefined {
  return teamMembers.find((member) => member.id === id)
}

// Hàm lấy thông tin chi tiết của một thành viên theo tên
export function getMemberByName(name: string): TeamMember | undefined {
  return teamMembers.find((member) => member.name === name)
}

