import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../src/prisma';

export const userOne = {
  input: {
    name: 'Test',
    email: 'test@example.com',
    password: bcrypt.hashSync('Test1234'),
  },
  user: undefined,
  jwt: undefined,
};

export const userTwo = {
  input: {
    name: 'User 2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('Test1234'),
  },
  user: undefined,
  jwt: undefined,
};

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // Create user two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);
};

export default seedDatabase;
