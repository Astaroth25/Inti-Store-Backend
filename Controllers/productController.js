import { ProductModel } from '../Models/productModel.js';
import { ValidateProduct, ValidatePartialProduct } from '../Schemas/productSchema.js';

export class ProductController {
  static async get (req, res) {
    const { category } = req.query;
    const product = await ProductModel.get({ category });
    return res.json(product);
  }

  static async getById (req, res) {
    const { id } = req.params;
    const product = await ProductModel.getById({ id });
    return res.json(product);
  }

  static async getCategories (req, res) {
    const categories = await ProductModel.getCategories();
    return res.json(categories);
  }

  static async create (req, res) {
    const { user } = req.sesion;
    if (user?.role !== 'Seller') return res.send('Not Authorized');
    const result = ValidateProduct(req.body);
    if (!result.success) return res.status(400).json({ error: 'Algo salió mal.', message: result.error.message });
    const product = await ProductModel.create({ input: result.data });
    return res.json(product);
  }

  static async update (req, res) {
    const { user } = req.sesion;
    if (user?.role !== 'Seller') return res.send('Not Authorized');
    const { id } = req.params;
    const result = ValidatePartialProduct(req.body);
    if (!result.success) return res.status(400).json({ error: 'Algo salió mal.' });
    const product = await ProductModel.update({ id, input: result.data });
    return res.json(product);
  }

  static async delete (req, res) {
    const { user } = req.sesion;
    if (user?.role !== 'Seller') return res.send('Not Authorized');
    const { id } = req.params;
    const product = await ProductModel.delete({ id });
    return res.json(product);
  }
}
