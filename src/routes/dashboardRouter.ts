import { Router } from "express";
import controller from "../controllers/dashboardController";
const router = Router();
router.use(controller.authUser);

router.get('/', controller.getDash);
router.get('/folders/:id', controller.readFolder);
router.get('/folders/:id/upload', controller.getFolderUpload);
router.post('/folders/:id/upload', controller.postUpload, controller.postFolderUpload); //TODO: add validation
router.post('/folders/:id/delete', controller.deleteFolder);

router.get('/files/:id', controller.getFile);
router.get('/files/:id/download', controller.downloadFile);
router.post('/files/:id/delete', controller.deleteFile);


router.get('/new-folder', controller.getNewFolder);
router.post('/new-folder', controller.createFolder); //TODO: add validation

router.get('/upload', controller.getUpload);
router.post('/upload',controller.postUpload, controller.postDashUpload);

router.post('/logout', controller.logout);

router.use(controller.handleError);

export default router;