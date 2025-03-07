import "dotenv/config";
import "./passport"
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./prisma/pool";
import passport from "passport";
import express from "express";
import session from "express-session";


const app = express();

const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60, //1 min
    },
  })
);

app.use(passport.session());


