import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["booking", "payment", "review", "general"],
            default: "general",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
    }
);

export const Notification = mongoose.model("Notification", notificationSchema);
