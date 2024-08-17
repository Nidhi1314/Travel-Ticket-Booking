import mongoose, {Schema} from "mongoose";

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
        packageImage: {
            type: String,
            required: true
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