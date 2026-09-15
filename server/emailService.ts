import nodemailer from 'nodemailer';
import { db } from './db.js';
import { BookingRequest, Enquiry, EmailLog } from '../src/types.js';

interface EmailResult {
  success: boolean;
  messageId?: string;
  status: 'Sent' | 'Logged (Simulated)' | 'Failed';
  details: string;
}

class EmailService {
  private getTransporter() {
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;

    if (host && user && pass) {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
    }
    return null;
  }

  private logEmail(log: Omit<EmailLog, 'id' | 'date'>) {
    const newEntry: EmailLog = {
      id: `EML-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString(),
      ...log,
    };

    db.updateStore((store) => ({
      ...store,
      notifications: {
        ...store.notifications,
        emailLogs: [newEntry, ...(store.notifications.emailLogs || [])].slice(0, 50),
      },
    }));

    return newEntry;
  }

  public async sendBookingNotifications(booking: BookingRequest): Promise<{ adminResult: EmailResult; guestResult: EmailResult }> {
    const store = db.getStore();
    const notificationsConfig = store.notifications;
    const adminRecipient = process.env.ADMIN_EMAIL || notificationsConfig.adminNotificationEmail || 'zoomstays@gmail.com';
    const fromAddress = process.env.FROM_EMAIL || 'ZoomStay Reservations <reservations@zoomstay.in>';

    let adminResult: EmailResult = { success: false, status: 'Logged (Simulated)', details: '' };
    let guestResult: EmailResult = { success: false, status: 'Logged (Simulated)', details: '' };

    const transporter = this.getTransporter();

    // 1. Admin Alert Email
    const adminSubject = `🛎️ New Booking Request [${booking.id}] - ${booking.guestName} (${booking.propertyName})`;
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; border: 1px solid #e0d8cf; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E2229; color: #FAF8F5; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px;">ZOOMSTAY</h1>
          <p style="margin: 6px 0 0; color: #C5B49E; font-size: 14px;">Comfort, Culture & Connect</p>
        </div>
        <div style="padding: 24px; background: #FAF8F5;">
          <h2 style="margin-top: 0; color: #1E2229; font-size: 18px; border-bottom: 2px solid #E8DFD5; padding-bottom: 8px;">New Stay Request Received</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #666;">Request ID:</td><td style="font-weight: bold; color: #1E2229;">${booking.id}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Guest Name:</td><td style="font-weight: bold; color: #1E2229;">${booking.guestName}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Property:</td><td style="font-weight: bold; color: #1E2229;">${booking.propertyName}</td></tr>
            ${booking.unitName ? `<tr><td style="padding: 6px 0; color: #666;">Allocated Unit:</td><td style="font-weight: bold; color: #1E2229;">${booking.unitName}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #666;">Check-In:</td><td style="font-weight: bold; color: #1E2229;">${booking.checkInDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Check-Out:</td><td style="font-weight: bold; color: #1E2229;">${booking.checkOutDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Guests:</td><td style="font-weight: bold; color: #1E2229;">${booking.guestsCount} Guests (${booking.roomsCount} Unit/s)</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Phone:</td><td style="font-weight: bold; color: #1E2229;"><a href="tel:${booking.phone}">${booking.phone}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Email:</td><td style="font-weight: bold; color: #1E2229;">${booking.email}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Preferred Contact:</td><td style="font-weight: bold; color: #1E2229;">${booking.preferredContactMethod}</td></tr>
          </table>

          ${booking.specialRequest ? `
            <div style="margin-top: 16px; padding: 12px; background: #F0ECE4; border-left: 4px solid #8C7355; border-radius: 4px;">
              <strong>Guest Notes / Requests:</strong>
              <p style="margin: 4px 0 0; font-size: 13px; color: #444;">${booking.specialRequest}</p>
            </div>
          ` : ''}

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(booking.guestName)},%20thank%20you%20for%20reaching%20out%20to%20ZoomStay%20regarding%20${encodeURIComponent(booking.propertyName)}." style="display: inline-block; padding: 10px 20px; background: #25D366; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; margin-right: 8px;">Chat on WhatsApp</a>
          </div>
        </div>
      </div>
    `;

    if (transporter && notificationsConfig.emailNotificationsEnabled) {
      try {
        const info = await transporter.sendMail({
          from: fromAddress,
          to: adminRecipient,
          subject: adminSubject,
          html: adminHtml,
        });
        adminResult = {
          success: true,
          messageId: info.messageId,
          status: 'Sent',
          details: `Sent to ${adminRecipient}`,
        };
      } catch (err: any) {
        console.error('Failed to send admin email via SMTP:', err);
        adminResult = {
          success: false,
          status: 'Failed',
          details: `SMTP error: ${err.message}`,
        };
      }
    } else {
      console.log(`[EMAIL SIMULATED -> ADMIN] Subject: ${adminSubject}`);
      adminResult = {
        success: true,
        status: 'Logged (Simulated)',
        details: `Simulated dispatch to ${adminRecipient} (SMTP credentials optional in .env)`,
      };
    }

    this.logEmail({
      to: adminRecipient,
      subject: adminSubject,
      type: 'Booking Notification',
      status: adminResult.status,
      details: adminResult.details,
    });

    // 2. Customer Acknowledgement Email
    if (notificationsConfig.customerAcknowledgementEnabled && booking.email) {
      const guestSubject = `Your ZoomStay Reservation Request [Ref: ${booking.id}]`;
      const guestHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; border: 1px solid #e0d8cf; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1E2229; color: #FAF8F5; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px;">ZOOMSTAY</h1>
            <p style="margin: 6px 0 0; color: #C5B49E; font-size: 14px;">Comfort, Culture & Connect</p>
          </div>
          <div style="padding: 24px; background: #FAF8F5;">
            <h2 style="margin-top: 0; color: #1E2229; font-size: 18px;">Namaste ${booking.guestName},</h2>
            <p style="color: #444; font-size: 14px;">
              Thank you for choosing ZoomStay. We have received your stay request for <strong>${booking.propertyName}</strong> and our team is currently preparing your reservation details.
            </p>
            <div style="background: white; border: 1px solid #E8DFD5; border-radius: 6px; padding: 16px; margin: 16px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 4px 0; color: #777;">Booking Reference:</td><td style="font-weight: bold;">${booking.id}</td></tr>
                <tr><td style="padding: 4px 0; color: #777;">Property:</td><td style="font-weight: bold;">${booking.propertyName}</td></tr>
                <tr><td style="padding: 4px 0; color: #777;">Check-In:</td><td style="font-weight: bold;">${booking.checkInDate} (From 2:00 PM)</td></tr>
                <tr><td style="padding: 4px 0; color: #777;">Check-Out:</td><td style="font-weight: bold;">${booking.checkOutDate} (By 11:00 AM)</td></tr>
                <tr><td style="padding: 4px 0; color: #777;">Guests:</td><td style="font-weight: bold;">${booking.guestsCount} Guest(s)</td></tr>
              </table>
            </div>
            <p style="color: #555; font-size: 14px;">
              Our guest relations coordinator will contact you via <strong>${booking.preferredContactMethod}</strong> shortly to confirm availability, coordinates, and caretaker check-in details.
            </p>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E8DFD5; font-size: 12px; color: #777;">
              Need urgent assistance? Reach our reservations desk directly at <a href="mailto:zoomstays@gmail.com" style="color: #8C7355;">zoomstays@gmail.com</a> or WhatsApp +91 7905724673.
            </div>
          </div>
        </div>
      `;

      if (transporter) {
        try {
          const info = await transporter.sendMail({
            from: fromAddress,
            to: booking.email,
            subject: guestSubject,
            html: guestHtml,
          });
          guestResult = {
            success: true,
            messageId: info.messageId,
            status: 'Sent',
            details: `Dispatched to guest ${booking.email}`,
          };
        } catch (err: any) {
          console.error('Failed to send guest confirmation email via SMTP:', err);
          guestResult = {
            success: false,
            status: 'Failed',
            details: `SMTP error: ${err.message}`,
          };
        }
      } else {
        console.log(`[EMAIL SIMULATED -> GUEST] Dispatched to ${booking.email}`);
        guestResult = {
          success: true,
          status: 'Logged (Simulated)',
          details: `Simulated acknowledgement to ${booking.email}`,
        };
      }

      this.logEmail({
        to: booking.email,
        subject: guestSubject,
        type: 'Booking Acknowledgement',
        status: guestResult.status,
        details: guestResult.details,
      });
    }

