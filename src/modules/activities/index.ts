import { Router } from "express";
import { ActivitiesController } from "./activities.controller";
import { CreateCommentValidation, CreatePostValidation, GetsByPageValidation, IdValidation } from "./activities.validation";

const router = Router();

const activitiesController = new ActivitiesController();

// Notification routes
router.get('/notifications', activitiesController.getNotifications)
router.get('/notifications/:id/read', activitiesController.updateNotification)

// Post routes
router.post('/posts', CreatePostValidation, activitiesController.createPost);
router.post('/posts/:id/comment', CreateCommentValidation, activitiesController.createPostComment);
router.post('/posts/:id/like', IdValidation, activitiesController.likePost);


export default router;