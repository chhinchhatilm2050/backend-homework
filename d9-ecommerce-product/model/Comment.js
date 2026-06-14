import mongoose  from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 1000,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'spam'],
    default: 'pending'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    expires: 60 * 60 * 24 * 90
  }
}, {
  timestamps: true
});

commentSchema.pre('save', async function () {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true,
    this.editedAt = new Date();
  }
});

commentSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();

  if (update.$set?.content) {
    const original = await this.model.findOne(this.getFilter());
    if (original.content !== update.$set.content) {
      update.$set.isEdited = true;   
    } else {
      update.$set.isEdited = false; 
    }
  }
});

commentSchema.methods.toggleLike = async function(userId) {
  const isLiked = this.likes.includes(userId);
  if (isLiked) {
    this.likes = this.likes.filter(
      id => id.toString() !== userId.toString()
    );
  } else {
    this.likes.push(userId);
  }
  await this.save();
};

commentSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });

const CommentModel = mongoose.model('Comment', commentSchema);
export default CommentModel;