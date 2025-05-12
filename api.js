import express from 'express';
import cors from 'cors';
import { router } from './Routes/productRouter.js';

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const ALLOWED_ROUTES = ['http://localhost:8080', 'http://localhost:3000/product', 'http://localhost:3306'];
        if (!origin) return callback(null, true);
        if (ALLOWED_ROUTES.indexOf(origin) === -1) return callback(new Error('Origin Not Allowed'));
        return callback(null, true);
    }
}));

app.use(express.json());

app.use('/product', router);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});