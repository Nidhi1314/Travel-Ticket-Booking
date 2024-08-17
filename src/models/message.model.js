import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema( 
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: true
    }
)

export const Message = mongoose.model("Message", messageSchema);