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
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        id: '1d1c9d6f-caa6-43a9-9c8f-a0818fddee43',
        title: 'Customer Onboarding Flow Enhancement',
        description: 'Enhance the customer onboarding flow to improve user experience and reduce drop-off rates',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        progress: 55.5,
        points: 8,
        dueDate: new Date('2025-05-15'),
        featureId: 'ECOM-001',
        attachments: {},
        assignedToId: troyMembers[2].squadMember!.id,
        createdById: troyMembers[0].squadMember!.id,
        assignees: {
          create: [
            {
              role: 'PRIMARY',
              memberId: troyMembers[2].squadMember!.id
            }
          ]
        },
        stakeholders: {
          create: [
            {
              stakeholderId: stakeholder3.id
            },
            {
              stakeholderId: stakeholder4.id
            },
            {
              stakeholderId: stakeholder5.id
            }
          ]
        },
        notes: {
          create: [
            {
              content: 'Initial design review completed with stakeholders',
              authorId: troyMembers[2].squadMember!.id
            },
            {
              content: 'User research findings suggest simplifying the form layout',
              authorId: troyMembers[2].squadMember!.id
            }
          ]
        }
      }
    }),
    prisma.task.create({
      data: {
        id: 'eb3b6811-f887-47ec-8f59-d7be3884ef66',
        title: 'Implement Fraud Detection Rules',
        description: 'Implement new fraud detection rules for transaction monitoring',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 92.3,
        points: 21,
        dueDate: new Date('2025-04-30'),
        featureId: 'ISSO-001',
        attachments: {},
        assignedToId: sonicMembers[1].squadMember!.id,
        createdById: sonicMembers[0].squadMember!.id,
        assignees: {
          create: [
            {
              role: 'PRIMARY',
              memberId: sonicMembers[1].squadMember!.id
            },
            {
              role: 'SECONDARY',
              memberId: sonicMembers[2].squadMember!.id
            }
          ]
        },
        stakeholders: {
          create: [
            {
              stakeholderId: stakeholder2.id
            },
            {
              stakeholderId: stakeholder6.id
            },
            {
              stakeholderId: stakeholder7.id
            }
          ]
        },
        notes: {
          create: [
            {
              content: 'Rules engine configuration completed',
              authorId: sonicMembers[1].squadMember!.id
            },
            {
              content: 'Performance testing shows 99.9% accuracy',
              authorId: sonicMembers[2].squadMember!.id
            }
          ]
        }
      }
    }),
    prisma.task.create({
      data: {
        id: '1ac74782-ff98-419c-9477-525a4d66565c',
        title: 'Implement Document Upload API',
        description: 'Create a new API endpoint for document upload functionality',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 65.8,
        points: 13,
        dueDate: new Date('2025-04-15'),
        featureId: 'EDMS-001',
        attachments: {},
        assignedToId: troyMembers[1].squadMember!.id,
        createdById: troyMembers[0].squadMember!.id,
        assignees: {
          create: [
            {
              role: 'PRIMARY',
              memberId: troyMembers[1].squadMember!.id
            },
            {
              role: 'SECONDARY',
              memberId: troyMembers[2].squadMember!.id
            }
          ]
        },
        stakeholders: {
          create: [
            {
              stakeholderId: stakeholder1.id
            },
            {
              stakeholderId: stakeholder8.id
            },
            {
              stakeholderId: stakeholder3.id
            }
          ]
        },
        notes: {
          create: [
            {
              content: 'API design document approved by architecture team',
              authorId: troyMembers[1].squadMember!.id
            },
            {
              content: 'Integration with S3 storage completed',
              authorId: troyMembers[2].squadMember!.id
            }
          ]
        }
      }
    }),
    prisma.task.create({
      data: {
        id: 'ea9f4c8a-4a21-47c7-a3b4-37b5ee8036ac',
        title: 'Design database schema',
        description: 'Design and implement the database schema for the new document management system',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        progress: 85.5,
        points: 5,
        dueDate: new Date('2025-03-30'),
        featureId: 'DB-001',
        attachments: {},
        assignedToId: sonicMembers[0].squadMember!.id,
        createdById: troyMembers[1].squadMember!.id,
        assignees: {
          create: [
            {
              role: 'PRIMARY',
              memberId: sonicMembers[0].squadMember!.id
            },
            {
              role: 'SECONDARY',
              memberId: troyMembers[2].squadMember!.id
            }
          ]
        },
        stakeholders: {
          create: [
            {
              stakeholderId: stakeholder1.id
            },
            {
              stakeholderId: stakeholder8.id
            }
          ]
        },
        notes: {
          create: [
            {
              content: 'Schema design reviewed by DBA team',
              authorId: sonicMembers[0].squadMember!.id
            },
            {
              content: 'Performance optimization recommendations implemented',
              authorId: troyMembers[2].squadMember!.id
            }
          ]
        }
      }
    }),
    prisma.task.create({
      data: {
        id: 'eee9e8dd-21c5-420c-a9a9-e64d7bb70755',
        title: 'Implement user authentication',
        description: 'Implement OAuth2 authentication for the application',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 75.5,
        points: 8,
        dueDate: new Date('2025-03-15'),
        featureId: 'AUTH-001',
        attachments: {},
        assignedToId: troyMembers[0].squadMember!.id,
        createdById: troyMembers[1].squadMember!.id,
        assignees: {
          create: [
            {
              role: 'PRIMARY',
              memberId: troyMembers[0].squadMember!.id
            },
            {
              role: 'SECONDARY',
              memberId: troyMembers[1].squadMember!.id
            }
          ]
        },
        stakeholders: {
          create: [
            {
              stakeholderId: stakeholder2.id
            },
            {
              stakeholderId: stakeholder6.id
            }
          ]
        },
        notes: {
          create: [
            {
              content: 'OAuth2 provider integration completed',
              authorId: troyMembers[0].squadMember!.id
            },
            {
              content: 'Security review passed successfully',
              authorId: troyMembers[1].squadMember!.id
            }
          ]
        }
      }
    })
  ]);

  // Create task dependencies
  await Promise.all([
    // Document Upload API depends on Database Schema
    prisma.taskDependency.create({
      data: {
        taskId: tasks[2].id, // Document Upload API
        dependentTaskId: tasks[3].id, // Database Schema
        dependencyType: 'BLOCKED_BY'
      }
    }),
    // User Authentication blocks Document Upload API
    prisma.taskDependency.create({
      data: {
        taskId: tasks[4].id, // User Authentication
        dependentTaskId: tasks[2].id, // Document Upload API
        dependencyType: 'BLOCKS'
      }
    }),
    // Fraud Detection Rules related to User Authentication
    prisma.taskDependency.create({
      data: {
        taskId: tasks[1].id, // Fraud Detection Rules
        dependentTaskId: tasks[4].id, // User Authentication
        dependencyType: 'RELATES_TO'
      }
    })
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

  // Delete all existing standup hosting schedules
  await prisma.standupHosting.deleteMany();

  // Find all Troy members by PID
  const troyMemberPids = ['22831955', '22831433', '22832742', '40010912', '22834499'];
  const troyStandupMembers = await Promise.all(
    troyMemberPids.map(pid => 
      prisma.squadMember.findFirst({
        where: { pid },
        include: { squad: true }
      })
    )
  );

  // Filter out any null values and ensure we have valid members
  const validTroyMembers = troyStandupMembers.filter((member): member is NonNullable<typeof member> => 
    member !== null && member.squad !== null
  );

  if (validTroyMembers.length > 0) {
    const troySquadId = validTroyMembers[0].squad.id;
    const startDate = new Date('2025-03-24');
    const endDate = new Date('2025-12-31');

    // Generate all dates between start and end date
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Only add weekdays (Monday to Friday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create standup hosting schedule
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      // Calculate which member should host based on the week number
      const weekNumber = Math.floor(i / 5); // 5 days per week
      const memberIndex = weekNumber % validTroyMembers.length;
      const member = validTroyMembers[memberIndex];

      await prisma.standupHosting.create({
        data: {
          squadId: troySquadId,
          memberId: member.id,
          date,
          status: 'SCHEDULED'
        }
      });
    }
  }

  // Find Sonic members by PID
  const sonicMemberPids = ['22842810', '22831174', '40010013', '22833707', '22837549'];
  const sonicStandupMembers = await Promise.all(
    sonicMemberPids.map(pid => 
      prisma.squadMember.findFirst({
        where: { pid },
        include: { squad: true }
      })
    )
  );

  // Filter out any null values and ensure we have valid members
  const validSonicMembers = sonicStandupMembers.filter((member): member is NonNullable<typeof member> => 
    member !== null && member.squad !== null
  );

  if (validSonicMembers.length > 0) {
    const sonicSquadId = validSonicMembers[0].squad.id;
    const startDate = new Date('2025-03-24');
    const endDate = new Date('2025-12-31');

    // Generate all dates between start and end date
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Only add weekdays (Monday to Friday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create standup hosting schedule
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      // Calculate which member should host based on the week number
      const weekNumber = Math.floor(i / 5); // 5 days per week
      const memberIndex = weekNumber % validSonicMembers.length;
      const member = validSonicMembers[memberIndex];

      await prisma.standupHosting.create({
        data: {
          squadId: sonicSquadId,
          memberId: member.id,
          date,
          status: 'SCHEDULED'
        }
      });
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
      entityId: tasks[4].id,
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
  if (validTroyMembers.length > 0) {
    const troySquadId = validTroyMembers[0].squad.id;
    for (let i = 0; i < standupDates.length; i++) {
      const date = standupDates[i];
      // Calculate which member should host based on the week number
      const weekNumber = Math.floor(i / 5); // 5 days per week
      const memberIndex = weekNumber % validTroyMembers.length;
      const member = validTroyMembers[memberIndex];

      await prisma.standupHosting.create({
        data: {
          squadId: troySquadId,
          memberId: member.id,
          date,
          status: 'SCHEDULED'
        }
      });
    }
  }

  // Create standup hosting schedule for Sonic
  if (validSonicMembers.length > 0) {
    const sonicSquadId = validSonicMembers[0].squad.id;
    for (let i = 0; i < standupDates.length; i++) {
      const date = standupDates[i];
      // Calculate which member should host based on the week number
      const weekNumber = Math.floor(i / 5); // 5 days per week
      const memberIndex = weekNumber % validSonicMembers.length;
      const member = validSonicMembers[memberIndex];

      await prisma.standupHosting.create({
        data: {
          squadId: sonicSquadId,
          memberId: member.id,
          date,
          status: 'SCHEDULED'
        }
      });
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
      entityId: tasks[4].id,
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