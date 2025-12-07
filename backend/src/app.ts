import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import rateLimit from 'express-rate-limit';
import routes from './routes'
import csurf from '@dr.pogodin/csurf';
import { loadUsers } from './utils/loadUsers';

const limiter = rateLimit({
    windowMs: 1000,
    limit: 30,
    message: 'Too lot of requests',
});

const { PORT = 3000 } = process.env
const app = express()
app.set('trust proxy', 'loopback');
app.use(limiter);
app.use(cookieParser())

const csrfProtection = csurf({ cookie: true  })
app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    if(['172.19.0.1', '127.0.0.1'].includes(clientIp as string)) {
       return next();
    }
    return csrfProtection(req, res, next);
});
// app.use(csrfProtection);

app.use(cors({
    origin: process.env.ORIGIN_ALLOW || 'http://localhost:5173',
}));

// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await loadUsers();
        await app.listen(PORT, () => console.log(`Server is running at: http://localhost:${PORT}`))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
