import mongoose from "mongoose"

export interface ILike {
  userId: string
  postId: string
}

const likeSchema = new mongoose.Schema({
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

const Like = mongoose.model('Like', likeSchema);

export default Like