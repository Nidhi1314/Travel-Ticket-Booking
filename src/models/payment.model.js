import mongoose, {Schema} from "mongoose";

const paymentSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        }, 
        amount: {
            type: Number,
            required: true
        },
        paymentDate: {
            type: Date,
            default: Date.now()
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending"
        }
    }
)

export const Payment = mongoose.model("Payment", paymentSchema);