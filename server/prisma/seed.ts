import { PrismaClient, MemberStatus, TaskStatus, TaskPriority, AssigneeRole, DependencyType } from '@prisma/client';
import { hash } from 'bcryptjs';
import { addDays, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data in correct order
  await prisma.sprintReport.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.rotationSwap.deleteMany();
  await prisma.incidentRotation.deleteMany();
  await prisma.standupHosting.deleteMany();
  await prisma.roleAssignment.deleteMany();
  await prisma.role.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.taskStakeholder.deleteMany();
  await prisma.taskAssignee.deleteMany();
  await prisma.taskNote.deleteMany();
  await prisma.task.deleteMany();
  await prisma.stakeholder.deleteMany();
  await prisma.squadMember.deleteMany();
  await prisma.squad.deleteMany();
  await prisma.user.deleteMany();

  // Create squads
  const troySquad = await prisma.squad.create({
    data: {
      name: "Squad Troy",
      code: "Troy",
      description: "Development Team",
      hasIncidentRoster: false,
    },
  });

  const sonicSquad = await prisma.squad.create({
    data: {
      name: "Squad Sonic",
      code: "Sonic",
      description: "Production Support Team",
      hasIncidentRoster: true,
    },
  });

  // Create users and squad members for Troy
  const troyMembers = await Promise.all([
    prisma.user.create({
      data: {
        email: "danny.nguyen2@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "22831433",
            fullName: "Danny Nguyen",
            email: "danny.nguyen2@nab.com.au",
            position: "Analysis Engineer",
            status: "ACTIVE",
            phone: "(084) 096-3729-875",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "harry.nguyen3@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "40010912",
            fullName: "Harry Nguyen",
            email: "harry.nguyen3@nab.com.au",
            position: "Analyst Engineer",
            status: "ACTIVE",
            phone: "(084) 086-8300-742",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "kiet.chung@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "22832742",
            fullName: "Kiet Chung",
            email: "kiet.chung@nab.com.au",
            position: "Associate Engineer",
            status: "ACTIVE",
            phone: "(084) 083-4184-481",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "luy.hoang@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "22834499",
            fullName: "Luy Hoang",
            email: "luy.hoang@nab.com.au",
            position: "Senior Analyst Engineer",
            status: "ACTIVE",
            phone: "(084) 035-6067-905",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "andy.le1@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "22831955",
            fullName: "Andy Le",
            email: "andy.le1@nab.com.au",
            position: "Engineer Manager",
            status: "ACTIVE",
            phone: "(084) 032-8269-358",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
  ]);

  // Create users and squad members for Sonic
  const sonicMembers = await Promise.all([
    prisma.user.create({
      data: {
        email: "chicharito.vu@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "22831174",
            fullName: "Chicharito Vu",
            email: "chicharito.vu@nab.com.au",
            position: "Analyst Engineer",
            status: "ACTIVE",
            phone: "(084) 037-9970-761",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "anh.vu2@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "22842810",
            fullName: "Anh Vu",
            email: "anh.vu2@nab.com.au",
            position: "Associate Engineer",
            status: "ACTIVE",
            phone: "(084) 083-2532-867",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "hoa.r.tran@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "40010013",
            fullName: "Hoa R Tran",
            email: "hoa.r.tran@nab.com.au",
            position: "Associate Engineer",
            status: "ACTIVE",
            phone: "(084) 082-9841-172",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "phuc.nguyen1@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "22833707",
            fullName: "Phuc Nguyen",
            email: "phuc.nguyen1@nab.com.au",
            position: "Analyst Engineer",
            status: "ACTIVE",
            phone: "(084) 034-7331-230",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "tony.tran3@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "22837549",
            fullName: "Tony Tran",
            email: "tony.tran3@nab.com.au",
            position: "Senior Analyst Engineer",
            status: "ACTIVE",
            phone: "(084) 034-2106-381",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
  ]);

  // Create stakeholders
  const stakeholder1 = await prisma.stakeholder.create({
    data: {
      code: 'EDMS',
      name: 'Enterprise Document Management System',
      description: 'Enterprise system for managing and processing documents across the organization',
      contactName: 'Bob Smith',
      contactEmail: 'bob.smith@example.com',
      contactPhone: '+84 123 456 789',
      groupName: 'Document Management',
    },
  });

  const stakeholder2 = await prisma.stakeholder.create({
    data: {
      code: 'ISSO',
      name: 'Fraud Detection Service',
      description: 'Intelligent system for detecting and preventing fraudulent activities',
      contactName: 'Carol Davis',
      contactEmail: 'carol.davis@example.com',
      contactPhone: '+84 123 456 790',
      groupName: 'Security Services',
    },
  });

  const stakeholder3 = await prisma.stakeholder.create({
    data: {
      code: 'ECOM',
      name: 'Customer Onboarding Experience System',
      description: 'Digital platform for customer onboarding and account creation',
      contactName: 'David Wilson',
      contactEmail: 'david.wilson@example.com',
      contactPhone: '+84 123 456 791',
      groupName: 'Customer Experience',
    },
  });

  const stakeholder4 = await prisma.stakeholder.create({
    data: {
      code: 'PEB',
      name: 'Personal Everyday Banking',
      description: 'Core banking system for personal banking services',
      contactName: 'Emma Brown',
      contactEmail: 'emma.brown@example.com',
      contactPhone: '+84 123 456 792',
      groupName: 'Personal Banking',
    },
  });

  const stakeholder5 = await prisma.stakeholder.create({
    data: {
      code: 'BEB',
      name: 'Business Everyday Banking',
      description: 'Core banking system for business banking services',
      contactName: 'Frank Miller',
      contactEmail: 'frank.miller@example.com',
      contactPhone: '+84 123 456 793',
      groupName: 'Business Banking',
    },
  });

  const stakeholder6 = await prisma.stakeholder.create({
    data: {
      code: 'IB',
      name: 'Internet Banking',
      description: 'Digital banking platform for online banking services',
      contactName: 'Grace Lee',
      contactEmail: 'grace.lee@example.com',
      contactPhone: '+84 123 456 794',
      groupName: 'Digital Banking',
    },
  });

  const stakeholder7 = await prisma.stakeholder.create({
    data: {
      code: 'nabConnect',
      name: 'Digital Business Platform',
      description: 'Comprehensive digital platform for business customers',
      contactName: 'Henry Taylor',
      contactEmail: 'henry.taylor@example.com',
      contactPhone: '+84 123 456 795',
      groupName: 'Business Digital',
    },
  });

  const stakeholder8 = await prisma.stakeholder.create({
    data: {
      code: 'nabOne',
      name: 'Digital Colleague Platform',
      description: 'Internal platform for employee collaboration and productivity',
      contactName: 'Ivy Chen',
      contactEmail: 'ivy.chen@example.com',
      contactPhone: '+84 123 456 796',
      groupName: 'Employee Digital',
    },
  });

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Implement user authentication',
      description: 'Set up JWT authentication with refresh tokens',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-15'),
      dueDate: new Date('2025-03-15'),
      featureId: 'AUTH-001',
      progress: 75.5,
      points: 8,
      assignedToId: troyMembers[0].squadMember!.id,
      createdById: sonicMembers[0].squadMember!.id,
      tags: ['authentication', 'security'],
      attachments: {},
    },
  });

  // Add assignees for task1 (AUTH-001)
  await Promise.all([
    prisma.taskAssignee.create({
      data: {
        taskId: task1.id,
        memberId: troyMembers[0].squadMember!.id,
        role: AssigneeRole.PRIMARY,
        createdAt: new Date('2025-02-01'),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task1.id,
        memberId: troyMembers[1].squadMember!.id,
        role: AssigneeRole.SECONDARY,
        createdAt: new Date('2025-02-01'),
      },
    }),
  ]);

  const task2 = await prisma.task.create({
    data: {
      title: 'Design database schema',
      description: 'Create ERD and implement database migrations',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-03-01'),
      dueDate: new Date('2025-03-30'),
      featureId: 'DB-001',
      progress: 85.5,
      points: 5,
      assignedToId: sonicMembers[0].squadMember!.id,
      createdById: troyMembers[0].squadMember!.id,
      tags: ['database', 'design'],
      attachments: {},
    },
  });

  // Add assignees for task2 (DB-001)
  await Promise.all([
    prisma.taskAssignee.create({
      data: {
        taskId: task2.id,
        memberId: sonicMembers[0].squadMember!.id,
        role: AssigneeRole.PRIMARY,
        createdAt: new Date('2025-02-15'),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task2.id,
        memberId: sonicMembers[1].squadMember!.id,
        role: AssigneeRole.SECONDARY,
        createdAt: new Date('2025-02-15'),
      },
    }),
  ]);

  const task3 = await prisma.task.create({
    data: {
      title: 'Implement Document Upload API',
      description: 'Create REST API endpoints for document upload and processing',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-15'),
      dueDate: new Date('2025-04-15'),
      featureId: 'EDMS-001',
      progress: 65.8,
      points: 13,
      assignedToId: troyMembers[1].squadMember!.id,
      createdById: troyMembers[0].squadMember!.id,
      tags: ['api', 'document-management'],
      attachments: {},
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Implement Fraud Detection Rules',
      description: 'Develop and implement new fraud detection rules for transaction monitoring',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date('2025-03-15'),
      updatedAt: new Date('2025-03-30'),
      dueDate: new Date('2025-04-30'),
      featureId: 'ISSO-001',
      progress: 92.3,
      points: 21,
      assignedToId: sonicMembers[1].squadMember!.id,
      createdById: sonicMembers[0].squadMember!.id,
      tags: ['security', 'fraud-detection'],
      attachments: {},
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Customer Onboarding Flow Enhancement',
      description: 'Improve the customer onboarding experience with new UI/UX design',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdAt: new Date('2025-04-01'),
      updatedAt: new Date('2025-04-15'),
      dueDate: new Date('2025-05-15'),
      featureId: 'ECOM-001',
      progress: 55.5,
      points: 8,
      assignedToId: troyMembers[2].squadMember!.id,
      createdById: troyMembers[0].squadMember!.id,
      tags: ['ui-ux', 'customer-experience'],
      attachments: {},
    },
  });

  // Create task assignees for new tasks
  await Promise.all([
    prisma.taskAssignee.create({
      data: {
        taskId: task3.id,
        memberId: troyMembers[1].squadMember!.id,
        role: AssigneeRole.PRIMARY,
        createdAt: new Date('2025-03-01'),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task3.id,
        memberId: troyMembers[2].squadMember!.id,
        role: AssigneeRole.SECONDARY,
        createdAt: new Date('2025-03-01'),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task4.id,
        memberId: sonicMembers[1].squadMember!.id,
        role: AssigneeRole.PRIMARY,
        createdAt: new Date('2025-03-15'),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task4.id,
        memberId: sonicMembers[2].squadMember!.id,
        role: AssigneeRole.SECONDARY,
        createdAt: new Date('2025-03-15'),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task5.id,
        memberId: troyMembers[2].squadMember!.id,
        role: AssigneeRole.PRIMARY,
        createdAt: new Date('2025-04-01'),
      },
    }),
  ]);

  // Create task stakeholder relationships
  await Promise.all([
    // Task 1 (AUTH-001) stakeholders
    prisma.taskStakeholder.create({
      data: {
        taskId: task1.id,
        stakeholderId: stakeholder2.id, // ISSO for security
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task1.id,
        stakeholderId: stakeholder6.id, // IB for authentication
      },
    }),

    // Task 2 (DB-001) stakeholders
    prisma.taskStakeholder.create({
      data: {
        taskId: task2.id,
        stakeholderId: stakeholder1.id, // EDMS for document management
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task2.id,
        stakeholderId: stakeholder8.id, // nabOne for internal platform
      },
    }),

    // Task 3 (EDMS-001) stakeholders
    prisma.taskStakeholder.create({
      data: {
        taskId: task3.id,
        stakeholderId: stakeholder1.id, // EDMS primary stakeholder
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task3.id,
        stakeholderId: stakeholder5.id, // BEB for business documents
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task3.id,
        stakeholderId: stakeholder4.id, // PEB for personal documents
      },
    }),

    // Task 4 (ISSO-001) stakeholders
    prisma.taskStakeholder.create({
      data: {
        taskId: task4.id,
        stakeholderId: stakeholder2.id, // ISSO primary stakeholder
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task4.id,
        stakeholderId: stakeholder6.id, // IB for online banking security
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task4.id,
        stakeholderId: stakeholder7.id, // nabConnect for business platform security
      },
    }),

    // Task 5 (ECOM-001) stakeholders
    prisma.taskStakeholder.create({
      data: {
        taskId: task5.id,
        stakeholderId: stakeholder3.id, // ECOM primary stakeholder
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task5.id,
        stakeholderId: stakeholder4.id, // PEB for personal banking onboarding
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task5.id,
        stakeholderId: stakeholder5.id, // BEB for business banking onboarding
      },
    }),
  ]);

  // Create task notes for new tasks
  await Promise.all([
    prisma.taskNote.create({
      data: {
        content: 'API should support multiple file formats including PDF, DOCX, and images',
        taskId: task3.id,
        authorId: troyMembers[1].squadMember!.id,
        createdAt: new Date(),
      },
    }),
    prisma.taskNote.create({
      data: {
        content: 'New rules should focus on transaction amount patterns and frequency',
        taskId: task4.id,
        authorId: sonicMembers[1].squadMember!.id,
        createdAt: new Date(),
      },
    }),
    prisma.taskNote.create({
      data: {
        content: 'Focus on reducing the number of steps in the onboarding process',
        taskId: task5.id,
        authorId: troyMembers[2].squadMember!.id,
        createdAt: new Date(),
      },
    }),
  ]);

  // Create task dependencies for new tasks
  await Promise.all([
    prisma.taskDependency.create({
      data: {
        taskId: task3.id,
        dependentTaskId: task1.id,
        dependencyType: DependencyType.BLOCKS,
        createdAt: new Date(),
      },
    }),
    prisma.taskDependency.create({
      data: {
        taskId: task4.id,
        dependentTaskId: task2.id,
        dependencyType: DependencyType.RELATES_TO,
        createdAt: new Date(),
      },
    }),
  ]);

  // Create roles
  const role1 = await prisma.role.create({
    data: {
      name: 'Developer',
      description: 'Software developer role',
      permissions: ['read', 'write', 'execute'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create role assignments
  await prisma.roleAssignment.create({
    data: {
      squadId: troySquad.id,
      memberId: troyMembers[0].squadMember!.id,
      roleId: role1.id,
      assignedBy: 'system',
      createdAt: new Date(),
    },
  });

  // Create incident rotations for Sonic squad (last 3 months to 1 month in future)
  const startDateIncident = new Date();
  startDateIncident.setMonth(startDateIncident.getMonth() - 3);
  startDateIncident.setDate(1); // Start from the first day of the month
  let currentDateIncident = startOfDay(startDateIncident);

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 1); // One month in the future

  // Get Sonic members for rotation
  const sonicMemberIds = sonicMembers.map(member => member.squadMember!.id);
  let primaryIndex = 0;
  let secondaryIndex = 1;

  // Create incident rotations from past to future
  while (currentDateIncident < futureDate) {
    // Get sprint information for current date
    const { startDate: sprintStartDate, endDate: sprintEndDate, sprintNumber } = getSprintDates(currentDateIncident);

    await prisma.incidentRotation.create({
      data: {
        squadId: sonicSquad.id,
        startDate: sprintStartDate,
        endDate: sprintEndDate,
        sprintNumber,
        primaryMemberId: sonicMemberIds[primaryIndex],
        secondaryMemberId: sonicMemberIds[secondaryIndex],
      },
    });

    // Rotate members for next sprint
    primaryIndex = (primaryIndex + 2) % sonicMemberIds.length;
    secondaryIndex = (secondaryIndex + 2) % sonicMemberIds.length;
    if (secondaryIndex === primaryIndex) {
      secondaryIndex = (secondaryIndex + 1) % sonicMemberIds.length;
    }

    // Move to next sprint
    currentDateIncident = new Date(sprintEndDate);
    currentDateIncident.setDate(currentDateIncident.getDate() + 1);
  }

  // Create standup hosting schedule for both squads (last 3 months to 1 month in future)
  const startDateStandup = new Date();
  startDateStandup.setMonth(startDateStandup.getMonth() - 3);
  startDateStandup.setDate(1); // Start from the first day of the month
  let currentDateStandup = startOfDay(startDateStandup);

  // Get members for hosting
  const troyMemberIds = troyMembers.map(member => member.squadMember!.id);
  let troyHostIndex = 0;
  let sonicHostIndex = 0;

  // Create standup hosting from past to future
  while (currentDateStandup < futureDate) {
    if (!isWeekend(currentDateStandup)) {
      // Create hosting for Troy squad
      await prisma.standupHosting.create({
        data: {
          squadId: troySquad.id,
          memberId: troyMemberIds[troyHostIndex],
          date: new Date(currentDateStandup),
          status: currentDateStandup < new Date() ? 'COMPLETED' : 'SCHEDULED',
        },
      });

      // Create hosting for Sonic squad
      await prisma.standupHosting.create({
        data: {
          squadId: sonicSquad.id,
          memberId: sonicMemberIds[sonicHostIndex],
          date: new Date(currentDateStandup),
          status: currentDateStandup < new Date() ? 'COMPLETED' : 'SCHEDULED',
        },
      });

      // Rotate hosts for next day
      troyHostIndex = (troyHostIndex + 1) % troyMemberIds.length;
      sonicHostIndex = (sonicHostIndex + 1) % sonicMemberIds.length;
    }

    // Move to next day
    currentDateStandup.setDate(currentDateStandup.getDate() + 1);
  }

  // Create sprint reports
  await prisma.sprintReport.create({
    data: {
      squadId: troySquad.id,
      sprintNumber: 1,
      startDate: new Date(),
      endDate: new Date('2024-12-31'),
      totalPoints: 20,
      completedPoints: 15,
      memberMetrics: {},
      stakeholderMetrics: {},
      createdAt: new Date(),
    },
  });

  // Create activity logs
  await prisma.activityLog.create({
    data: {
      userId: troyMembers[0].id,
      entityType: 'task',
      entityId: task1.id,
      action: 'create',
      details: {},
      createdAt: new Date(),
    },
  });

  // Helper functions for date manipulation
  function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  }

  function getNextWorkday(date: Date): Date {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    while (isWeekend(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    return nextDay;
  }

  // Helper function to find first Wednesday after a given date
  function getFirstWednesday(date: Date): Date {
    const result = new Date(date);
    while (result.getDay() !== 3) { // 3 is Wednesday
      result.setDate(result.getDate() + 1);
    }
    return result;
  }

  // Helper function to calculate sprint number
  function calculateSprintNumber(date: Date): number {
    // Financial year starts from October 1st
    const financialYearStart = new Date(date.getFullYear(), 9, 1); // Month is 0-based, so 9 is October
    if (date < financialYearStart) {
      financialYearStart.setFullYear(financialYearStart.getFullYear() - 1);
    }

    // Find the first Wednesday after financial year start
    const firstSprintStart = getFirstWednesday(financialYearStart);
    
    // Calculate days since first sprint start
    const daysSinceStart = Math.floor((date.getTime() - firstSprintStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // Each sprint is 14 days
    const sprintNumber = Math.floor(daysSinceStart / 14) + 1;
    
    return sprintNumber;
  }

  // Helper function to get sprint dates
  function getSprintDates(date: Date): { startDate: Date; endDate: Date; sprintNumber: number } {
    // Find the start of the financial year
    const financialYearStart = new Date(date.getFullYear(), 9, 1);
    if (date < financialYearStart) {
      financialYearStart.setFullYear(financialYearStart.getFullYear() - 1);
    }

    // Find the first Wednesday after financial year start
    const firstSprintStart = getFirstWednesday(financialYearStart);

    // Calculate sprint number
    const sprintNumber = calculateSprintNumber(date);

    // Calculate sprint start date (each sprint is 14 days)
    const daysToAdd = (sprintNumber - 1) * 14;
    const sprintStartDate = new Date(firstSprintStart);
    sprintStartDate.setDate(firstSprintStart.getDate() + daysToAdd);

    // Calculate sprint end date (13 days after start date)
    const sprintEndDate = new Date(sprintStartDate);
    sprintEndDate.setDate(sprintStartDate.getDate() + 13);

    return {
      startDate: sprintStartDate,
      endDate: sprintEndDate,
      sprintNumber
    };
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 