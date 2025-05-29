import { withConnection, withTransaction } from '../Utils/dbHandler.js';

export class ProductModel {
  static async get ({ category }) {
    return withConnection(async (connection) => {
      if (category) {
        const [result] = await connection.execute(`
                SELECT p.* FROM products p
                JOIN product_category pc ON p.id = pc.id_product
                JOIN categories c ON pc.id_category = c.id
                WHERE c.name = ?;`, [category]);
        return result;
      }
      const [result] = await connection.execute(`
            SELECT * FROM products;`);
      return result;
    });
  }

  static async getById ({ id }) {
    return withConnection(async (connection) => {
      const [result] = await connection.execute(`
            SELECT * FROM products WHERE id = UUID_TO_BIN(?);`, [id]);
      if (result.length <= 0) return { message: 'Product Not Found' };
      return result;
    });
  }

  static async getCategories () {
    return withConnection(async (connection) => {
      const [result] = await connection.execute(`
        SELECT name FROM categories;`);
      return result;
    });
  }

  static async create ({ input }) {
    return withTransaction(async (connection) => {
      const { name, brand, price, description, category, link, rate, stock } = input;
      const id = crypto.randomUUID();
      await connection.execute(`
        INSERT INTO products (id, name, brand, price, description, link, rate, stock)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?)`, [id, name, brand, price, description, link, rate, stock]);

      // Consultar si la categoría existe
      const [existCat] = await connection.execute(`
            SELECT id FROM categories WHERE LOWER(name) = LOWER(?)`, [category]);
      if (existCat.length <= 0) return { message: 'Category Not Allowed' };

      // Hacer la relación
      await connection.execute(`
            INSERT INTO product_category (id_product, id_category) VALUES
            (UUID_TO_BIN(?), ?)`, [id, existCat[0].id]);

      return { message: 'Product created' };
    });
  }

  static async update ({ id, input }) {
    return withTransaction(async (connection) => {
      const [findProduct] = await connection.execute(`
            SELECT id FROM products WHERE id = UUID_TO_BIN(?)`, [id]);
      if (findProduct.length <= 0) return { message: 'Product Not Found' };
      // Preparar los campos dinamicamente para actualizar.
      const fieldsToUpdate = [];
      const valuesToUpdate = [];
      const categoryValue = [];
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          if (key === 'category') {
            categoryValue.push(input[key]);
          } else {
            fieldsToUpdate.push(`${key} = ?`);
            valuesToUpdate.push(input[key]);
          }
        }
      }
      if (fieldsToUpdate.length <= 0 && categoryValue.length <= 0) return { message: 'Not Fields To Update' };
      if (fieldsToUpdate.length > 0) {
        valuesToUpdate.push(id);
        const query = `UPDATE products SET ${fieldsToUpdate.join(', ')} WHERE id = UUID_TO_BIN(?)`;
        // Realizar la actualización del producto
        await connection.execute(query, valuesToUpdate);
      }

      // Preparar la actualización de las categorías
      if (categoryValue.length > 0) {
        const [existingCat] = await connection.execute(`
            SELECT p.id FROM products p 
            JOIN product_category pc ON p.id = pc.id_product 
            JOIN categories c ON pc.id_category = c.id 
            WHERE c.name = ? AND p.id = UUID_TO_BIN(?);`, [categoryValue[0], id]);
        if (existingCat.length <= 0) {
          await connection.execute(`
            DELETE FROM product_category WHERE id_product = UUID_TO_BIN(?)`, [id]);
          await connection.execute(`
            INSERT INTO product_category(id_product, id_category) 
            VALUES (UUID_TO_BIN(?), (SELECT id FROM categories WHERE name = ?))`, [id, categoryValue[0]]);
        }
      }

      return { message: 'Product Updated' };
    });
  }

  static async delete ({ id }) {
    return withTransaction(async (connection) => {
      const [exist] = await connection.execute(`
        SELECT id FROM products WHERE id = UUID_TO_BIN(?)`, [id]);
      if (exist.length <= 0) return { message: 'Product Not Found' };
      await connection.execute(`
            DELETE FROM product_category WHERE id_product = UUID_TO_BIN(?)`, [id]);
      await connection.execute(`
            DELETE FROM products WHERE id = UUID_TO_BIN(?)`, [id]);
      return { message: 'Product Deleted' };
    });
  }
}
