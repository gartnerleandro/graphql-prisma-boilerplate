import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }) {
      const userId = getUserId(request, false);
  
      if (userId && parent.id === userId) {
        return parent.email;
      }
  
      return null;
    }
  },
  password() {
    return null;
  }
};

export default User;
