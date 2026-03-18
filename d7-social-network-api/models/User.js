import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

const UserModel = mongoose.model("User", userSchema);
export {UserModel};