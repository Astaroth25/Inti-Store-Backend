/**
CREATE TABLE users(
id BINARY(16) PRIMARY KEY, 
fname VARCHAR(128) NOT NULL, 
lname VARCHAR(128) NOT NULL,
email VARCHAR(128) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(32) NOT NULL DEFAULT 'Buyer'
);
 */

import z from 'zod';

const User = z.object({
    fname: z.string().max(128),
    lname: z.string().max(128),
    email: z.string().email(),
    password: z.string().max(16),
    role: z.string().enum(['Buyer', 'Seller']).default('Buyer')
});

export function ValidateUser({input}){
    return User.safeParse(input);
}