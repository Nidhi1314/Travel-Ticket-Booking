import { Client, Environment } from 'square';
import { asyncHandler } from './asyncHandler.js';
import { v4 as uuidv4 } from 'uuid';  

const client = new Client({
    environment: Environment.Sandbox, 
    accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN 
});

const { paymentsApi } = client;

export const processPayment = async ( amount, paymentMethod) => {
    try {        

        const response = await paymentsApi.createPayment({
            sourceId: paymentMethod, 
            amountMoney: {
                amount: amount, 
                currency: 'USD'
            },
            idempotencyKey: uuidv4(), 
        });
        // console.log(`Payment processed with transaction ID: ${response.result.payment.id}`);
        return response.result.payment.id;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error('Payment processing failed');
    }
};

    export const processRefund = asyncHandler(async (transactionId) => {
    try {
        const response = await paymentsApi.createRefund({
        paymentId: transactionId,
        amountMoney: {
            amount: 0, // Refund full amount
            currency: 'USD',
        },
        idempotencyKey: uuidv4(), 
        });

        console.log(`Refund processed for transaction ID: ${transactionId}`);

        return response.result.refund.status === 'COMPLETED';
    } catch (error) {
        console.error('Error processing refund:', error);
        throw new Error('Refund processing failed');
    }
});
