import { Router, Request, Response } from 'express';
import {
  clientRegisterSchema,
  clientLoginSchema,
  ownerLoginSchema,
  updateProfileSchema,
} from '../schemas/auth.schema.js';

export const authRouter = Router();

// Helper response for unconfigured authentication / database
const notConfiguredResponse = (res: Response, message: string) => {
  return res.status(503).json({
    success: false,
    code: 'NOT_CONFIGURED',
    message,
  });
};

// POST /api/v1/auth/client/register
authRouter.post('/auth/client/register', (req: Request, res: Response) => {
  const result = clientRegisterSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      errors: result.error.flatten().fieldErrors,
    });
  }

  return notConfiguredResponse(
    res,
    'Client registration service is not configured. Supabase connection required.'
  );
});

// POST /api/v1/auth/client/login
authRouter.post('/auth/client/login', (req: Request, res: Response) => {
  const result = clientLoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      errors: result.error.flatten().fieldErrors,
    });
  }

  return notConfiguredResponse(
    res,
    'Client authentication service is not configured. Supabase connection required.'
  );
});

// POST /api/v1/auth/owner/login
authRouter.post('/auth/owner/login', (req: Request, res: Response) => {
  const result = ownerLoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      errors: result.error.flatten().fieldErrors,
    });
  }

  return notConfiguredResponse(
    res,
    'Owner authentication service is not configured. Supabase connection required.'
  );
});

// GET /api/v1/client/profile
authRouter.get('/client/profile', (_req: Request, res: Response) => {
  return notConfiguredResponse(
    res,
    'Client profile retrieval is not configured. Database connection required.'
  );
});

// PATCH /api/v1/client/profile
authRouter.patch('/client/profile', (req: Request, res: Response) => {
  const result = updateProfileSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      errors: result.error.flatten().fieldErrors,
    });
  }

  return notConfiguredResponse(
    res,
    'Client profile update is not configured. Database connection required.'
  );
});
