import { prisma } from "@/lib/prisma";


export class MockEmailService {
  static async sendEmail(to: string, subject: string, body: string) {
    console.log(`\n=========================================`);
    console.log(`📧 MOCK EMAIL SENT`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log(`=========================================\n`);
  }
}

export async function createNotification(
  organizationId: string,
  recipientId: string,
  type: string,
  title: string,
  message: string,
  sendEmail: boolean = true
) {
  // 1. Create In-App Notification (Database)
  const notification = await prisma.notification.create({
    data: {
      organizationId,
      recipientId,
      type,
      title,
      message,
    },
    include: { recipient: true }
  });

  // 2. Dispatch Email
  if (sendEmail && notification.recipient?.email) {
    await MockEmailService.sendEmail(
      notification.recipient.email,
      `[BrahmOS] ${title}`,
      `Hello,\n\nYou have a new notification on the BrahmOS platform:\n\n${message}\n\nPlease log in to view the details.`
    );
  }

  return notification;
}
