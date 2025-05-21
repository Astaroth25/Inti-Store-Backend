import { Router } from 'express';
import { ProductController } from '../Controllers/productController.js';

export const productRouter = Router();

// Consultar todos los productos - consultar por categoría
productRouter.get('/all', ProductController.get);

// Consultar producto por id
productRouter.get('/:id', ProductController.getById);

// Crear un producto
productRouter.post('/create', ProductController.create);

// Actualizar un producto
productRouter.patch('/:id', ProductController.update);

// Borrar un producto
productRouter.delete('/:id', ProductController.delete);
