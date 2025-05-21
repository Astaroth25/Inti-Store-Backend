export const corsMiddleware = {
  origin: (origin, callback) => {
    const ALLOWED_ROUTES = ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:4200'];
    if (!origin) return callback(null, true);
    if (ALLOWED_ROUTES.indexOf(origin) === -1) return callback(new Error('Origin Not Allowed'));
    return callback(null, true);
  }
};
