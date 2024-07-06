import mongoose, { Document, Schema } from "mongoose"


export interface IPost extends Document {
  _id?: any
  content: string
  likes: any
  likesCount: any
  author: any
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostType {
  content: string
  authorId: string
  authorUsername: string
}

export interface IPostQuery {
  _id?: any
  author?: any
}

const postSchema = new Schema<IPost>({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number
  }
},{
  timestamps: true
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post