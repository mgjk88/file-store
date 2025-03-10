import { type RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import prisma from "../db/pool";
import bcrypt from "bcryptjs";

const getForm: RequestHandler = (req, res, next) => {
  try {
    res.render("sign-up", { errors: [] });
  } catch (error) {
    next(error);
  }
};

const postForm: RequestHandler = async (req, res, next) => {
  try {
    const pass = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: pass,
        },
      }
    );
    res.redirect("/login");
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      if (error.code === "P2002") {
        res.render("sign-up", {
          errors: { username: "username taken", password: null },
        });
      }
    }
    next(error);
  }
};

const sendBadReqMsgs: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsArray = errors.array();
    res.render("sign-up", {
      errors: {
        username: errorsArray[0],
        password: !errorsArray[1] ? errorsArray[2] : errorsArray[1],
      },
    });
  }
  next();
};

const validateForm = [
  body("username")
    .trim()
    .isLength({
      min: 1,
    })
    .withMessage("Username must be at least 1 character long"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("cnfrmPassword")
    .trim()
    .custom((password, { req }) => {
      return password === req.body.cnfrmPassword;
    })
    .withMessage("Passwords do not match"),
];

export default { getForm, postForm, validateForm, sendBadReqMsgs };
