import { type RequestHandler } from "express";
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

const getDash: RequestHandler = (req, res, next) => {
    try {
        if(!req.isAuthenticated()) res.status(403).redirect('/');
        else res.render('dashboard', {username: req.user ? req.user.username : 'Unknown'});
    } catch (error) {
        next(error);
    }
} 
const getUpload: RequestHandler = (req, res, next) => {
    try {
        res.render('upload');
    } catch (error) {
        next(error);
    }
}

const postUpload = upload.single('file');

const logout: RequestHandler = (req, res, next) => {
        req.logout((error)=>{
            if(error) return next(error);
            res.redirect('/');
        });
    }
export default {getDash, getUpload, postUpload, logout}