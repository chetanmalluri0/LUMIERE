import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './src/server/routes/authRoutes.ts';
import { adminRouter } from './src/server/routes/adminRoutes.ts';
import { publicRouter } from './src/server/routes/publicRoutes.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Express Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    salon: 'LUMIÈRE Beauty Studio',
    tagline: 'Where Beauty Meets Precision.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', publicRouter);

async function startServer() {
  if (!isProduction) {
    // In development, hook Vite middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built static assets from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LUMIÈRE Studio Full-Stack Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
