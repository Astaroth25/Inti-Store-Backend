import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { corsMiddleware } from './Middlewares/cors.js';
import { authenticateToken } from './Middlewares/verifyToken.js';
import { productRouter } from './Routes/productRouter.js';
import { userRouter } from './Routes/userRouter.js';

const app = express();

app.use(cors(corsMiddleware));

app.use(cookieParser());

app.use(authenticateToken);

app.use(express.json());

app.use('/user', userRouter);

app.use('/product', productRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
