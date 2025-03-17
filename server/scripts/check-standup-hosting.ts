import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function checkStandupHosting() {
  try {
    // Lấy thông tin về các squad
    const squads = await prisma.squad.findMany({
      where: {
        code: {
          in: ['Troy', 'Sonic']
        }
      }
    });

    if (squads.length === 0) {
      console.log('Không tìm thấy squad Troy hoặc Sonic');
      return;
    }

    // Lấy ngày hiện tại và ngày kết thúc (30 ngày sau)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);

    // Kiểm tra lịch trực cho từng squad
    for (const squad of squads) {
      console.log(`\n=== Lịch trực Standup Hosting cho Squad ${squad.name} ===\n`);
      
      const standupHostings = await prisma.standupHosting.findMany({
        where: {
          squadId: squad.id,
          date: {
            gte: today,
            lte: endDate
          }
        },
        include: {
          member: {
            select: {
              fullName: true,
              email: true,
              position: true
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      if (standupHostings.length === 0) {
        console.log(`Không có lịch trực standup hosting cho squad ${squad.name} trong 30 ngày tới`);
        continue;
      }

      // In ra lịch trực
      console.log('Ngày\t\t\tThành viên\t\tTrạng thái');
      console.log('--------------------------------------------------------');
      
      standupHostings.forEach(hosting => {
        const dateStr = format(hosting.date, 'dd/MM/yyyy');
        console.log(`${dateStr}\t\t${hosting.member.fullName}\t\t${hosting.status}`);
      });
      
      console.log(`\nTổng số lịch trực: ${standupHostings.length}`);
      
      // Thống kê số lượng lịch trực theo thành viên
      const memberStats = standupHostings.reduce((acc, hosting) => {
        const memberName = hosting.member.fullName;
        acc[memberName] = (acc[memberName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('\nThống kê số lượng lịch trực theo thành viên:');
      Object.entries(memberStats).forEach(([member, count]) => {
        console.log(`${member}: ${count} lần`);
      });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra lịch trực standup hosting:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy hàm kiểm tra
checkStandupHosting()
  .then(() => console.log('\nKiểm tra hoàn tất!'))
  .catch(e => console.error(e)); 