import { Request, Response, NextFunction } from "express";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./../config/envConfig";
import bcrypt from "bcryptjs";
import authServices from "./services";

import catchAsync from "./../utils/catchAsync";
import AppError from "../utils/appError";
import { UserForm, User } from "./type";
import userModel from "./model";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      password,
      confirmPassword,
      last_name,
      first_name,
      date_of_birth,
      address,
    } = req.body;

    //check if password==confirmPassword ---d
    if (password !== confirmPassword) {
      return next(
        new AppError(
          "ensure that password and confirm password fields are the same",
          400
        )
      );
    }
    const user: UserForm = {
      first_name,
      last_name,
      email,
      date_of_birth,
      address,
      password,
    };

    const createdUser: User = await userModel.createUser(user);
    const token = authServices.createJWT(createdUser.id);

    res
      .status(200)
      .cookie("jwt_token", token, {
        expires: new Date(Date.now() + parseInt(JWT_EXPIRES_IN as string)),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      })
      .json({
        status: "success",
        message: "account successfully created",
        user: createdUser,
      });
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    if (!userEmail || !userPassword) {
      return next(new AppError("please provide email and password", 400));
    }

    const fetchedUser: any[] = await userModel.getUserByEmail(userEmail);

    if (fetchedUser.length === 0) {
      return next(new AppError("wrong email or password", 401));
    }
    if (
      (await bcrypt.compare(userPassword, fetchedUser[0].password)) === false
    ) {
      return next(new AppError("wrong email or password", 401));
    } else {
      //check if account has not been deleted
      if (fetchedUser[0].is_deleted) {
        return next(
          new AppError(
            "Your account has been deleted. Please contact support for further assistance.",
            403
          )
        );
      }
      //check if account has not been banned
      if (fetchedUser[0].is_suspended) {
        return next(
          new AppError(
            "Your account is currently suspended. Please contact support for further assistance.",
            403
          )
        );
      }

      const token = authServices.createJWT(fetchedUser[0].id);
      res
        .status(200)
        .cookie("jwt_token", token, {
          expires: new Date(Date.now() + parseInt(JWT_EXPIRES_IN as string)),
          httpOnly: true,
          secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        })
        .json({
          status: "success",
          message: "account successfully created",
          user: fetchedUser[0],
        });
    }
  }
);
export default { signup, login };
