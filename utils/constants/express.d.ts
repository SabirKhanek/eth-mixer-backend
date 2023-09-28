import { Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      apiSuccess: (data: any, message?: string, statusCode?: number) => void;
      apiError: (message?: string, statusCode?: number) => void;
    }
  }
}
