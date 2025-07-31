import { model, Schema } from "mongoose";

const postSchema = new Schema({
    text: {
        type: String,
        minlength: 2,
        required: function () {
            return this.images.length === 0;
        }
    },
    images: [{
        secure_url: String,
        public_id: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    cloudfolder: {
        type: String,
        unique: true,
        required: function(){
            return this.images.length ? true : false;
        }
    }
}, { timestamps: true });



const Post = model("Post", postSchema);


export default Post;