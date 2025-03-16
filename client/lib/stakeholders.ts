// Định nghĩa kiểu dữ liệu cho Stakeholder
export type Stakeholder = {
  code: StakeholderType
  name: string
  description: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  groupName?: string
}

// Định nghĩa các loại Stakeholder
export type StakeholderType = "Fraud" | "BEB" | "ECOM" | "CM" | "CE" | "Other"

// Dữ liệu chi tiết của các Stakeholder
export const stakeholders: Stakeholder[] = [
  {
    code: "Fraud",
    name: "Fraud & Security",
    description: "Phòng ban chịu trách nhiệm về an ninh và phòng chống gian lận trong hệ thống.",
    contactName: "Minh Nguyen",
    contactEmail: "minh.nguyen@company.com",
    contactPhone: "0912 345 678",
    groupName: "Risk Management",
  },
  {
    code: "BEB",
    name: "Backend for Business",
    description: "Phòng ban phát triển và duy trì các dịch vụ backend cho các ứng dụng doanh nghiệp.",
    contactName: "Tuan Le",
    contactEmail: "tuan.le@company.com",
    contactPhone: "0923 456 789",
    groupName: "Engineering",
  },
  {
    code: "ECOM",
    name: "Enterprise Customer Onboarding",
    description: "Phòng ban chịu trách nhiệm về quy trình onboarding khách hàng doanh nghiệp.",
    contactName: "Linh Tran",
    contactEmail: "linh.tran@company.com",
    contactPhone: "0934 567 890",
    groupName: "Customer Success",
  },
  {
    code: "CM",
    name: "Content Management",
    description: "Phòng ban quản lý nội dung và truyền thông cho các sản phẩm và dịch vụ.",
    contactName: "Huy Pham",
    contactEmail: "huy.pham@company.com",
    contactPhone: "0945 678 901",
    groupName: "Marketing",
  },
  {
    code: "CE",
    name: "Customer Entity",
    description: "Phòng ban quản lý dữ liệu và thông tin khách hàng trong hệ thống.",
    contactName: "Mai Nguyen",
    contactEmail: "mai.nguyen@company.com",
    contactPhone: "0956 789 012",
    groupName: "Data Management",
  },
  {
    code: "Other",
    name: "Other Stakeholders",
    description: "Các bên liên quan khác không thuộc các nhóm chính.",
    groupName: "Various",
  },
]

// Hàm lấy thông tin chi tiết của một Stakeholder theo code
export function getStakeholderByCode(code: StakeholderType): Stakeholder | undefined {
  return stakeholders.find((stakeholder) => stakeholder.code === code)
}

