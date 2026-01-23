import { Router } from 'express';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config/envs';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategorySerice } from '../services/category.service';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();

    const categoryService = new CategorySerice();

    const controller = new CategoryController(categoryService);

    // Definir las rutas
    router.get('/', controller.getCategories);
    router.post('/', [AuthMiddleware.validateJwt],controller.createCategory);



    return router;
  }


}

