import { NextFunction, Request, Response } from "express";
import { ActivititesService } from "./activities.service";
import { IPost } from "../../models/post";
import { AuthenticateRequest } from "../../middlewares/auth";

export class ActivitiesController {
  private readonly activitiesService: ActivititesService

  constructor() {
    this.activitiesService = new ActivititesService()
  }

  createPost = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const post: IPost = req.body;
      const authorId = req.user._id
      const authorUsername = req.user.username
      const data = await this.activitiesService.createPost({ 
        ...post, authorId, authorUsername 
      })
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }

  createPostComment = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const userId = req.user._id;
      const postId = req.params.id;
      const username = req.user.username;
      const data = await this.activitiesService.createPostComment({ 
        content, userId, username, postId 
      });
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }

  likePost = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const userId = req.user._id;
      const response = await this.activitiesService.likePost({ postId, userId });
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  }

  getNotifications = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const data = await this.activitiesService.getNotifications(userId);
      return res.status(200).json(data);
    } catch (err) {
      return next(err)
    }
  }

  updateNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const response = await this.activitiesService.updateNotification(id);
      return res.status(200).json(response);
    } catch (err) {
      return next(err)
    }
  }
}