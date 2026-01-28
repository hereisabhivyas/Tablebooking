import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import restaurantsRouter from './routes/restaurants.js';
import tablesRouter from './routes/tables.js';
import menuItemsRouter from './routes/menuItems.js';
import categoriesRouter from './routes/categories.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import imagesRouter from './routes/images.js';
import uploadRouter from './routes/upload.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Accept requests from localhost on any common dev port
app.use(helmet());
app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests from localhost on ports 8000-8100 and no origin (like Postman, curl)
    if (!origin || /^http:\/\/localhost:[0-9]+$/.test(origin) || /^http:\/\/192\.168\.[0-9.]+:[0-9]+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    mongoState: mongoose.connection.readyState, // 0=disconnected,1=connected,2=connecting,3=disconnecting
  });
});

app.use('/restaurants', restaurantsRouter);
app.use('/tables', tablesRouter);
app.use('/menu-items', menuItemsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);
app.use('/images', imagesRouter);
app.use('/upload', uploadRouter);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

async function start() {
  try {
    const uri = process.env.MONGO_URI || '';
    await connectDB(uri);
    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
