import Queue from "bull";
import Notification from "../models/notification";
import User, { IUser } from '../models/user'
import { redisConfig } from '../config';
import { redisClient } from "../server";
import { logger } from "../app";

const notificationQueue = new Queue('notificationQueue', {
  redis: redisConfig
});

notificationQueue.process(async (job, done) => {
  const { postId, authorId, type, message } = job.data

  const cacheKey = `user-${authorId}-followers`;
  let followerIds: any = await redisClient.get(cacheKey);

  if (!followerIds) {
    const user = await User.findById(authorId).populate('followers');
    if (!user) {
      logger.error("Notification queue: User not found")
    }

    followerIds = user?.followers.map((followUser: IUser) => followUser._id);
    await redisClient.set(cacheKey, JSON.stringify(followerIds), 'EX', 3600);
  } else {
    followerIds = JSON.parse(followerIds);
  }

  const notifications = followerIds.map((userId: string) => ({
    user: userId,
    type,
    referenceId: postId,
    message: message
  }))

  await Notification.insertMany(notifications);
  done();
});

export default notificationQueue;