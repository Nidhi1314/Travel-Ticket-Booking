import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
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
        packageImage1: {
            type: String
        },
        packageImage2: {
            type: String
        },
        packageImage3: {
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
        ],
        overview: {
            type: String,
            required: false
        },
        about: {
            type: String,
            required: false
        },
        daywisePlan: [
            {
                day: {
                    type: Number,
                    required: true
                },
                activities: {
                    type: [String],
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export const Package = mongoose.model("Package", packageSchema);
