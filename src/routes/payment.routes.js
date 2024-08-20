import express from 'express';
import { createPayment, getPaymentDetails, getUserPayments, refundPayment } from '../controllers/payment.controller.js'; // Import the payment controller functions
import { verifyJWT } from '../middlewares/auth.middleware.js'; // Import the authentication middleware

const router = express.Router();

// Route to create a payment
router.post('/', verifyJWT, createPayment);

// Route to get payment details
router.get('/:paymentId', verifyJWT, getPaymentDetails);

// Route to get all payments for a user
router.get('/users/payments', verifyJWT, getUserPayments);

// Route to refund a payment
router.post('/:paymentId/refund', verifyJWT, refundPayment);

export default router;
