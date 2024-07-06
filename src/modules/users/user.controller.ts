import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service"
import { IUser } from "../../models/user";
import { AuthenticateRequest } from "../../middlewares/auth";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: IUser = req.body;
      const data = await this.userService.createUser(user);
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  followUser = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const followId = req.params.id
      const data = await this.userService.followUser({ userId, followId });
      return res.status(200).json(data);
    } catch (err) {
      return next(err)
    }
  }

  unfollowUser = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const unfollowId = req.params.id
      const data = await this.userService.unfollowUser({ userId, unfollowId });
      return res.status(200).json(data);
    } catch (err) {
      return next(err)
    }
  }

  getUserPosts = async(req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const { limit, cursor } = req.query;
      const data = await this.userService.getUserPosts(userId, Number(limit), cursor as string)
      return res.status(200).json(data)
    } catch (err) {
      return next(err)
    }
  }

  getUserFeeds = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const { limit, cursor } = req.query;
      const data = await this.userService.getUserFeeds(userId, Number(limit), cursor as string)
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
}