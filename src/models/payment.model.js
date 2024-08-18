import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String, // e.g., "credit card", "debit card", "paypal"
            required: true,
        },
        paymentStatus: {
            type: String, // e.g., "completed", "pending", "failed"
            required: true,
            default: "pending",
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        refundStatus: {
            type: String, // e.g., "not requested", "requested", "completed"
            default: "not requested",
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);
