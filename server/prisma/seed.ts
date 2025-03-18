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
        email: "daniel.nguyen@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP001",
            fullName: "Daniel Nguyen",
            email: "daniel.nguyen@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "harry.nguyen@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP002",
            fullName: "Harry Nguyen",
            email: "harry.nguyen@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "kiet.chung@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP003",
            fullName: "Kiet Chung",
            email: "kiet.chung@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "luy.hoang@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP004",
            fullName: "Luy Hoang",
            email: "luy.hoang@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "andy.le@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: troySquad.id,
            pid: "EMP005",
            fullName: "Andy Le",
            email: "andy.le@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
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
        email: "chicharito.vu@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP006",
            fullName: "Chicharito Vu",
            email: "chicharito.vu@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "anh.vu@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP007",
            fullName: "Anh Vu",
            email: "anh.vu@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "hoa.nguyen@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP008",
            fullName: "Hoa Nguyen",
            email: "hoa.nguyen@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "phuc.nguyen@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP009",
            fullName: "Phuc Nguyen",
            email: "phuc.nguyen@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
          },
        },
      },
      include: {
        squadMember: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "tony.dai@example.com",
        passwordHash: "hashed_password",
        squadMember: {
          create: {
            squadId: sonicSquad.id,
            pid: "EMP010",
            fullName: "Tony Dai",
            email: "tony.dai@example.com",
            position: "Senior Developer",
            status: "ACTIVE",
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

  // Create StandupHosting for the next 30 days
  const today = startOfDay(new Date());
  const squadSonic = await prisma.squad.findUnique({
    where: { code: 'Sonic' },
    include: { members: true }
  });

  const squadTroy = await prisma.squad.findUnique({
    where: { code: 'Troy' },
    include: { members: true }
  });

  if (squadSonic && squadTroy) {
    // Generate StandupHosting for Squad Sonic (Monday to Friday only)
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Skip weekends (Saturday and Sunday)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const memberIndex = i % squadSonic.members.length;
      const member = squadSonic.members[memberIndex];

      await prisma.standupHosting.create({
        data: {
          squadId: squadSonic.id,
          memberId: member.id,
          date,
          status: 'SCHEDULED'
        }
      });
    }

    // Generate StandupHosting for Squad Troy (Monday to Friday only)
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Skip weekends (Saturday and Sunday)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const memberIndex = i % squadTroy.members.length;
      const member = squadTroy.members[memberIndex];

      await prisma.standupHosting.create({
        data: {
          squadId: squadTroy.id,
          memberId: member.id,
          date,
          status: 'SCHEDULED'
        }
      });
    }

    // Generate IncidentRotation for Squad Sonic only (all days including weekends)
    // Since they are the Production Support team
    const sprintLength = 14; // 2 weeks
    const numberOfSprints = 4; // Generate for 4 sprints

    for (let sprint = 0; sprint < numberOfSprints; sprint++) {
      const startDate = addDays(today, sprint * sprintLength);
      const endDate = addDays(startDate, sprintLength - 1);

      // Create rotation for each sprint
      await prisma.incidentRotation.create({
        data: {
          squadId: squadSonic.id,
          primaryMemberId: squadSonic.members[sprint % squadSonic.members.length].id,
          secondaryMemberId: squadSonic.members[(sprint + 1) % squadSonic.members.length].id,
          startDate,
          endDate,
          sprintNumber: sprint + 1
        }
      });

      // Create some rotation swaps for weekends
      const weekendSwaps = [
        {
          requesterId: squadSonic.members[sprint % squadSonic.members.length].id,
          accepterId: squadSonic.members[(sprint + 2) % squadSonic.members.length].id,
          swapDate: addDays(startDate, 6), // First Saturday
        },
        {
          requesterId: squadSonic.members[(sprint + 1) % squadSonic.members.length].id,
          accepterId: squadSonic.members[(sprint + 3) % squadSonic.members.length].id,
          swapDate: addDays(startDate, 13), // Second Saturday
        }
      ];

      for (const swap of weekendSwaps) {
        await prisma.rotationSwap.create({
          data: {
            rotationId: (await prisma.incidentRotation.findFirst({
              where: {
                squadId: squadSonic.id,
                startDate,
                endDate,
              }
            }))!.id,
            requesterId: swap.requesterId,
            accepterId: swap.accepterId,
            swapDate: swap.swapDate,
            status: 'PENDING'
          }
        });
      }
    }

    // No IncidentRotation for Squad Troy as they are not a Production Support team
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