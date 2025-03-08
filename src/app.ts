import passport from "./passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db/pool";
import path from "node:path";
import indexRouter from "./routes/indexRouter";
import loginRouter from "./routes/loginRouter";
import signUpRouter from "./routes/signUpRouter";
import dashboardRouter from "./routes/dashboardRouter";
import express from "express";
import session from "express-session";

require("dotenv").config();

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
      maxAge: 1000 * 60 * 5, //5 min
    },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


app.use(passport.session());

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/sign-up", signUpRouter);
app.use("/dashboard", dashboardRouter);
app.listen(process.env.PORT, () => {
  console.log(`running on ${process.env.PORT}`);
})
