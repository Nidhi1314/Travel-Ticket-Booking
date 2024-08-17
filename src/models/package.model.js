import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const packageSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }, 
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String
        },
        images: {
            type: String
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        bookedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "Booking"
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Package = mongoose.model("Package", packageSchema);