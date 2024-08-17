import mongoose, {Schema} from "mongoose";

const ReviewSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min:1,
            max: 5,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: "Package"
        }
    },
    {
        timestamp: true
    }
)

export const Review = mongoose.model("Review", ReviewSchema);