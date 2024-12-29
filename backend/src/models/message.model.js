import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
    },
    image: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    pdf: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    }
}, {
    timestamps: true
});


const Message = mongoose.model("Message", messageSchema);

export default Message;