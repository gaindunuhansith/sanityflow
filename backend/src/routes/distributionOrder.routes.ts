
import { Router } from 'express';
import auth, { requireRole } from '../middleware/auth.js';
import {
  createDistributionOrder,
  getAllDistributionOrders,
  getDistributionOrderById,
  updateDistributionOrder,
  updateDeliveryStatus,
  deleteDistributionOrder
} from '../controllers/distributionOrder.controller.js';

const distributionOrderRouter = Router();

distributionOrderRouter.get('/', auth, requireRole('admin', 'driver'), getAllDistributionOrders);
distributionOrderRouter.get('/:id', auth, requireRole('admin', 'driver'), getDistributionOrderById);
distributionOrderRouter.post('/', auth, requireRole('admin'), createDistributionOrder);
distributionOrderRouter.put('/:id', auth, requireRole('admin'), updateDistributionOrder);
distributionOrderRouter.put('/:id/status', auth, requireRole('driver'), updateDeliveryStatus);
distributionOrderRouter.delete('/:id', auth, requireRole('admin'), deleteDistributionOrder);

export default distributionOrderRouter;
