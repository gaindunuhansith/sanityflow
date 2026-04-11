import { jest } from '@jest/globals';

const mockSend = jest.fn<(...args: any[]) => Promise<{ id: string }>>().mockResolvedValue({ id: 'mock-1' });

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => {
      return {
        emails: {
          send: mockSend
        }
      };
    })
  };
});

import { sendOrderAssignedEmail, sendStatusUpdateEmail, sendLowStockAlertEmail } from '../../services/email.service.js';
import env from '../../config/env.js';

describe('Email Service Integration (Mocked)', () => {
  afterEach(() => {
    mockSend.mockClear();
  });

  it('should send an order assigned email', async () => {
    await sendOrderAssignedEmail({
      driverEmail: 'driver@test.com',
      driverName: 'John',
      orderId: 'ORD-001',
      targetLocation: 'Loc A'
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      to: 'driver@test.com',
      subject: 'New Delivery Order Assigned to You'
    }));
  });

  it('should send a status update email', async () => {
    await sendStatusUpdateEmail({
      recipientEmail: 'user@test.com',
      orderId: 'ORD-002',
      targetLocation: 'Loc B',
      status: 'Delivered',
      notes: 'All good'
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should send a low stock alert email', async () => {
    await sendLowStockAlertEmail({
      resourceName: 'Water',
      category: 'Drinks',
      quantity: 5,
      reorderLevel: 10,
      unit: 'liters',
      supplierName: 'Sup A'
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      to: env.ALERT_EMAIL
    }));
  });
});
