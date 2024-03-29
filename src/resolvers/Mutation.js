import bcrypt from 'bcryptjs';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }) {
    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async login(parent, args, { prisma }) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user,
      token: generateToken(user.id)
    };
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info);
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const userData = { ...args.data };

    if (typeof args.data.password === 'string') {
      userData.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: userData,
    }, info);

  }
};

export default Mutation;
