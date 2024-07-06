import mongoose from "mongoose"

export interface IComment {
  _id: any
  content: string
  author: any
  post: any
}

export interface CreateCommentType {
  postId: any
  content: string
  userId: any
  username?: string
}

const commentSchema = new mongoose.Schema<IComment>({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  }
}, {
  timestamps: true
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;