import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        startDate : {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "canceled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

export const Booking = mongoose.model("Booking", BookingSchema);