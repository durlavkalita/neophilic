import { Request, Response, NextFunction } from "express";

export const responseFormatter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.json;

  res.json = (data: any) => {
    // if (data && typeof data === "object" && !Array.isArray(data)) {
    //   // If data is already an object, return it as is
    //   return originalSend.call(res, data);
    // }
    return originalSend.call(res, { result: data });
  };

  next();
};
