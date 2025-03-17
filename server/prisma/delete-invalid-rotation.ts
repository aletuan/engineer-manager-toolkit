import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteInvalidRotation() {
  try {
    await prisma.rotationSwap.deleteMany({
      where: {
        rotation: {
          endDate: new Date('2024-12-31'),
        },
      },
    });

    await prisma.incidentRotation.deleteMany({
      where: {
        endDate: new Date('2024-12-31'),
      },
    });

    console.log('Invalid rotation deleted successfully');
  } catch (error) {
    console.error('Error deleting invalid rotation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteInvalidRotation(); 