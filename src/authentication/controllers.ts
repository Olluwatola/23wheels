import {Request, Response, NextFunction} from 'express';
import catchAsync from "./../utils/catchAsync";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export default { signup };
