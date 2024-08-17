import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const questionSchema = new  Schema(
    {
        subject: {
            type: String,
            required : true
        },
        examType: {
            type: String,
            required : true
        },
        year: {
            type: Number,
            required : true
        },
        chapter: {
            type: String,
            required : true
        },
        topic: {
            type: String,
            required : true
        },
        // description: {
        //     type: String,
        //     required: true
        // },
        content: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            // validate: {
            //     validators: function(arr) {
            //         return arr.length === 4;
            //     },
            //     message: "Options array must contain exactly 4 elements"
            // },
            required: true
        },
        correctOption: {
            type: Number,
            // validate: {
            //     validator: function(value) {
            //         return value >= 0 && value <4;
            //     },
            //     message: "Correct option index must be between 0 and 3"
            // },
            required: true
        },
        difficulty: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
)


questionSchema.plugin(mongooseAggregatePaginate)

export const Question = mongoose.model("Question", questionSchema);