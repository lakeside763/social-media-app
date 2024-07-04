import * as dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import pino from 'pino';
import cors from 'cors';
import pinoHttpLogger from 'pino-http';


dotenv.config()
export const logger = pino({ level: 'trace', transport: { target: 'pino-pretty' } });

const app = express();
import packagejson from './../package.json';

app.use(compression());
app.use(helmet())
app.use(express.json());
app.use(cors({
  origin: "*",
}));

app.use(pinoHttpLogger({ transport: { target: 'pino-pretty' }}));

app.get('/thco/v1/index', (req: Request, res: Response) => {
  res.status(200).send({ name: packagejson.name, version: packagejson.version });
})


export default app;