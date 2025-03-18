import { PrismaClient } from '@prisma/client';
import { format, subDays } from 'date-fns';

const prisma = new PrismaClient();

async function checkMemberSchedules() {
  try {
    // Lấy danh sách tất cả members
    const members = await prisma.squadMember.findMany({
      include: {
        squad: true
      }
    });

    if (members.length === 0) {
      console.log('Không tìm thấy thành viên nào');
      return;
    }

    const today = new Date();
    const pastDate = subDays(today, 30); // Lịch sử 30 ngày trước
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30); // Lịch trực 30 ngày tới

    for (const member of members) {
      console.log(`\n=== Lịch trực của ${member.fullName} (${member.squad.name}) ===\n`);

      // Kiểm tra Incident Rotation
      console.log('--- Incident Rotation ---');
      
      // Lịch trực incident sắp tới
      const upcomingRotations = await prisma.incidentRotation.findMany({
        where: {
          OR: [
            { primaryMemberId: member.id },
            { secondaryMemberId: member.id }
          ],
          startDate: {
            gte: today,
            lte: futureDate
          }
        },
        orderBy: {
          startDate: 'asc'
        }
      });

      if (upcomingRotations.length > 0) {
        console.log('\nLịch trực incident sắp tới:');
        console.log('Sprint\tThời gian\t\t\tVai trò\t\tTrạng thái');
        console.log('-------------------------------------------------------------------------');
        
        upcomingRotations.forEach(rotation => {
          const startDateStr = format(rotation.startDate, 'dd/MM/yyyy');
          const endDateStr = format(rotation.endDate, 'dd/MM/yyyy');
          const role = rotation.primaryMemberId === member.id ? 'Primary' : 'Secondary';
          const status = rotation.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành';
          console.log(`${rotation.sprintNumber}\t${startDateStr} - ${endDateStr}\t${role}\t\t${status}`);
        });
      } else {
        console.log('Không có lịch trực incident sắp tới');
      }

      // Lịch sử incident rotation
      const pastRotations = await prisma.incidentRotation.findMany({
        where: {
          OR: [
            { primaryMemberId: member.id },
            { secondaryMemberId: member.id }
          ],
          endDate: {
            gte: pastDate,
            lt: today
          }
        },
        orderBy: {
          startDate: 'desc'
        }
      });

      if (pastRotations.length > 0) {
        console.log('\nLịch sử incident rotation:');
        console.log('Sprint\tThời gian\t\t\tVai trò\t\tTrạng thái');
        console.log('-------------------------------------------------------------------------');
        
        pastRotations.forEach(rotation => {
          const startDateStr = format(rotation.startDate, 'dd/MM/yyyy');
          const endDateStr = format(rotation.endDate, 'dd/MM/yyyy');
          const role = rotation.primaryMemberId === member.id ? 'Primary' : 'Secondary';
          const status = rotation.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành';
          console.log(`${rotation.sprintNumber}\t${startDateStr} - ${endDateStr}\t${role}\t\t${status}`);
        });
      } else {
        console.log('\nKhông có lịch sử incident rotation trong 30 ngày qua');
      }

      // Kiểm tra Standup Hosting
      console.log('\n--- Standup Hosting ---');
      
      // Lịch host standup sắp tới
      const upcomingHostings = await prisma.standupHosting.findMany({
        where: {
          memberId: member.id,
          date: {
            gte: today,
            lte: futureDate
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      if (upcomingHostings.length > 0) {
        console.log('\nLịch host standup sắp tới:');
        console.log('Ngày\t\t\tTrạng thái\t\tHoàn thành');
        console.log('-------------------------------------------------------------------------');
        
        upcomingHostings.forEach(hosting => {
          const dateStr = format(hosting.date, 'dd/MM/yyyy');
          const completionStatus = hosting.isCompleted ? 'Có' : 'Không';
          console.log(`${dateStr}\t\t${hosting.status}\t\t${completionStatus}`);
        });
      } else {
        console.log('Không có lịch host standup sắp tới');
      }

      // Lịch sử standup hosting
      const pastHostings = await prisma.standupHosting.findMany({
        where: {
          memberId: member.id,
          date: {
            gte: pastDate,
            lt: today
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      if (pastHostings.length > 0) {
        console.log('\nLịch sử standup hosting:');
        console.log('Ngày\t\t\tTrạng thái\t\tHoàn thành');
        console.log('-------------------------------------------------------------------------');
        
        pastHostings.forEach(hosting => {
          const dateStr = format(hosting.date, 'dd/MM/yyyy');
          const completionStatus = hosting.isCompleted ? 'Có' : 'Không';
          console.log(`${dateStr}\t\t${hosting.status}\t\t${completionStatus}`);
        });
      } else {
        console.log('\nKhông có lịch sử standup hosting trong 30 ngày qua');
      }

      // Thống kê tổng quát
      console.log('\n=== Thống kê tổng quát ===');
      console.log(`Tổng số lần làm Primary: ${pastRotations.filter(r => r.primaryMemberId === member.id).length}`);
      console.log(`Tổng số lần làm Secondary: ${pastRotations.filter(r => r.secondaryMemberId === member.id).length}`);
      console.log(`Tổng số lần host standup: ${pastHostings.length}`);
      console.log(`Tỷ lệ hoàn thành standup: ${pastHostings.filter(h => h.isCompleted).length}/${pastHostings.length}`);
    }

  } catch (error) {
    console.error('Lỗi khi kiểm tra lịch trực của thành viên:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy hàm kiểm tra
checkMemberSchedules()
  .then(() => console.log('\nKiểm tra hoàn tất!'))
  .catch(e => console.error(e)); 