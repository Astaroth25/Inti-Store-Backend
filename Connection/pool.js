import mysql2 from 'mysql2/promise';

const config = {
  host: 'localhost',
  port: 3306,
  user: 'astaroth_25',
  password: 'Astaroth.09962',
  database: 'intiStoredb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const pool = mysql2.createPool(config);
