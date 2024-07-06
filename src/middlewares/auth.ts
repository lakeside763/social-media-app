import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { redisClient } from "../server";
import { error } from 'console';
import { logger } from "../app";

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthenticateRequest extends Request {
  user?: any;
}

const authMiddleware = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw { errorCode: 401, message: "No token provided" }
    }

    const parts: string[] = authHeader.split(' ');
    if (!parts || parts[0] !== 'Bearer' || !parts[1]) {
      return res.status(401).json({ message: 'No token provided'})
    }

    const token = parts[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // verify the token
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.uid;

    const user = await redisClient.get(userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized user'})
    }

    req.user = (JSON.parse(user)).user;

    next()
  } catch (err) {
    logger.error('Authentication error', err)
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default authMiddleware;