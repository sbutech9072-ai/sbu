import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes.js';
import { verifySupabaseConnection } from './lib/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Minimal middleware setup
app.use(cors());
app.use(express.json());

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

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;
