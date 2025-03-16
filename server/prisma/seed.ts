const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function seedRoles() {
  const roles = [
    {
      name: 'SQUAD_LEAD',
      description: 'Squad Lead responsible for team management and delivery',
      permissions: ['MANAGE_TEAM', 'MANAGE_TASKS', 'VIEW_REPORTS', 'MANAGE_ROLES']
    },
    {
      name: 'TECH_LEAD',
      description: 'Technical Lead responsible for technical decisions and architecture',
      permissions: ['MANAGE_TECHNICAL', 'REVIEW_CODE', 'VIEW_REPORTS']
    },
    {
      name: 'ENGINEER',
      description: 'Software Engineer responsible for development tasks',
      permissions: ['VIEW_TASKS', 'UPDATE_TASKS', 'VIEW_REPORTS']
    },
    {
      name: 'QA_ENGINEER',
      description: 'Quality Assurance Engineer responsible for testing',
      permissions: ['VIEW_TASKS', 'UPDATE_TASKS', 'VIEW_REPORTS']
    }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role
    });
  }
}

async function main() {
  console.log('Start seeding...')

  // Create Squads
  const sonicSquad = await prisma.squad.create({
    data: {
      name: 'Squad Sonic',
      code: 'SONIC',
      description: 'Frontend and Backend Development Team',
    },
  })

  const troySquad = await prisma.squad.create({
    data: {
      name: 'Squad Troy',
      code: 'TROY',
      description: 'Data and Analytics Team',
    },
  })

  // Create Users and Squad Members
  const sonicMembers = [
    {
      name: 'Andy Le',
      pid: 'S001',
      email: 'andy.le@company.com',
      phone: '0901 234 567',
      position: 'Frontend Developer',
    },
    {
      name: 'Daniel Nguyen',
      pid: 'S002',
      email: 'daniel.nguyen@company.com',
      phone: '0902 345 678',
      position: 'Backend Developer',
    },
    {
      name: 'Chicharito Vu',
      pid: 'S003',
      email: 'chicharito.vu@company.com',
      phone: '0903 456 789',
      position: 'DevOps Engineer',
    },
    {
      name: 'Phuc Nguyen',
      pid: 'S004',
      email: 'phuc.nguyen@company.com',
      phone: '0904 567 890',
      position: 'QA Engineer',
    },
    {
      name: 'Viet Anh',
      pid: 'S005',
      email: 'viet.anh@company.com',
      phone: '0905 678 901',
      position: 'Product Manager',
    },
    {
      name: 'Hoa Nguyen',
      pid: 'S006',
      email: 'hoa.nguyen@company.com',
      phone: '0906 789 012',
      position: 'UI/UX Designer',
    },
    {
      name: 'Tony Dai',
      pid: 'S007',
      email: 'tony.dai@company.com',
      phone: '0907 890 123',
      position: 'Full Stack Developer',
    },
  ]

  const troyMembers = [
    {
      name: 'Harry Nguyen',
      pid: 'T001',
      email: 'harry.nguyen@company.com',
      phone: '0908 901 234',
      position: 'Team Lead',
    },
    {
      name: 'Dany Nguyen',
      pid: 'T002',
      email: 'dany.nguyen@company.com',
      phone: '0909 012 345',
      position: 'Backend Developer',
    },
    {
      name: 'Kiet Chung',
      pid: 'T003',
      email: 'kiet.chung@company.com',
      phone: '0910 123 456',
      position: 'Frontend Developer',
    },
    {
      name: 'Luy Hoang',
      pid: 'T004',
      email: 'luy.hoang@company.com',
      phone: '0911 234 567',
      position: 'Data Analyst',
    },
  ]

  // Create Stakeholders
  const stakeholders = [
    {
      code: 'FRAUD',
      name: 'Fraud Prevention Team',
      description: 'Team responsible for fraud detection and prevention',
      contactName: 'John Smith',
      contactEmail: 'john.smith@company.com',
      contactPhone: '0912 345 678',
      groupName: 'Security',
    },
    {
      code: 'BEB',
      name: 'Backend for Backend Team',
      description: 'Core backend infrastructure team',
      contactName: 'Jane Doe',
      contactEmail: 'jane.doe@company.com',
      contactPhone: '0913 456 789',
      groupName: 'Engineering',
    },
    {
      code: 'ECOM',
      name: 'E-Commerce Team',
      description: 'Team handling e-commerce operations',
      contactName: 'Mike Johnson',
      contactEmail: 'mike.johnson@company.com',
      contactPhone: '0914 567 890',
      groupName: 'Business',
    },
    {
      code: 'CM',
      name: 'Content Management Team',
      description: 'Team managing content and SEO',
      contactName: 'Sarah Wilson',
      contactEmail: 'sarah.wilson@company.com',
      contactPhone: '0915 678 901',
      groupName: 'Content',
    },
    {
      code: 'CE',
      name: 'Customer Experience Team',
      description: 'Team focused on customer experience',
      contactName: 'David Brown',
      contactEmail: 'david.brown@company.com',
      contactPhone: '0916 789 012',
      groupName: 'Customer Support',
    },
  ]

  for (const stakeholder of stakeholders) {
    await prisma.stakeholder.create({
      data: stakeholder,
    })
  }

  // Helper function to create user and squad member
  async function createUserAndMember(memberData: any, squadId: string) {
    const hashedPassword = await hash('password123', 12)
    const user = await prisma.user.create({
      data: {
        email: memberData.email,
        passwordHash: hashedPassword,
      },
    })

    await prisma.squadMember.create({
      data: {
        squadId,
        userId: user.id,
        pid: memberData.pid,
        fullName: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        position: memberData.position,
      },
    })

    return user
  }

  // Create Sonic members
  for (const member of sonicMembers) {
    await createUserAndMember(member, sonicSquad.id)
  }

  // Create Troy members
  for (const member of troyMembers) {
    await createUserAndMember(member, troySquad.id)
  }

  // Create Tasks
  const tasks = [
    {
      featureId: 'F12345',
      title: 'Tích hợp hệ thống thanh toán mới',
      description: 'Tích hợp API thanh toán mới từ đối tác và cập nhật giao diện người dùng để hỗ trợ các phương thức thanh toán mới.',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      points: 5,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      progress: 60,
      squadId: sonicSquad.id,
    },
    {
      featureId: 'F12346',
      title: 'Cải thiện hiệu suất trang chủ',
      description: 'Tối ưu hóa thời gian tải trang chủ bằng cách cải thiện các truy vấn cơ sở dữ liệu và triển khai bộ nhớ đệm.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      points: 3,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      progress: 30,
      squadId: sonicSquad.id,
    },
    // Add more tasks here...
  ]

  for (const task of tasks) {
    const createdTask = await prisma.task.create({
      data: {
        ...task,
        createdById: (await prisma.user.findFirst())!.id,
      },
    })

    // Add stakeholders to tasks
    await prisma.taskStakeholder.create({
      data: {
        taskId: createdTask.id,
        stakeholderId: (await prisma.stakeholder.findFirst())!.id,
      },
    })
  }

  await seedRoles();

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 