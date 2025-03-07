import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import prisma from "./prisma/pool";

passport.use(
    new localStrategy(async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: username,
          },
        });
        if (user === null)
          return done(null, false, { message: "Incorrect Username" });
        const match = await bcrypt.compare(user.password, password);
        if (!match) return done(null, false, { message: "Incorrect Password" });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  
  passport.serializeUser((user, done) => {
    try {
      done(null, user.id);
    } catch (error) {
      done(error);
    }
  });
  
  passport.deserializeUser(async (userId: string, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });