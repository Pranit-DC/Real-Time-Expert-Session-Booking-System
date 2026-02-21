import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

// strip keys starting with $ or containing . — blocks NoSQL injection
// written inline because express-mongo-sanitize reassigns req.query,
// which Express 5 made a read-only getter
function stripBadKeys(obj: Record<string, unknown>): void {
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      stripBadKeys(obj[key] as Record<string, unknown>);
    }
  }
}
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') stripBadKeys(req.body as Record<string, unknown>);
  if (req.query && typeof req.query === 'object') stripBadKeys(req.query as Record<string, unknown>);
  next();
});

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
