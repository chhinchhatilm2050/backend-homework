import mongoose from "mongoose";
const postSchema = new mongoose.Schema({

}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});

const PostModel = mongoose.model("Post", postSchema);
export {PostModel};