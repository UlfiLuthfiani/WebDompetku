require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3001', 'null'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, data: { status: 'OK', app: 'DuitKu API', timestamp: new Date().toISOString() } });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} tidak ditemukan` } });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`💰 DuitKu API running on http://localhost:${PORT}`);
  console.log(`📊 API Base: http://localhost:${PORT}/api/v1`);
});

module.exports = app;
