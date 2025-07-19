const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// Create payment
router.post('/', paymentsController.addPayment);

// Get all payments
router.get('/', paymentsController.getPayments);

// Get payment stats
router.get('/stats', paymentsController.getStats);

// Get single payment by ID
router.get('/:id', paymentsController.getPaymentById);

module.exports = router;
