import { Request, Response, NextFunction } from "express";
import catchAsync from "./utils/catchAsync";
import AppError from "./utils/appError";

const notFound = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  }
);

export default { notFound };
