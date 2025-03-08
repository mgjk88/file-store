import { type RequestHandler } from "express";

const getIndex: RequestHandler = (req, res, next) => {
    try {
        res.render('index');
    } catch (error) {
        next(error);
    }
}

export default { getIndex};