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
  await prisma.taskComment.deleteMany();
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
        email: "daniel.nguyen@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP001",
            fullName: "Daniel Nguyen",
            email: "daniel.nguyen@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-358",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "harry.nguyen@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP002",
            fullName: "Harry Nguyen",
            email: "harry.nguyen@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-359",
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
            pid: "EMP003",
            fullName: "Kiet Chung",
            email: "kiet.chung@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-360",
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
            pid: "EMP004",
            fullName: "Luy Hoang",
            email: "luy.hoang@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-361",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "andy.le@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP005",
            fullName: "Andy Le",
            email: "andy.le@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-362",
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
            pid: "EMP006",
            fullName: "Chicharito Vu",
            email: "chicharito.vu@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-363",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "anh.vu@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP007",
            fullName: "Anh Vu",
            email: "anh.vu@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-364",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "hoa.nguyen@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP008",
            fullName: "Hoa Nguyen",
            email: "hoa.nguyen@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-365",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "phuc.nguyen@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP009",
            fullName: "Phuc Nguyen",
            email: "phuc.nguyen@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-366",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "tony.dai@nab.com.au",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP010",
            fullName: "Tony Dai",
            email: "tony.dai@nab.com.au",
            position: "Senior Developer",
            status: "ACTIVE",
            phone: "(084) +32-8269-367",
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
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2024-12-31'),
      featureId: 'AUTH-001',
      assignedToId: troyMembers[0].squadMember!.id,
      createdById: sonicMembers[0].squadMember!.id,
      tags: ['authentication', 'security'],
      attachments: {},
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Design database schema',
      description: 'Create ERD and implement database migrations',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date('2024-12-31'),
      featureId: 'DB-001',
      assignedToId: sonicMembers[0].squadMember!.id,
      createdById: troyMembers[0].squadMember!.id,
      tags: ['database', 'design'],
      attachments: {},
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Implement Document Upload API',
      description: 'Create REST API endpoints for document upload and processing',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2024-12-15'),
      featureId: 'EDMS-001',
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
      dueDate: new Date('2024-12-20'),
      featureId: 'ISSO-001',
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
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2024-12-25'),
      featureId: 'ECOM-001',
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
        createdAt: new Date(),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task3.id,
        memberId: troyMembers[2].squadMember!.id,
        role: AssigneeRole.SECONDARY,
        createdAt: new Date(),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task4.id,
        memberId: sonicMembers[1].squadMember!.id,
        role: AssigneeRole.PRIMARY,
        createdAt: new Date(),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task4.id,
        memberId: sonicMembers[2].squadMember!.id,
        role: AssigneeRole.SECONDARY,
        createdAt: new Date(),
      },
    }),
    prisma.taskAssignee.create({
      data: {
        taskId: task5.id,
        memberId: troyMembers[2].squadMember!.id,
        role: AssigneeRole.PRIMARY,
        createdAt: new Date(),
      },
    }),
  ]);

  // Create task stakeholders for new tasks
  await Promise.all([
    prisma.taskStakeholder.create({
      data: {
        taskId: task3.id,
        stakeholderId: stakeholder1.id, // EDMS
        createdAt: new Date(),
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task4.id,
        stakeholderId: stakeholder2.id, // ISSO
        createdAt: new Date(),
      },
    }),
    prisma.taskStakeholder.create({
      data: {
        taskId: task5.id,
        stakeholderId: stakeholder3.id, // ECOM
        createdAt: new Date(),
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

  // Create task comments for new tasks
  await Promise.all([
    prisma.taskComment.create({
      data: {
        content: 'Should we add virus scanning for uploaded documents?',
        taskId: task3.id,
        createdById: troyMembers[2].squadMember!.id,
        createdAt: new Date(),
      },
    }),
    prisma.taskComment.create({
      data: {
        content: 'We need to consider performance impact of new rules',
        taskId: task4.id,
        createdById: sonicMembers[2].squadMember!.id,
        createdAt: new Date(),
      },
    }),
    prisma.taskComment.create({
      data: {
        content: 'Can we get some user feedback on the current pain points?',
        taskId: task5.id,
        createdById: troyMembers[3].squadMember!.id,
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

  // Create incident rotations
  const rotation1 = await prisma.incidentRotation.create({
    data: {
      squadId: troySquad.id,
      primaryMemberId: troyMembers[0].squadMember!.id,
      secondaryMemberId: troyMembers[1].squadMember!.id,
      startDate: new Date(),
      endDate: new Date('2024-12-31'),
      sprintNumber: 1,
      createdAt: new Date(),
    },
  });

  // Create rotation swaps
  await prisma.rotationSwap.create({
    data: {
      rotationId: rotation1.id,
      requesterId: troyMembers[0].squadMember!.id,
      accepterId: troyMembers[1].squadMember!.id,
      swapDate: new Date('2024-12-25'),
      status: 'PENDING',
      createdAt: new Date(),
    },
  });

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

  // Create incident rotations for Sonic squad (last 3 months)
  const startDateIncident = new Date();
  startDateIncident.setMonth(startDateIncident.getMonth() - 3);
  startDateIncident.setDate(1); // Start from the first day of the month
  let currentDateIncident = startOfDay(startDateIncident);

  // Get Sonic members for rotation
  const sonicMemberIds = sonicMembers.map(member => member.squadMember!.id);
  let primaryIndex = 0;
  let secondaryIndex = 1;

  while (currentDateIncident < new Date()) {
    // Create 2-week sprint rotation
    const sprintStartDate = new Date(currentDateIncident);
    const sprintEndDate = new Date(currentDateIncident);
    sprintEndDate.setDate(sprintEndDate.getDate() + 13); // 14 days sprint

    await prisma.incidentRotation.create({
      data: {
        squadId: sonicSquad.id,
        startDate: sprintStartDate,
        endDate: sprintEndDate,
        sprintNumber: Math.floor(Math.random() * 1000), // Random sprint number for demo
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
    currentDateIncident.setDate(currentDateIncident.getDate() + 14);
  }

  // Create standup hosting schedule for both squads (last 3 months)
  const startDateStandup = new Date();
  startDateStandup.setMonth(startDateStandup.getMonth() - 3);
  startDateStandup.setDate(1); // Start from the first day of the month
  let currentDateStandup = startOfDay(startDateStandup);

  // Get members for hosting
  const troyMemberIds = troyMembers.map(member => member.squadMember!.id);
  let troyHostIndex = 0;
  let sonicHostIndex = 0;

  while (currentDateStandup < new Date()) {
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

  // Create some future standup hosting and incident rotations
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 1); // One month in the future

  // Future incident rotations
  while (currentDateIncident < futureDate) {
    const sprintStartDate = new Date(currentDateIncident);
    const sprintEndDate = new Date(currentDateIncident);
    sprintEndDate.setDate(sprintEndDate.getDate() + 13);

    await prisma.incidentRotation.create({
      data: {
        squadId: sonicSquad.id,
        startDate: sprintStartDate,
        endDate: sprintEndDate,
        sprintNumber: Math.floor(Math.random() * 1000),
        primaryMemberId: sonicMemberIds[primaryIndex],
        secondaryMemberId: sonicMemberIds[secondaryIndex],
      },
    });

    primaryIndex = (primaryIndex + 2) % sonicMemberIds.length;
    secondaryIndex = (secondaryIndex + 2) % sonicMemberIds.length;
    if (secondaryIndex === primaryIndex) {
      secondaryIndex = (secondaryIndex + 1) % sonicMemberIds.length;
    }

    currentDateIncident.setDate(currentDateIncident.getDate() + 14);
  }

  // Future standup hosting
  while (currentDateStandup < futureDate) {
    if (!isWeekend(currentDateStandup)) {
      await prisma.standupHosting.create({
        data: {
          squadId: troySquad.id,
          memberId: troyMemberIds[troyHostIndex],
          date: new Date(currentDateStandup),
          status: 'SCHEDULED',
        },
      });

      await prisma.standupHosting.create({
        data: {
          squadId: sonicSquad.id,
          memberId: sonicMemberIds[sonicHostIndex],
          date: new Date(currentDateStandup),
          status: 'SCHEDULED',
        },
      });

      troyHostIndex = (troyHostIndex + 1) % troyMemberIds.length;
      sonicHostIndex = (sonicHostIndex + 1) % sonicMemberIds.length;
    }

    currentDateStandup.setDate(currentDateStandup.getDate() + 1);
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