    return { adminResult, guestResult };
  }

  public async sendEnquiryNotification(enquiry: Enquiry): Promise<EmailResult> {
    const store = db.getStore();
    const adminRecipient = process.env.ADMIN_EMAIL || store.notifications.adminNotificationEmail || 'zoomstays@gmail.com';
    const fromAddress = process.env.FROM_EMAIL || 'ZoomStay Enquiries <reservations@zoomstay.in>';

    const subject = `💬 New Guest Enquiry [${enquiry.id}] - ${enquiry.name} (${enquiry.enquiryType})`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; border: 1px solid #e0d8cf; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1E2229; color: #FAF8F5; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">ZOOMSTAY</h2>
          <p style="margin: 4px 0 0; color: #C5B49E; font-size: 13px;">New Enquiry Alert</p>
        </div>
        <div style="padding: 24px; background: #FAF8F5;">
          <p><strong>Enquiry Type:</strong> ${enquiry.enquiryType}</p>
          <p><strong>Name:</strong> ${enquiry.name}</p>
          <p><strong>Phone:</strong> <a href="tel:${enquiry.phone}">${enquiry.phone}</a></p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Subject:</strong> ${enquiry.subject}</p>
          <div style="margin: 16px 0; padding: 12px; background: white; border: 1px solid #E8DFD5; border-radius: 4px;">
            <strong>Message:</strong>
            <p style="margin: 6px 0 0; color: #333;">${enquiry.message}</p>
          </div>
        </div>
      </div>
    `;

    const transporter = this.getTransporter();
    let result: EmailResult;

    if (transporter && store.notifications.emailNotificationsEnabled) {
      try {
        const info = await transporter.sendMail({
          from: fromAddress,
          to: adminRecipient,
          subject,
          html,
        });
        result = {
          success: true,
          messageId: info.messageId,
          status: 'Sent',
          details: `Dispatched to ${adminRecipient}`,
        };
      } catch (err: any) {
        result = {
          success: false,
          status: 'Failed',
          details: `SMTP error: ${err.message}`,
        };
      }
    } else {
      console.log(`[ENQUIRY EMAIL SIMULATED] To: ${adminRecipient}`);
      result = {
        success: true,
        status: 'Logged (Simulated)',
        details: `Simulated dispatch to ${adminRecipient}`,
      };
    }

    this.logEmail({
      to: adminRecipient,
      subject,
      type: 'Enquiry Notification',
      status: result.status,
      details: result.details,
    });

    return result;
  }

  public async sendTestEmail(recipientEmail: string): Promise<EmailResult> {
    const fromAddress = process.env.FROM_EMAIL || 'ZoomStay System <reservations@zoomstay.in>';
    const subject = `Test Email from ZoomStay Hospitality Engine [${new Date().toLocaleTimeString()}]`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 8px;">
        <h2 style="color: #1E2229;">ZoomStay Email System Verification</h2>
        <p>This is an automated test confirming that the ZoomStay email notification architecture is active and functional.</p>
        <p style="color: #8C7355;">Brand: Comfort, Culture & Connect</p>
      </div>
    `;

    const transporter = this.getTransporter();
    let result: EmailResult;

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: fromAddress,
          to: recipientEmail,
          subject,
          html,
        });
        result = {
          success: true,
          messageId: info.messageId,
          status: 'Sent',
          details: `Successfully sent test email to ${recipientEmail}`,
        };
      } catch (err: any) {
        result = {
          success: false,
          status: 'Failed',
          details: `SMTP Error: ${err.message}`,
        };
      }
    } else {
      result = {
        success: true,
        status: 'Logged (Simulated)',
        details: `Simulated test email to ${recipientEmail} (Configure EMAIL_PASSWORD in .env for production SMTP delivery)`,
      };
    }

    this.logEmail({
      to: recipientEmail,
      subject,
      type: 'Test Email',
      status: result.status,
      details: result.details,
    });

    return result;
  }
}

export const emailService = new EmailService();
