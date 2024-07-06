import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id?: any
  firstName: string
  lastName: string
  username: string
  password: string
  followers?: any;
  following?: any;
  followersCount?: number;
  followingCount?: number;
  notifications?: any;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }]
}, { 
  timestamps: true 
})

const User = mongoose.model<IUser>('User', userSchema);

export default User