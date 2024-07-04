import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
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
    required: String
  },
}, { 
  timestamps: true 
})

const User = mongoose.model('User', userSchema);

export default User