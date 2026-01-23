import { Router } from 'express';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config/envs';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();

    const controller = new CategoryController();

    // Definir las rutas
    router.get('/', controller.getCategories);
    router.post('/', [AuthMiddleware.validateJwt],controller.createCategory);



    return router;
  }


}

