import { Credentials } from "../../models/auth";
import User from "../../models/user";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { redisClient } from "../../server";

const JWT_SECRET: string = process.env.JWT_SECRET!;

export class AuthService {
  constructor () {}

  async loginUser({username, password}: Credentials) {
    const user = await User.findOne({ username })
    if (!user) {
      throw { errorCode: 400, message: 'Invalid username' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { errorCode: 400, message: "Invalid password" }
    }

    const expiresIn = 3600 * 24 * 14;
    const token = jwt.sign({ uid: user._id, username: user.username }, JWT_SECRET, { expiresIn });

    const userObject = user.toObject();
    const { password: _password, ...userResponse } = userObject;

    redisClient.set(user._id.toString(), JSON.stringify({user: userResponse, token}), 'EX', expiresIn);

    return { user: userResponse, token }
  }

  async logoutUser(userId: string) {
    await redisClient.del(userId);
    return { message: "User logout successfully" }
  }
}