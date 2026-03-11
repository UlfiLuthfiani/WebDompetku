const transactions = [];
let idCounter = 1;

const CATEGORIES = {
  income: ['Gaji', 'Freelance', 'Bisnis', 'Investasi', 'Hadiah', 'Lainnya'],
  expense: ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Kesehatan', 'Hiburan', 'Pendidikan', 'Lainnya'],
};

const TransactionModel = {
  findAll: (userId) => transactions.filter(t => t.userId === userId),
  findById: (id, userId) => transactions.find(t => t.id === String(id) && t.userId === userId),
  create: (data) => {
    const t = { id: String(idCounter++), ...data, createdAt: new Date().toISOString() };
    transactions.push(t);
    return t;
  },
  update: (id, userId, updates) => {
    const i = transactions.findIndex(t => t.id === String(id) && t.userId === userId);
    if (i === -1) return null;
    transactions[i] = { ...transactions[i], ...updates, updatedAt: new Date().toISOString() };
    return transactions[i];
  },
  delete: (id, userId) => {
    const i = transactions.findIndex(t => t.id === String(id) && t.userId === userId);
    if (i === -1) return false;
    transactions.splice(i, 1);
    return true;
  },
  CATEGORIES,
};

module.exports = TransactionModel;
