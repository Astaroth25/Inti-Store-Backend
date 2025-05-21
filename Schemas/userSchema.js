import z from 'zod';

const User = z.object({
  username: z.string().max(32),
  fname: z.string().max(128),
  lname: z.string().max(128),
  email: z.string().email(),
  role: z.enum(['Buyer', 'Seller', 'Admin']).default('Buyer'),
  password: z.string().max(20)
});

export function ValidateUser (user) {
  return User.safeParse(user);
}

export function ValidatePartialUser (user) {
  return User.partial().safeParse(user);
}
