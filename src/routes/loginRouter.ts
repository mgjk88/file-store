import {Router} from 'express';
import loginController from '../controllers/loginController';
const loginRouter = Router();

loginRouter.get('/', loginController.getForm);
loginRouter.post('/', loginController.verifyCredentials);

export default loginRouter;