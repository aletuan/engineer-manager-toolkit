import { PrismaClient, MemberStatus, TaskStatus, TaskPriority, AssigneeRole, DependencyType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.rotationSwap.deleteMany();
  await prisma.incidentRotation.deleteMany();
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

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: await hash('admin123', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: await hash('user123', 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create squads
  const squad1 = await prisma.squad.create({
    data: {
      name: 'Frontend Team',
      code: 'FE',
      description: 'Frontend development team',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const squad2 = await prisma.squad.create({
    data: {
      name: 'Backend Team',
      code: 'BE',
      description: 'Backend development team',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create squad members
  const member1 = await prisma.squadMember.create({
    data: {
      squadId: squad1.id,
      userId: user1.id,
      pid: 'EMP001',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      position: 'Senior Frontend Developer',
      avatarUrl: 'https://placekitten.com/200/200',
      status: MemberStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const member2 = await prisma.squadMember.create({
    data: {
      squadId: squad2.id,
      userId: user2.id,
      pid: 'EMP002',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      position: 'Senior Backend Developer',
      avatarUrl: 'https://placekitten.com/201/201',
      status: MemberStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create stakeholders
  const stakeholder1 = await prisma.stakeholder.create({
    data: {
      code: 'STK001',
      name: 'Product Owner',
      description: 'Product owner for the project',
      contactName: 'Alice Johnson',
      contactEmail: 'alice@example.com',
      contactPhone: '1234567890',
      groupName: 'Product Management',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Implement User Authentication',
      description: 'Implement user authentication using JWT',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2024-12-31'),
      featureId: 'AUTH-001',
      assignedToId: member1.id,
      createdById: member2.id,
      tags: ['authentication', 'security'],
      attachments: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Design Database Schema',
      description: 'Design and implement database schema',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2024-12-31'),
      featureId: 'DB-001',
      assignedToId: member2.id,
      createdById: member1.id,
      tags: ['database', 'design'],
      attachments: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create task assignees
  await prisma.taskAssignee.create({
    data: {
      taskId: task1.id,
      memberId: member1.id,
      role: AssigneeRole.PRIMARY,
      createdAt: new Date(),
    },
  });

  // Create task stakeholders
  await prisma.taskStakeholder.create({
    data: {
      taskId: task1.id,
      stakeholderId: stakeholder1.id,
      createdAt: new Date(),
    },
  });

  // Create task dependencies
  await prisma.taskDependency.create({
    data: {
      taskId: task1.id,
      dependentTaskId: task2.id,
      dependencyType: DependencyType.BLOCKS,
      createdAt: new Date(),
    },
  });

  // Create task notes
  await prisma.taskNote.create({
    data: {
      taskId: task1.id,
      authorId: member1.id,
      content: 'Initial implementation plan',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create task comments
  await prisma.taskComment.create({
    data: {
      content: 'Please review the implementation plan',
      taskId: task1.id,
      createdById: member2.id,
      createdAt: new Date(),
    },
  });

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
      squadId: squad1.id,
      memberId: member1.id,
      roleId: role1.id,
      assignedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create incident rotations
  const rotation1 = await prisma.incidentRotation.create({
    data: {
      squadId: squad1.id,
      primaryMemberId: member1.id,
      secondaryMemberId: member2.id,
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
      requesterId: member1.id,
      accepterId: member2.id,
      swapDate: new Date('2024-12-25'),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create sprint reports
  await prisma.sprintReport.create({
    data: {
      squadId: squad1.id,
      sprintNumber: 1,
      startDate: new Date(),
      endDate: new Date('2024-12-31'),
      totalPoints: 100,
      completedPoints: 50,
      memberMetrics: {},
      stakeholderMetrics: {},
      createdAt: new Date(),
    },
  });

  // Create activity logs
  await prisma.activityLog.create({
    data: {
      userId: user1.id,
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