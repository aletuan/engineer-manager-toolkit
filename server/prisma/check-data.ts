import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function checkData() {
  try {
    // Check squads
    console.log('\n=== Squads ===');
    const squads = await prisma.squad.findMany({
      include: {
        members: true,
      },
    });
    console.log(`Total squads: ${squads.length}`);
    squads.forEach(squad => {
      console.log(`\nSquad: ${squad.name} (${squad.code})`);
      console.log(`Members: ${squad.members.length}`);
      squad.members.forEach(member => {
        console.log(`- ${member.fullName} (${member.email})`);
      });
    });

    // Check standup hostings
    console.log('\n=== Standup Hostings ===');
    const standupHostings = await prisma.standupHosting.findMany({
      include: {
        squad: true,
        member: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    console.log(`Total standup hostings: ${standupHostings.length}`);
    
    // Group by squad
    const hostingsBySquad = standupHostings.reduce((acc, hosting) => {
      if (!acc[hosting.squad.name]) {
        acc[hosting.squad.name] = [];
      }
      acc[hosting.squad.name].push(hosting);
      return acc;
    }, {} as Record<string, typeof standupHostings>);

    Object.entries(hostingsBySquad).forEach(([squadName, hostings]) => {
      console.log(`\nSquad: ${squadName}`);
      console.log(`Total hostings: ${hostings.length}`);
      // Group by date
      const hostingsByDate = hostings.reduce((acc, hosting) => {
        const dateStr = format(hosting.date, 'yyyy-MM-dd');
        if (!acc[dateStr]) {
          acc[dateStr] = [];
        }
        acc[dateStr].push(hosting);
        return acc;
      }, {} as Record<string, typeof hostings>);

      Object.entries(hostingsByDate).forEach(([date, dayHostings]) => {
        console.log(`\nDate: ${date}`);
        dayHostings.forEach(hosting => {
          console.log(`- Host: ${hosting.member.fullName}`);
        });
      });
    });

    // Check incident rotations
    console.log('\n=== Incident Rotations ===');
    const incidentRotations = await prisma.incidentRotation.findMany({
      include: {
        squad: true,
        primaryMember: true,
        secondaryMember: true,
        swaps: {
          include: {
            requester: true,
            accepter: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    console.log(`Total incident rotations: ${incidentRotations.length}`);

    // Group by squad
    const rotationsBySquad = incidentRotations.reduce((acc, rotation) => {
      if (!acc[rotation.squad.name]) {
        acc[rotation.squad.name] = [];
      }
      acc[rotation.squad.name].push(rotation);
      return acc;
    }, {} as Record<string, typeof incidentRotations>);

    Object.entries(rotationsBySquad).forEach(([squadName, rotations]) => {
      console.log(`\nSquad: ${squadName}`);
      console.log(`Total rotations: ${rotations.length}`);
      rotations.forEach(rotation => {
        console.log(`\nSprint ${rotation.sprintNumber}:`);
        console.log(`Period: ${format(rotation.startDate, 'yyyy-MM-dd')} - ${format(rotation.endDate, 'yyyy-MM-dd')}`);
        console.log(`Primary: ${rotation.primaryMember.fullName}`);
        console.log(`Secondary: ${rotation.secondaryMember.fullName}`);
        if (rotation.swaps.length > 0) {
          console.log('Swaps:');
          rotation.swaps.forEach(swap => {
            console.log(`- ${format(swap.swapDate, 'yyyy-MM-dd')}: ${swap.requester.fullName} -> ${swap.accepter.fullName}`);
          });
        }
      });
    });

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 