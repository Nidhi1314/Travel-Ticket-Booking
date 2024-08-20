import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        },
        transactionId: {
            type: String,
            required: true // Ensure this is marked as required
        }
    },
    {
        timestamps: true
    }
);

export const Payment = mongoose.model("Payment", PaymentSchema);
