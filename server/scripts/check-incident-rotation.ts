import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

async function checkIncidentRotation() {
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

    // Lấy ngày hiện tại và ngày kết thúc (90 ngày sau)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 90);

    // Kiểm tra lịch trực cho từng squad
    for (const squad of squads) {
      console.log(`\n=== Lịch trực Incident Rotation cho Squad ${squad.name} ===\n`);
      
      const incidentRotations = await prisma.incidentRotation.findMany({
        where: {
          squadId: squad.id,
          startDate: {
            lte: endDate
          },
          endDate: {
            gte: today
          }
        },
        include: {
          primaryMember: {
            select: {
              id: true,
              fullName: true,
              email: true,
              position: true
            }
          },
          secondaryMember: {
            select: {
              id: true,
              fullName: true,
              email: true,
              position: true
            }
          },
          swaps: {
            include: {
              requester: {
                select: {
                  fullName: true
                }
              },
              accepter: {
                select: {
                  fullName: true
                }
              }
            }
          }
        },
        orderBy: {
          startDate: 'asc'
        }
      });

      if (incidentRotations.length === 0) {
        console.log(`Không có lịch trực incident rotation cho squad ${squad.name} trong 90 ngày tới`);
        continue;
      }

      // In ra lịch trực
      console.log('Sprint\tThời gian\t\t\tPrimary\t\t\tSecondary');
      console.log('-------------------------------------------------------------------------');
      
      incidentRotations.forEach(rotation => {
        const startDateStr = format(rotation.startDate, 'dd/MM/yyyy');
        const endDateStr = format(rotation.endDate, 'dd/MM/yyyy');
        console.log(`${rotation.sprintNumber}\t${startDateStr} - ${endDateStr}\t${rotation.primaryMember.fullName}\t${rotation.secondaryMember.fullName}`);
      });
      
      console.log(`\nTổng số sprint: ${incidentRotations.length}`);
      
      // Thống kê số lượng lịch trực theo thành viên
      const memberStats: Record<string, { primary: number, secondary: number, total: number }> = {};
      
      incidentRotations.forEach(rotation => {
        const primaryName = rotation.primaryMember.fullName;
        const secondaryName = rotation.secondaryMember.fullName;
        
        // Khởi tạo nếu chưa có
        if (!memberStats[primaryName]) {
          memberStats[primaryName] = { primary: 0, secondary: 0, total: 0 };
        }
        if (!memberStats[secondaryName]) {
          memberStats[secondaryName] = { primary: 0, secondary: 0, total: 0 };
        }
        
        // Cập nhật số liệu
        memberStats[primaryName].primary += 1;
        memberStats[primaryName].total += 1;
        memberStats[secondaryName].secondary += 1;
        memberStats[secondaryName].total += 1;
      });
      
      console.log('\nThống kê số lượng lịch trực theo thành viên:');
      console.log('Thành viên\t\tPrimary\tSecondary\tTổng');
      console.log('--------------------------------------------------------');
      
      Object.entries(memberStats).forEach(([member, stats]) => {
        console.log(`${member}\t\t${stats.primary}\t${stats.secondary}\t\t${stats.total}`);
      });
      
      // Thống kê các swap requests
      const swapRequests = incidentRotations.flatMap(rotation => rotation.swaps);
      
      if (swapRequests.length > 0) {
        console.log('\nDanh sách các yêu cầu swap:');
        console.log('Người yêu cầu\t\tNgười nhận\t\tNgày swap\t\tTrạng thái');
        console.log('-------------------------------------------------------------------------');
        
        swapRequests.forEach(swap => {
          const swapDateStr = format(swap.swapDate, 'dd/MM/yyyy');
          console.log(`${swap.requester.fullName}\t\t${swap.accepter.fullName}\t\t${swapDateStr}\t\t${swap.status}`);
        });
        
        console.log(`\nTổng số yêu cầu swap: ${swapRequests.length}`);
      }
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra lịch trực incident rotation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy hàm kiểm tra
checkIncidentRotation()
  .then(() => console.log('\nKiểm tra hoàn tất!'))
  .catch(e => console.error(e)); 