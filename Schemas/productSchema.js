import z from 'zod';

const Product = z.object({
    name: z.string().length(128),
    brand: z.string().length(64),
    price: z.number().nonnegative(),
    description: z.string().length(1024),
    category: z.array(z.enum(['Tecnología', 'Moda', 'Hobby', 'Salud', 'Alimentos'])),
    link: z.string().url(),
    rate: z.number().min(0).max(5).default(0),
    stock: z.number().int(),
});

export function ValidateProduct (product){
    return  Product.safeParse(product);
};

export function ValidatePartialProduct (product){
    return Product.partial().safeParse(product);
}