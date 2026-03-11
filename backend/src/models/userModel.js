const users = [];
const refreshTokens = new Set();

const UserModel = {
  findByEmail: (email) => users.find(u => u.email === email),
  findById: (id) => users.find(u => u.id === id),
  create: (user) => { users.push(user); return user; },
  storeRefreshToken: (token) => refreshTokens.add(token),
  hasRefreshToken: (token) => refreshTokens.has(token),
  deleteRefreshToken: (token) => refreshTokens.delete(token),
};

module.exports = UserModel;
