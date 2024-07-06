import express, { Request, Response, Router } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import pino from 'pino';
import cors from 'cors';
import pinoHttpLogger from 'pino-http';

export const logger = pino({ level: 'trace', transport: { target: 'pino-pretty' } });

const app = express();
import packagejson from './../package.json';

app.use(compression());
app.use(helmet())
app.use(express.json());
app.use(cors({
  origin: "*",
}));

import user from './modules/users';
import auth from './modules/auth';
import activities from './modules/activities'
import { userRouter as userProtectedRoutes } from './modules/users';

import middlewares from './middlewares';

app.use(pinoHttpLogger({ level: 'trace' }));
// app.use(pinoHttpLogger({ transport: { target: 'pino-pretty' }}));

const apiRouter = Router();

apiRouter.use(user);
apiRouter.use(auth);
apiRouter.use(middlewares.authMiddleware, userProtectedRoutes)
apiRouter.use(middlewares.authMiddleware, activities);

const v1Router = Router();
v1Router.use('/v1', apiRouter);

app.get('/v1/index', (req: Request, res: Response) => {
  res.status(200).send({ name: packagejson.name, version: packagejson.version });
})

app.use(v1Router);
app.use(middlewares.errorHandler)

export default app;