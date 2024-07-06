import { Request, Response, NextFunction, } from "express"
import ev from 'express-validation';
import { logger } from "../app";

type CustomError = {
  errorCode: number;
  message: string;
};

const errorHandler = (err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ev.ValidationError) {
    return res.status(err.statusCode).json(err);
  } else if ("errorCode" in err) {
    const customError = err as CustomError;
    return res.status(customError.errorCode).json({ status: 'error', message: err.message || '' })
  } else {
    logger.error(err);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}

export default errorHandler