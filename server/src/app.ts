import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import expertRoutes from './routes/expertRoutes';
import bookingRoutes from './routes/bookingRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

// security headers: X-Frame-Options, CSP, MIME sniffing, etc.
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  })
);

// 100 req/IP/15min — basic DoS protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// 10kb limit — prevents oversized payload attacks
app.use(express.json({ limit: '10kb' }));

// strip $ and . from inputs — blocks NoSQL injection
app.use(mongoSanitize());

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;
