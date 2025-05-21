import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'sjhgsdvhj';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;
  req.sesion = { user: null };
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.sesion.user = data;
  } catch { }
  next();
};
