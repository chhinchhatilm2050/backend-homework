import mongoose from "mongoose";
import { AppError } from "../utils/appError.js";
const folowSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Follower is required']
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Following is required']
    }
},{
    timestamps: true,
    id: false,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

folowSchema.index({follower: 1, following: 1}, {unique: true});

folowSchema.pre('save', async function() {
    if(this.follower.equals(this.following)) {
        throw new AppError('Cannot follow yourself', 400);
    }
})

const FollowModel = mongoose.model('Follow', folowSchema);
export {FollowModel};