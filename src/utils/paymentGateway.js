import { Client, Environment } from 'square';
import { asyncHandler } from './asyncHandler.js';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function from uuid package

// Initialize Square Client
const client = new Client({
  environment: Environment.Sandbox, // Use Sandbox environment
  accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN // Set your Square sandbox access token in environment variables
});

const { paymentsApi } = client;

export const processPayment = async ( amount, paymentMethod) => {
    try {        
        console.log(`Payment API response: started`);

        // Create a payment
        const response = await paymentsApi.createPayment({
            sourceId: paymentMethod, // The payment method nonce from the client
            amountMoney: {
                amount: amount, // Amount in cents
                currency: 'INR'
            },
            idempotencyKey: uuidv4(), // Ensure the request is idempotent
        });
        console.log(`Payment API response: `, response.result);
        console.log(`Payment processed with transaction ID: ${response.result.payment.id}`);

        // Return the Square transaction ID
        console.log("Payment id return hone wala h ");
        return response.result.payment.id;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error('Payment processing failed');
    }
};

    export const processRefund = asyncHandler(async (transactionId) => {
    try {
        // Create a refund
        const response = await paymentsApi.createRefund({
        paymentId: transactionId,
        amountMoney: {
            amount: 0, // Refund full amount
            currency: 'USD',
        },
        idempotencyKey: uuidv4(), // Ensure the request is idempotent
        });

        console.log(`Refund processed for transaction ID: ${transactionId}`);

        // Return true if the refund was successful
        return response.result.refund.status === 'COMPLETED';
    } catch (error) {
        console.error('Error processing refund:', error);
        throw new Error('Refund processing failed');
    }
});
