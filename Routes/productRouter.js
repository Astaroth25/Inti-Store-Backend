import { Router } from "express";
import { ProductController } from "../Controllers/productController.js";

export const router = Router();

router.get('/', ProductController.get);

router.get('/:id', ProductController.getById);

router.post('/', ProductController.create);

router.patch('/:id', ProductController.update);

router.delete('/', ProductController.delete);