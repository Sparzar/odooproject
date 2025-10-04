// routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { permit } = require('../middleware/roleMiddleware');
const { pendingForApproval, decide } = require('../controllers/manager/expenseApprovalController');

router.use(auth, permit('manager','admin')); // admins should be able to act like managers too

router.get('/approvals/pending', pendingForApproval);
router.post('/approvals/:approvalId/decide', decide);

module.exports = router;
