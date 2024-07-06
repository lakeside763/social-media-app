import { Router } from "express";
import { UserController } from "./user.controller";
import { CreateUserValidation } from "./user.validation";
import { GetsByPageValidation, IdValidation } from "../activities/activities.validation";

const router = Router();

const userController = new UserController();

// Create User route
router.post('/users', CreateUserValidation, userController.createUser);

// User protected routes
export const userRouter = Router();
userRouter.get('/user/posts', GetsByPageValidation, userController.getUserPosts);
userRouter.get('/user/feeds', GetsByPageValidation, userController.getUserFeeds);
userRouter.post('/users/:id/follow', IdValidation, userController.followUser);
userRouter.post('/users/:id/unfollow', IdValidation, userController.unfollowUser);

export default router;