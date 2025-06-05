import mysql2 from 'mysql2/promise';

const config = {
  host: 'f1na3.h.filess.io',
  port: 61002,
  user: 'IntiStoredb_directgot',
  password: 'NewPassword12345',
  database: 'IntiStoredb_directgot',
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
};

export const pool = mysql2.createPool(config);
