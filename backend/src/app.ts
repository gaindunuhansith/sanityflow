import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import issueRoutes from './routes/issue.routes.js';
import waterTestRoutes from './routes/waterTest.routes.js';
import waterSourceRoutes from './routes/waterSource.routes.js';
import distributionOrderRoutes from './routes/distributionOrder.routes.js';
import beneficiaryRoutes from './routes/beneficiary.routes.js';
import blogRoutes from './routes/blog.routes.js';
import forumRoutes from './routes/forum.routes.js';
import driverRoutes from './routes/driver.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import inventoryTransactionRoutes from './routes/inventoryTransaction.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import barcodeRoutes from "./routes/barcode.routes.js";
import aiRoutes from './routes/ai.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import errorHandler from './utils/errorHandler.js';
import helmet from 'helmet';
import morganMiddleware from './config/morgan.js';
import apiRateLimiter from './middleware/rateLimit.js';

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morganMiddleware);
app.use(apiRateLimiter);


//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/issues', issueRoutes);
app.use('/api/v1/water-tests', waterTestRoutes);
app.use('/api/v1/water-sources', waterSourceRoutes);
app.use('/api/v1/distributions', distributionOrderRoutes);
app.use('/api/v1/beneficiaries', beneficiaryRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/community/forum', forumRoutes);

app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/inventory-transactions', inventoryTransactionRoutes);
app.use('/api/v1/barcode', barcodeRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/weather', weatherRoutes);


app.use(errorHandler);

export default app;