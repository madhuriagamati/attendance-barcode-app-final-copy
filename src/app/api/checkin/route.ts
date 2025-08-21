import { prisma } from '@/lib/db';
import { sendAttendanceEmail } from '@/lib/email';
import { checkinHtml } from '@/emails/checkin';
import { appendAttendanceToSheet } from '@/lib/googleSheets';
import { SCHOOL_NAME } from '@/lib/config';
import dayjs from 'dayjs';
export async function POST(req: Request) {
  try {
    const { code, type = 'checkin' } = await req.json();
    if (!code) return Response.json({ ok: false, message: 'No barcode provided.' }, { status: 400 });

    const student = await prisma.student.findUnique({ where: { barcode: code } });
    if (!student) return Response.json({ ok: false, message: `No student found for barcode: ${code}` }, { status: 404 });

    const now = new Date();

    await prisma.attendance.create({ data: { studentId: student.id, type, timestamp: now } });

    // … existing notifyOnce + email + sheets code stays the same …

    const message = `${student.name} ${type === 'checkin' ? 'checked in' : 'checked out'} at ${now.toLocaleTimeString('en-US')}`;
    return Response.json({
      ok: true,
      message,
      studentName: student.name,
      timestamp: now.toISOString(),
      type
    });
  } catch (e: any) {
    console.error(e);
    return Response.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}