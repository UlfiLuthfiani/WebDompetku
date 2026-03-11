const AuthService = require('../services/authService');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama, email, dan password wajib diisi' } });
    const result = await AuthService.register({ name, email, password });
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTS);
    res.status(201).json({ success: true, data: { user: result.user, accessToken: result.accessToken } });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email dan password wajib diisi' } });
    const result = await AuthService.login({ email, password });
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTS);
    res.json({ success: true, data: { user: result.user, accessToken: result.accessToken } });
  } catch (err) { next(err); }
};

const refresh = (req, res, next) => {
  try {
    const result = AuthService.refresh(req.cookies?.refreshToken);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTS);
    res.json({ success: true, data: { accessToken: result.accessToken } });
  } catch (err) { next(err); }
};

const logout = (req, res, next) => {
  try {
    AuthService.logout(req.cookies?.refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (err) { next(err); }
};

const me = (req, res) => res.json({ success: true, data: { user: req.user } });

module.exports = { register, login, refresh, logout, me };
