import { Resend } from 'resend';
import env from '../config/env.js';
import Logger from '../utils/logger.js';

const resend = new Resend(env.EMAIL_API_KEY);

const FROM = 'onboarding@resend.dev';



// --- Templates ---

const orderAssignedTemplate = (driverName: string, orderId: string, targetLocation: string) => ({
  subject: 'New Delivery Order Assigned to You',
  html: `
    <h2>Hello ${driverName},</h2>
    <p>A new distribution order has been assigned to you.</p>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Order ID</strong></td><td style="padding:8px;border:1px solid #ddd">${orderId}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Delivery Location</strong></td><td style="padding:8px;border:1px solid #ddd">${targetLocation}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Status</strong></td><td style="padding:8px;border:1px solid #ddd">Assigned</td></tr>
    </table>
    <p>Please log in to the SanityFlow system to confirm and begin your delivery.</p>
    <br/><p>— SanityFlow Team</p>
  `,
});

const statusUpdateTemplate = (orderId: string, targetLocation: string, status: string, notes?: string) => ({
  subject: `Distribution Order ${status} — ${orderId}`,
  html: `
    <h2>Order Status Update</h2>
    <p>The following distribution order has been updated.</p>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Order ID</strong></td><td style="padding:8px;border:1px solid #ddd">${orderId}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Delivery Location</strong></td><td style="padding:8px;border:1px solid #ddd">${targetLocation}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>New Status</strong></td><td style="padding:8px;border:1px solid #ddd"><strong>${status}</strong></td></tr>
      ${notes ? `<tr><td style="padding:8px;border:1px solid #ddd"><strong>Notes</strong></td><td style="padding:8px;border:1px solid #ddd">${notes}</td></tr>` : ''}
    </table>
    <br/><p>— SanityFlow Team</p>
  `,
});

const lowStockAlertTemplate = (resourceName: string, category: string, quantity: number, reorderLevel: number, unit: string, supplierName: string) => ({
  subject: `⚠️ Low Stock Alert — ${resourceName}`,
  html: `
    <h2>Low Stock Alert</h2>
    <p>The following resource has fallen below its reorder level and requires immediate attention.</p>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Resource</strong></td><td style="padding:8px;border:1px solid #ddd">${resourceName}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Category</strong></td><td style="padding:8px;border:1px solid #ddd">${category}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Current Quantity</strong></td><td style="padding:8px;border:1px solid #ddd;color:red"><strong>${quantity} ${unit}</strong></td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Reorder Level</strong></td><td style="padding:8px;border:1px solid #ddd">${reorderLevel} ${unit}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd"><strong>Supplier</strong></td><td style="padding:8px;border:1px solid #ddd">${supplierName}</td></tr>
    </table>
    <p>Please reorder stock as soon as possible to avoid shortages.</p>
    <br/><p>— SanityFlow Team</p>
  `,
});

// --- Public API ---

export const sendOrderAssignedEmail = async (opts: {
  driverEmail: string;
  driverName: string;
  orderId: string;
  targetLocation: string;
}) => {
  const { subject, html } = orderAssignedTemplate(opts.driverName, opts.orderId, opts.targetLocation);
  try {
    await resend.emails.send({ from: FROM, to: opts.driverEmail, subject, html });
    Logger.info(`Order assigned email sent to driver ${opts.driverEmail}`);
  } catch (err) {
    Logger.error(`Failed to send order assigned email: ${err}`);
  }
};

export const sendStatusUpdateEmail = async (opts: {
  recipientEmail: string;
  orderId: string;
  targetLocation: string;
  status: string;
  notes?: string;
}) => {
  const { subject, html } = statusUpdateTemplate(opts.orderId, opts.targetLocation, opts.status, opts.notes);
  try {
    await resend.emails.send({ from: FROM, to: opts.recipientEmail, subject, html });
    Logger.info(`Status update email (${opts.status}) sent to ${opts.recipientEmail}`);
  } catch (err) {
    Logger.error(`Failed to send status update email: ${err}`);
  }
};

export const sendLowStockAlertEmail = async (opts: {
  recipientEmail?: string;
  resourceName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  supplierName: string;
}) => {
  const { subject, html } = lowStockAlertTemplate(
    opts.resourceName,
    opts.category,
    opts.quantity,
    opts.reorderLevel,
    opts.unit,
    opts.supplierName,
  );
  
  const toAddress = opts.recipientEmail || env.ALERT_EMAIL;

  try {
    await resend.emails.send({ from: FROM, to: toAddress, subject, html });
    Logger.warn(`Low stock alert sent for "${opts.resourceName}" to ${toAddress} (qty: ${opts.quantity}, reorder level: ${opts.reorderLevel})`);
  } catch (err) {
    Logger.error(`Failed to send low stock alert email: ${err}`);
  }
};
