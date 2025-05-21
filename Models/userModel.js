import { pool } from '../Connection/pool.js';
import { withConnection, withTransaction } from '../Utils/dbHandler.js';
import bcrypt from 'bcrypt';

export class userModel {
  static async get ({ id }) {
    return withConnection(async (connection) => {
      connection = await pool.getConnection();
      const [user] = await connection.execute(`
        SELECT * FROM users WHERE id = UUID_TO_BIN(?)`, [id]);
      if (user.length <= 0) return { message: 'User Not Found' };
      return user;
    });
  }

  static async create ({ input, password }) {
    return withTransaction(async (connection) => {
      const { username, fname, lname, email, role } = input;
      const id = crypto.randomUUID();
      await connection.execute(`
        INSERT INTO users (id, username, fname, lname, email, role, password) 
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`, [id, username, fname, lname, email, role, password]);

      const [result] = await connection.execute(`
        SELECT username, id FROM users WHERE id = UUID_TO_BIN(?)`, [id]);
      return result;
    });
  }

  static async update ({ id, input }) {
    return withTransaction(async (connection) => {
      // Comprobar si el usuario existe.
      const [exist] = await connection.execute(`
        SELECT id FROM users WHERE id = UUID_TO_BIN(?)`, [id]);
      if (exist.length <= 0) return { message: 'User Not Found' };
      // Construir el query.
      const fieldToUpdate = [];
      const valuesToUpdate = [];
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          fieldToUpdate.push(`${key} = ?`);
          valuesToUpdate.push(input[key]);
        }
      }
      if (fieldToUpdate.length <= 0) return { message: 'Not Fields To Update' };
      const query = `UPDATE users SET ${fieldToUpdate.join(', ')} WHERE id = UUID_TO_BIN(?)`;
      valuesToUpdate.push(id);
      // Ejecutar la actualización.
      await connection.execute(query, valuesToUpdate);
      return { message: 'User Updated' };
    });
  }

  static async delete ({ id }) {
    return withTransaction(async (connection) => {
      // Comprobar si el id del usuario existe.
      const [exist] = await connection.execute(`
        SELECT id FROM users WHERE id = UUID_TO_BIN(?)`, [id]);
      if (exist.length <= 0) return { message: 'User Not Found' };
      // Si el usuario existe ejecutar el borrado.
      await connection.execute(`
            DELETE FROM users WHERE id = UUID_TO_BIN(?)`, [id]);
      return { message: 'User Deleted' };
    });
  }

  static async login ({ username, password }) {
    return withConnection(async (connection) => {
      const [userExist] = await connection.execute(`
        SELECT BIN_TO_UUID(id) AS id, username, password, role FROM users WHERE username = ?`, [username]);
      if (userExist.length <= 0) return { message: 'User Not Found' };
      const compare = await bcrypt.compare(password, userExist[0].password);
      if (!compare) return { message: 'Incorrect Password' };
      return { id: userExist[0].id, username: userExist[0].username, role: userExist[0].role };
    });
  }
}
