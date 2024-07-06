import User, { IUser } from "../../models/user";
import bcrypt from 'bcryptjs'
import { redisClient } from "../../server";
import mongoose, { Types } from "mongoose";
import Post, { IPostQuery } from "../../models/post";

export class UserService {
  constructor () {}

  async createUser(data: IUser) {
    const { username, password, ...rest } = data;
    let user = await User.findOne({ username });
    if (user) {
      throw { errorCode: 400, message: "Username already exists" } 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    user = new User({
      username,
      password: hashedPassword,
      ...rest
    })

    await user.save();

    const userObject = user.toObject()
    const { password: _password, ...userResponse } = userObject;
    return userResponse;
  }

  async followUser({userId, followId }: 
    { userId: string, followId: string}) {

    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      throw { errorCode: 400, message: "User not found" }
    }

    const followObjectId = new mongoose.Types.ObjectId(followId);
    const userObjectId = new mongoose.Types.ObjectId(userId)

    if (!user.following.includes(followObjectId) && !followUser.followers.includes(userObjectId)) {
      user.following.push(followObjectId)
      followUser.followers.push(userObjectId)

      user.followingCount = user.followingCount ? user.followingCount + 1 : 1;
      followUser.followersCount = followUser.followersCount ? followUser.followersCount + 1 : 1;

      await user.save();
      await followUser.save();
    }
    return {message: `Following ${followUser.firstName} successfully`}
  }

  async unfollowUser({userId, unfollowId}: {
    userId: string, unfollowId: string
  }) {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);
    
    if (!user || !unfollowUser) {
      throw { errorCode: 400, message: "User not found"}
    }

    user.following = user.following.filter((id: string) => id !== unfollowId)
    unfollowUser.followers = unfollowUser.followers.filter((id: string) => id !== userId)

    user.followingCount = user.followingCount ? user.followingCount - 1 : 0;
    unfollowUser.followersCount = unfollowUser.followersCount ? unfollowUser.followersCount - 1 : 0;

    await user.save();
    await unfollowUser.save();

    return { message: `Successfully unfollowing ${unfollowUser.firstName}` }
  }

  async getUserPosts(userId: any, limit: number = 10, cursor?: string) {
    let query: IPostQuery = { author: new Types.ObjectId(`${userId}`) }
    if (cursor) {
      query = {...query, _id: { $lt: new Types.ObjectId(`${cursor}`)}}
    }

    const posts = await Post.find({ author: userId })
      .sort({ _id: -1 })
      .limit(limit + 1)

    let nextCursor = null;
    const hasNextPage = posts.length > limit;
    if (hasNextPage) {
      posts.pop();
      nextCursor = posts[posts.length - 1]._id.toString()
    }
    
    return { posts, nextCursor };
  }

  async getUserFeeds(userId: any, limit: number = 10, cursor?: string) {
    const cacheKey = `user-${userId}-following`;
    let followingIds: any = await redisClient.get(cacheKey);

    if (!followingIds) {
      const user = await User.findById(userId).populate('following');
      if (!user) {
        throw { errorCode: 404, message: 'User not found' }
      }

      followingIds = user.following.map((followingUser: IUser) => followingUser._id);
      await redisClient.set(cacheKey, JSON.stringify(followingIds), "EX", 3600 );
    } else {
      followingIds = JSON.parse(followingIds);
    }

    let query: IPostQuery = { author: { $in: followingIds } }
    if (cursor) {
      query = { ...query, _id: { $lt: new mongoose.Types.ObjectId(cursor) } };
    }

    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('author', 'firstName lastName _id');

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    return {
      posts,
      
    };
  }
}