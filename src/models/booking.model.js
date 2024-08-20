import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            required: true
        },
        bookingDate: {
            type: Date,
            default: Date.now
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        numberOfPeople: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "canceled", "confirmed"], // Added "confirmed"
            default: "pending"
        },
        totalPrice: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Booking = mongoose.model("Booking", BookingSchema);
