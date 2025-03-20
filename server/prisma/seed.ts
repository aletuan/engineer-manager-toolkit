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
      title: "Implement new authentication flow",
      description: "Implement OAuth2 authentication flow with Google and Microsoft accounts",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      progress: 60,
      points: 8,
      dueDate: addDays(new Date(), 7),
      featureId: "AUTH-001",
      createdById: troyMembers[4].squadMember?.id || '',
      assignedToId: troyMembers[0].squadMember?.id || '',
      tags: ['authentication', 'oauth'],
      attachments: {},
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Optimize database queries",
      description: "Review and optimize slow database queries in the reporting module",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      progress: 0,
      points: 5,
      dueDate: addDays(new Date(), 14),
      featureId: "PERF-002",
      createdById: troyMembers[4].squadMember?.id || '',
      assignedToId: troyMembers[1].squadMember?.id || '',
      tags: ['performance', 'database'],
      attachments: {},
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Fix production deployment issues",
      description: "Investigate and fix deployment failures in production environment",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      progress: 100,
      points: 3,
      dueDate: addDays(new Date(), -1),
      featureId: "OPS-003",
      createdById: sonicMembers[4].squadMember?.id || '',
      assignedToId: sonicMembers[0].squadMember?.id || '',
      tags: ['devops', 'deployment'],
      attachments: {},
    },
  });

  // Create task assignees
  await prisma.taskAssignee.createMany({
    data: [
      {
        taskId: task1.id,
        memberId: troyMembers[0].squadMember?.id || '',
        role: AssigneeRole.PRIMARY,
      },
      {
        taskId: task1.id,
        memberId: troyMembers[2].squadMember?.id || '',
        role: AssigneeRole.SECONDARY,
      },
      {
        taskId: task2.id,
        memberId: troyMembers[1].squadMember?.id || '',
        role: AssigneeRole.PRIMARY,
      },
      {
        taskId: task2.id,
        memberId: troyMembers[3].squadMember?.id || '',
        role: AssigneeRole.SECONDARY,
      },
      {
        taskId: task3.id,
        memberId: sonicMembers[0].squadMember?.id || '',
        role: AssigneeRole.PRIMARY,
      },
      {
        taskId: task3.id,
        memberId: sonicMembers[4].squadMember?.id || '',
        role: AssigneeRole.SECONDARY,
      },
    ],
  });

  // Create task notes
  await prisma.taskNote.createMany({
    data: [
      {
        taskId: task1.id,
        content: "Initial design document has been approved. Starting implementation phase.",
        authorId: troyMembers[4].squadMember?.id || '',
      },
      {
        taskId: task1.id,
        content: "Google OAuth integration completed. Moving on to Microsoft OAuth.",
        authorId: troyMembers[0].squadMember?.id || '',
      },
      {
        taskId: task1.id,
        content: "Security review needed before proceeding with Microsoft integration.",
        authorId: troyMembers[2].squadMember?.id || '',
      },
      {
        taskId: task2.id,
        content: "Identified 5 critical queries that need optimization.",
        authorId: troyMembers[1].squadMember?.id || '',
      },
      {
        taskId: task2.id,
        content: "Added indexes to improve query performance. Testing in progress.",
        authorId: troyMembers[1].squadMember?.id || '',
      },
      {
        taskId: task3.id,
        content: "Root cause identified: misconfigured environment variables.",
        authorId: sonicMembers[0].squadMember?.id || '',
      },
      {
        taskId: task3.id,
        content: "Fixed environment configuration and verified deployment success.",
        authorId: sonicMembers[0].squadMember?.id || '',
      },
      {
        taskId: task3.id,
        content: "Added automated environment validation to prevent similar issues.",
        authorId: sonicMembers[4].squadMember?.id || '',
      },
    ],
  });

  // Create task dependencies
  await prisma.taskDependency.createMany({
    data: [
      {
        taskId: task1.id,
        dependentTaskId: task2.id,
        dependencyType: DependencyType.BLOCKS,
      },
      {
        taskId: task2.id,
        dependentTaskId: task3.id,
        dependencyType: DependencyType.RELATES_TO,
      },
      {
        taskId: task3.id,
        dependentTaskId: task1.id,
        dependencyType: DependencyType.BLOCKED_BY,
      },
    ],
  });

  // Create task stakeholder relationships
  await Promise.all([
    prisma.taskStakeholder.create({
      data: {
        taskId: task1.id,
        stakeholderId: stakeholder1.id,
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task2.id,
        stakeholderId: stakeholder2.id,
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task3.id,
        stakeholderId: stakeholder3.id,
      },
    }),
  ]);

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

  // Create standup hosting for March 3-21, 2025
  const standupStartDate = new Date('2025-03-03');
  const standupEndDate = new Date('2025-03-21');

  // Generate all dates between start and end date for standup hosting
  const standupDates: Date[] = [];
  let currentStandupDate = new Date(standupStartDate);
  while (currentStandupDate <= standupEndDate) {
    // Only add weekdays (Monday to Friday)
    const dayOfWeek = currentStandupDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      standupDates.push(new Date(currentStandupDate));
    }
    currentStandupDate.setDate(currentStandupDate.getDate() + 1);
  }

  // Create standup hosting schedule for Troy
  if (troyMembers.length > 0) {
    const troySquadId = troyMembers[0].squadMember?.squadId || '';
    for (let i = 0; i < standupDates.length; i++) {
      const date = standupDates[i];
      // Calculate which member should host based on the week number
      const weekNumber = Math.floor(i / 5); // 5 days per week
      const memberIndex = weekNumber % troyMembers.length;
      const member = troyMembers[memberIndex];

      if (member.squadMember?.id) {
        await prisma.standupHosting.create({
          data: {
            squadId: troySquadId,
            memberId: member.squadMember.id,
            date,
            status: 'SCHEDULED'
          }
        });
      }
    }
  }

  // Create standup hosting schedule for Sonic
  if (sonicMembers.length > 0) {
    const sonicSquadId = sonicMembers[0].squadMember?.squadId || '';
    for (let i = 0; i < standupDates.length; i++) {
      const date = standupDates[i];
      // Calculate which member should host based on the week number
      const weekNumber = Math.floor(i / 5); // 5 days per week
      const memberIndex = weekNumber % sonicMembers.length;
      const member = sonicMembers[memberIndex];

      if (member.squadMember?.id) {
        await prisma.standupHosting.create({
          data: {
            squadId: sonicSquadId,
            memberId: member.squadMember.id,
            date,
            status: 'SCHEDULED'
          }
        });
      }
    }
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 