import express from 'express';
import adminRoutes from '../roles/admin/index.js';
import managerRoutes from '../roles/manager/index.js';
import employeeRoutes from '../roles/employee/index.js';

const router = express.Router();

// Admin routes
router.use('/admin', adminRoutes);

// Manager routes
router.use('/manager', managerRoutes);

// Employee routes
router.use('/employee', employeeRoutes);

export default router;