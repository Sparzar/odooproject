// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { permit } = require('../middleware/roleMiddleware');
const { submitExpense, getMyExpenses } = require('../controllers/employee/expenseController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(auth, permit('employee','manager','admin')); // employees and others can use endpoints

router.post('/expenses', submitExpense);
router.get('/expenses', getMyExpenses);

// OCR upload: simple endpoint stub
router.post('/receipts', upload.single('receipt'), async (req, res) => {
  // If you'd like, wire to ocrController to parse and create expense auto-fill
  res.json({ ok: true, file: req.file });
});

module.exports = router;
