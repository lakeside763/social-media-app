import mongoose from "mongoose"

export interface ILike {
  user: any
  post: any
  createdAt: Date
  updatedAt: Date
}

export interface CreateLikeType {
  userId: string
  postId: string
}

const likeSchema = new mongoose.Schema<ILike>({
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
}, {
  timestamps: true
});

const Like = mongoose.model<ILike>('Like', likeSchema);

export default Like