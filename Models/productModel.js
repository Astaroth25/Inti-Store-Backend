import mysql2 from 'mysql2/promise';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'astaroth_25',
    password: 'Astaroth.09962',
    database: 'intiStoredb'
};

const connection = await mysql2.createConnection(config);

export class ProductModel {

    static async get({ category }) {
        if (category) {
            const [result] = await connection.query(`
                SELECT p.* FROM products p
                JOIN product_category pc ON p.id = pc.id_product
                JOIN categories c ON pc.id_category = c.id
                WHERE c.name = '?';`, [category]);
            return result;
        }
        const [result] = await connection.query(`
            SELECT * FROM products;`);
        return { message: 'Category Not Found', result };
    }

    static async getById({ id }) {
        const [result] = await connection.query(`
            SELECT * FROM products WHERE id = UUID_TO_BIN(?);`, [id]);
        if (!result) return { message: 'Product Not Found' };
        return result;
    }

    static async create({ input, userId }) {
        const { name, brand, price, description, category, link, rate, stock } = input;
        const id = crypto.randomUUID();
        await connection.query(`
        INSERT INTO products (id, id_user, name, brand, price, description, link, rate, stock)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?)`, [id, userId, name, brand, price, description, link, rate, stock]);

        //Consultar la categoría o crear
        let existCat = await connection.query(`
            SELECT id FROM categories WHERE LOWER(name) = LOWER(?)`, [category]);
        if (existCat.length === 0) {
            await connection.query(`
                INSERT INTO categories (name) VALUES (?)`, [category]);
            existCat = await connection.query(`SELECT id FROM categories WHERE LOWER(name) = LOWER(?)`, [category])
        }

        //Hacer la relación
        await connection.query(`
            INSERT INTO product_category (id_product, id_category) VALUES
            (UUID_TO_BIN(?)), ?)`, [id, existCat[0].id]);

        return {message: 'Product created'}
    }

    static async update({ id, input }) { }

    static async delete({ id }) { }
}