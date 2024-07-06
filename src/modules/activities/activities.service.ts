import mongoose, { Types } from "mongoose";
import Post, { CreatePostType, IPost, IPostQuery } from "../../models/post"
import Comment, { CreateCommentType } from "../../models/comment";
import Like, { ILike } from "../../models/like";
import notificationQueue from "../../queues/notification.queue";
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

    // Add notification to the queue
    notificationQueue.add({
      postId: post._id,
      authorId: authorId,
      type: 'post',
      message: `${authorUsername} created a new post`
    })

    return post
  }

  async getPosts(userId: any, limit: number = 10, cursor?: string) {
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
  
    // Prepare the base notification data
    const notificationData = {
      postId: post._id,
      authorId: post.author._id,
      type: 'comment',
    };
  
    const notificationsData = [
      {
        ...notificationData,
        message: `${data.username} commented on your post`,
      },
      {
        ...notificationData,
        message: `${data.username} commented on ${post.author.username}'s post`,
      },
    ];
  
    // Add notifications to the queue
    notificationsData.forEach(notification => {
      notificationQueue.add(notification);
    });
  
    return comment;
  }

  async likePost(data: ILike) {
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