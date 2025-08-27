import passport from "passport";

import dotenv from "dotenv";
dotenv.config();

import pkg, { StrategyOptionsWithoutRequest, VerifiedCallback } from "passport-jwt";
const { Strategy, ExtractJwt } = pkg;
const JwtStrategy = Strategy;
const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
const secretOrKey = process.env.JWT_SECRET_KEY as string;
const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest,
  secretOrKey,
};

import { getUserById } from "../db/userQueries.js";

function configPassport() {
  passport.use(
    new JwtStrategy(opts, async (payload: any, done: VerifiedCallback) => {
      try {
        const user = await getUserById(payload.sub);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
}

export { configPassport };
