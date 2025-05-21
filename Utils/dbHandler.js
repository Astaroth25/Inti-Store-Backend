import { pool } from '../Connection/pool.js';

export async function withConnection (dbOperation) {
  let connection;
  try {
    connection = await pool.getConnection();
    return await dbOperation(connection);
  } catch (err) {
    console.error('Error en la operación de base de datos: ', err);
  } finally {
    if (connection) connection.release();
  }
}

export async function withTransaction (dbOperation) {
  let connection;
  try {
    connection = await pool.getConnection();
    connection.beginTransaction();
    const result = await dbOperation(connection);
    await connection.commit();
    return result;
  } catch (err) {
    if (connection) {
      await connection.rollback();
      console.error('Error en la operación de base de datos: ', err);
    }
    return { error: 'Could Not Obtain Connection' };
  } finally {
    if (connection) connection.release();
  }
}
