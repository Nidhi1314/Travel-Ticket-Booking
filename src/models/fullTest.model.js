import mongoose, {Schema} from "mongoose";

const previousTestSchema = new Schema(
    {
        examType: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Question"
            }
        ]
    },
    {
        timestamps: true
    }
)

export const PreviousTest = mongoose.model("PreviousTest", previousTestSchema);