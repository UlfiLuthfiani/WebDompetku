const TransactionModel = require('../models/transactionModel');

const getAll = (req, res) => {
  const { type, category, month } = req.query;
  let data = TransactionModel.findAll(req.user.userId);

  if (type) data = data.filter(t => t.type === type);
  if (category) data = data.filter(t => t.category === category);
  if (month) data = data.filter(t => t.date.startsWith(month)); // format: 2026-03

  // Summary
  const totalIncome = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  res.json({
    success: true,
    data,
    meta: {
      total: data.length,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    }
  });
};

const getOne = (req, res) => {
  const t = TransactionModel.findById(req.params.id, req.user.userId);
  if (!t) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan' } });
  res.json({ success: true, data: t });
};

const create = (req, res) => {
  const { type, amount, category, description, date } = req.body;
  if (!type || !amount || !category || !date)
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Type, amount, category, dan date wajib diisi' } });
  if (!['income', 'expense'].includes(type))
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Type harus income atau expense' } });
  if (isNaN(amount) || Number(amount) <= 0)
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Amount harus angka positif' } });

  const t = TransactionModel.create({
    userId: req.user.userId,
    type,
    amount: Number(amount),
    category,
    description: description || '',
    date,
  });
  res.status(201).json({ success: true, data: t });
};

const update = (req, res) => {
  const { type, amount, category, description, date } = req.body;
  if (type && !['income', 'expense'].includes(type))
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Type harus income atau expense' } });
  const t = TransactionModel.update(req.params.id, req.user.userId, {
    ...(type && { type }),
    ...(amount && { amount: Number(amount) }),
    ...(category && { category }),
    ...(description !== undefined && { description }),
    ...(date && { date }),
  });
  if (!t) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan' } });
  res.json({ success: true, data: t });
};

const remove = (req, res) => {
  const ok = TransactionModel.delete(req.params.id, req.user.userId);
  if (!ok) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan' } });
  res.status(204).send();
};

const getCategories = (req, res) => {
  res.json({ success: true, data: TransactionModel.CATEGORIES });
};

const getSummary = (req, res) => {
  const all = TransactionModel.findAll(req.user.userId);
  // Group by month
  const byMonth = {};
  all.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
    byMonth[month][t.type] += t.amount;
  });
  // Group by category
  const byCategory = {};
  all.forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = { income: 0, expense: 0 };
    byCategory[t.category][t.type] += t.amount;
  });

  const totalIncome = all.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = all.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  res.json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byMonth,
      byCategory,
    }
  });
};

module.exports = { getAll, getOne, create, update, remove, getCategories, getSummary };
