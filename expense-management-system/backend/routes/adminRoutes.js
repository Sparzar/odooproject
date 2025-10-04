// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { permit } = require('../middleware/roleMiddleware');
const { createUser, listUsers, updateUserRole } = require('../controllers/admin/userManagementController');
const { createApprovalRule, listRules } = require('../controllers/admin/approvalRulesController');
const { overrideExpenseStatus } = require('../controllers/common/overrideController');
router.use(auth, permit('admin'));

// User management
router.post('/users', createUser);
router.get('/users', listUsers);
router.patch('/users/:userId/role', updateUserRole);

// Approval rules
router.post('/approval-rules', createApprovalRule);
router.get('/approval-rules', listRules);
router.patch('/expenses/:expenseId/override', overrideExpenseStatus);
module.exports = router;

