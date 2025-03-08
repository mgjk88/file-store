import {Router} from 'express';
import indexController from '../controllers/indexController';
const idxRouter = Router();

idxRouter.get('/', indexController.getIndex);

export default idxRouter;