import { Router } from 'express';
import { userController } from '../Controllers/userController.js';

export const userRouter = Router();

// Consultar el usuario
userRouter.get('/:id', userController.get);

// Crear un usuario
userRouter.post('/register', userController.create);

// Actualizar un usuario
userRouter.patch('/:id', userController.update);

// Borrar un usuario
userRouter.delete('/:id', userController.delete);

// Iniciar sesión
userRouter.post('/login', userController.login);

// Cerrar sesión
userRouter.post('/logout', userController.logout);
