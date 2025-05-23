import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { userModel } from '../Models/userModel.js';
import { ValidatePartialUser, ValidateUser } from '../Schemas/userSchema.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'sjhgsdvhj';

export class userController {
  static async get (req, res) {
    const { user } = req.sesion;
    if (user?.role !== 'Seller') return res.send('Not Authorized');
    const { id } = req.params;
    const result = await userModel.get({ id });
    return res.json(result);
  }

  static async create (req, res) {
    const result = ValidateUser(req.body);
    if (!result.success) return res.json({ message: 'Inputs Not Allowed' });
    // Hashear la password
    const { password, ...userData } = result.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Realizar la creación
    const user = await userModel.create({ input: userData, password: hashedPassword });
    return res.json(user);
  }

  static async update (req, res) {
    const { user } = req.sesion;
    if (user?.role !== 'Buyer') return res.send('Not Authorized');
    const result = ValidatePartialUser(req.body);
    if (!result.success) return { message: 'Data Not Valid' };
    const { id } = req.params;
    const updateUser = await userModel.update({ id, input: result.data });
    return res.json(updateUser);
  }

  static async delete (req, res) {
    const { user } = req.sesion;
    if (user?.role !== 'Seller') return res.send('Not Authorized');
    const { id } = req.params;
    const result = await userModel.delete({ id });
    return res.json(result);
  }

  // Iniciar sesión
  static async login (req, res) {
    const { username, password } = req.body;
    const result = await userModel.login({ username, password });
    if ('message' in result) return res.json(result);
    const token = jwt.sign(result, JWT_SECRET, {
      expiresIn: '1h'
    });
    return res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    })
      .json({ message: 'Login' });
  }

  // Cerrar sesión
  static async logout (req, res) {
    return res.clearCookie('access_token').send('Logout');
  }
}
