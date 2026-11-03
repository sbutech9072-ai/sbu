import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes.js';
import { verifySupabaseConnection } from './lib/supabase.js';

dotenv.config();

export const app = express();

// Minimal middleware setup
app.use(cors());

// Custom lightweight JSON body parser to avoid iconv-lite / body-parser stream issues on edge runtime
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') return next();
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    if (data) {
      try {
        req.body = JSON.parse(data);
      } catch {
        return res.status(400).json({
          success: false,
          code: 'INVALID_JSON',
          message: 'Malformed JSON payload',
        });
      }
    } else {
      req.body = {};
    }
    next();
  });
});

// Routes
app.use('/api/v1', authRouter);

// Health check also verifies Supabase configuration/connectivity.
app.get('/api/v1/health', async (_req, res) => {
  const supabaseStatus = await verifySupabaseConnection();

  res.status(supabaseStatus.connected ? 200 : 503).json({
    status: supabaseStatus.connected ? 'ok' : 'not_configured',
    message: 'Backend server is running',
    supabaseConnected: supabaseStatus.connected,
    supabaseMessage: supabaseStatus.message,
  });
});

export default app;
