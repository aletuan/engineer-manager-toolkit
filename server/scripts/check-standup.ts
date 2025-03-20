import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const standupHostings = await prisma.standupHosting.findMany({
    where: {
      member: {
        pid: '22832742'
      },
      date: {
        gte: new Date('2025-03-31')
      }
    },
    include: {
      member: true
    },
    orderBy: {
      date: 'asc'
    },
    take: 10
  });

  console.log('Kiet\'s Standup Hosting Schedule:');
  console.log('=================================');
  standupHostings.forEach(hosting => {
    console.log(`Date: ${hosting.date.toISOString().split('T')[0]}`);
    console.log(`Name: ${hosting.member.fullName}`);
    console.log(`PID: ${hosting.member.pid}`);
    console.log(`Status: ${hosting.status}`);
    console.log('---------------------------------');
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