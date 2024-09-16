import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

export async function checkLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.session.userId;
  if (!userId) {
    return next();
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next();
    }
    req.userId = userId;
    req.userName = user.name;
    return next();
  } catch (e: any) {
    console.log(e.message);
    return res.status(500).send("Internal server error");
  }
}
