import { Router } from "express";
import controller from "../controllers/dashboardController";
const dashboardRouter = Router();

dashboardRouter.get('/', controller.getDash);
dashboardRouter.get('/upload', controller.getUpload);
dashboardRouter.post('/upload', controller.postUpload);
dashboardRouter.post('/logout', controller.logout);

export default dashboardRouter;