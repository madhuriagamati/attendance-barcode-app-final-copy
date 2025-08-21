import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const students = [
    { name: 'Alice Nguyen', barcode: 'STU-0001', email1: 'parent1@example.com' },
    { name: 'Bobby Singh', barcode: 'STU-0002', email1: 'parent2@example.com' },
    { name: 'Charlie Kim', barcode: 'STU-0003', email1: 'parent3@example.com' }
  ];
  for (const s of students) {
    await prisma.student.upsert({ where: { barcode: s.barcode }, update: {}, create: s });
  }
  console.log('Seeded/ensured sample students.');
}
main().finally(async () => prisma.$disconnect());
