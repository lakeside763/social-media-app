import { Request, Response, NextFunction } from "express";
import { AuthService } from './auth.service';
import { Credentials } from "../../models/auth";
import { AuthenticateRequest } from "../../middlewares/auth";


export class AuthController {
  private readonly authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creds: Credentials = req.body
      const data = await this.authService.loginUser(creds)
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  }

  logoutUser = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id
      const data = await this.authService.logoutUser(userId)
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  }
  
}