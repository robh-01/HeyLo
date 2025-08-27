import passport from "passport";
import { Request, Response, NextFunction } from "express";

// check if valid user is logged in
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message:
          "An error occurred during authentication. Please try again later.",
      });
    }
    if (!user) {
      return res.status(401).json({
        status: "failure",
        message: "Invalid or expired token.",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};
