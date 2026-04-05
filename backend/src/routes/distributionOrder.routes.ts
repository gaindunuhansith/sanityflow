
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

distributionOrderRouter.get('/', auth,  getAllDistributionOrders);
distributionOrderRouter.get('/:id', auth,  getDistributionOrderById);
distributionOrderRouter.post('/', auth,  createDistributionOrder);
distributionOrderRouter.put('/:id', auth,  updateDistributionOrder);
distributionOrderRouter.put('/:id/status', auth,  updateDeliveryStatus);
distributionOrderRouter.delete('/:id', auth, deleteDistributionOrder);

export default distributionOrderRouter;
