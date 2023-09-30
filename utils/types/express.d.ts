import { Response } from "express";

declare global {
  namespace Express {
    interface Response {
      apiSuccess: (data: any, message?: string, statusCode?: number) => void;
      apiError: (
        message: string = "Interval Server Error",
        statusCode?: number
      ) => void;
    }
  }
}

export interface StandardResponse extends Response {}
