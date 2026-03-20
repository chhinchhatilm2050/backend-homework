import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: [3, "Name must be at least 5 characters"],
        maxlength: [50, "Name must be at most 200 characters"],
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username in require'],
        minlength: [2, "Username must be at least 5 characters"],
        maxlength: [20, "Usernam must be at most 200 characters"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: [160, 'Bio must be at most 160 characters'],
        default: null
    },
    location: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

userSchema.virtual('followerCount', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'follower',
    count: true
});

userSchema.virtual('followingCount', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'following',
    count: true
});

userSchema.virtual('postCount', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    count: true
});

userSchema.pre('save', async function() {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

const UserModel = mongoose.model("User", userSchema);
export {UserModel};