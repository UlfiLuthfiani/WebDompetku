const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/userModel');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' });
  return { accessToken, refreshToken };
};

const AuthService = {
  register: async ({ name, email, password }) => {
    if (UserModel.findByEmail(email)) throw { status: 409, message: 'Email sudah terdaftar' };
    const hashed = await bcrypt.hash(password, 12);
    const user = UserModel.create({ id: uuidv4(), name, email, password: hashed, createdAt: new Date().toISOString() });
    const { accessToken, refreshToken } = generateTokens({ userId: user.id, email: user.email, name: user.name });
    UserModel.storeRefreshToken(refreshToken);
    return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
  },
  login: async ({ email, password }) => {
    const user = UserModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) throw { status: 401, message: 'Email atau password salah' };
    const { accessToken, refreshToken } = generateTokens({ userId: user.id, email: user.email, name: user.name });
    UserModel.storeRefreshToken(refreshToken);
    return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
  },
  refresh: (token) => {
    if (!token || !UserModel.hasRefreshToken(token)) throw { status: 401, message: 'Refresh token tidak valid' };
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { accessToken, refreshToken: newRefresh } = generateTokens({ userId: decoded.userId, email: decoded.email, name: decoded.name });
      UserModel.deleteRefreshToken(token);
      UserModel.storeRefreshToken(newRefresh);
      return { accessToken, refreshToken: newRefresh };
    } catch { throw { status: 401, message: 'Refresh token kadaluarsa' }; }
  },
  logout: (token) => { if (token) UserModel.deleteRefreshToken(token); },
};

module.exports = AuthService;
