import mongoose, { Types } from "mongoose";
import Post, { CreatePostType, IPost, IPostQuery } from "../../models/post"
import Comment, { CreateCommentType } from "../../models/comment";
import Like, { CreateLikeType } from "../../models/like";
import followersNotificationQueue from "../../queues/notification.queue";
import Notification from "../../models/notification";

export class ActivititesService {
  constructor () {}

  async createPost(data: CreatePostType) {
    const { authorId, authorUsername, content } = data;
    const post = new Post({
      author: authorId,
      content,
    });

    await post.save();

    // Send notification to the followers
    followersNotificationQueue.add({
      postId: post._id,
      authorId: authorId,
      type: 'post',
      message: `${authorUsername} created a new post`
    })

    return post
  }

  async createPostComment(data: CreateCommentType) {
    const post = await Post.findById(data.postId).populate("author", '_id username') as IPost;
    if (!post) {
      throw { errorCode: 400, message: "Invalid post Id" };
    }
  
    if (!post.author || !post.author.username) {
      throw { errorCode: 400, message: "Post author not found or invalid" };
    }

    const comment = await Comment.create({
      content: data.content,
      post: data.postId,
      author: data.userId
    });
  
    // send notification to the followers
    followersNotificationQueue.add({
      postId: post._id,
      authorId: post.author._id,
      type: 'comment',
      message: `${data.username} commented on ${post.author.username}'s post`,
    })

    // Create notification for the post owner
    await Notification.create({
      user: post.author._id,
      type: 'comment',
      referenceId: post._id,
      message: `${data.username} commented on your post`,
    })

    return comment;
  }

  async likePost(data: CreateLikeType) {
    const post = await Post.findById(data.postId);
    if (!post) {
      throw { errorCode: 400, message: 'Invalid post id '}
    }

    post.likesCount = post.likesCount ? post.likesCount + 1 : 1;

    await Like.create({
      user: data.userId,
      post: data.postId
    });

    await post.save();

    return { message: 'Post liked successfully' } 
  }

  async getNotifications(userId: string) {
    const notifications = await Notification
      .find({ user: userId })
      .sort({ createdAt: -1})
      .limit(20);

    return notifications;
  }

  async updateNotification(id: string) {
    await Notification.findByIdAndUpdate(id, { read: true });
    return { message: "Notification marked as read" }
  }
}