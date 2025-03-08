import {Router} from 'express';
import controller from '../controllers/signUpController';
const signUpRouter = Router();

signUpRouter.get('/', controller.getForm);
signUpRouter.post('/', controller.validateForm, controller.sendBadReqMsgs, controller.postForm);

export default signUpRouter;