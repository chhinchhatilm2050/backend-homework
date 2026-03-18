import mongoose from "mongoose";
const folowSchema = new mongoose.Schema({
    
},{
    timestamps: true,
    id: false,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

const FollowModel = mongoose.model('Follow', folowSchema);
export {FollowModel};