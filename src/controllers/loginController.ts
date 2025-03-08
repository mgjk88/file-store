import { type RequestHandler } from "express";
import passport from "../passport";

const verifyCredentials = passport.authenticate('local', {
    successRedirect: "/dashboard",
    successMessage: "login successful",
    failureRedirect: "/login",
    failureMessage: "login failed"
});

const getForm: RequestHandler = (req, res, next) => {
    try {
        res.render('login');
    } catch (error) {
        next(error);
    }
}


export default {verifyCredentials, getForm};