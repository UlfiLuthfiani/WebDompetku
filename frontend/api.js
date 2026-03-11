const BASE = 'http://localhost:3000/api/v1';

const api = {
  _req: async (path, opts = {}) => {
    const token = localStorage.getItem('accessToken');
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    let res = await fetch(BASE + path, { ...opts, headers, credentials: 'include' });

    if (res.status === 401 && path !== '/auth/login') {
      try {
        const r = await fetch(BASE + '/auth/refresh', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
        if (r.ok) {
          const d = await r.json();
          localStorage.setItem('accessToken', d.data.accessToken);
          headers['Authorization'] = `Bearer ${d.data.accessToken}`;
          res = await fetch(BASE + path, { ...opts, headers, credentials: 'include' });
        } else { localStorage.clear(); window.location.href = 'index.html'; return; }
      } catch { localStorage.clear(); window.location.href = 'index.html'; return; }
    }

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw { status: res.status, message: e.error?.message || 'Request gagal' };
    }
    if (res.status === 204) return null;
    const d = await res.json();
    return d.data !== undefined ? d.data : d;
  },

  register:  (name, email, password) => api._req('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login:     (email, password)       => api._req('/auth/login',    { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout:    ()                      => api._req('/auth/logout',   { method: 'POST' }),

  getTransactions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api._req('/transactions' + (q ? '?' + q : ''));
  },
  getSummary:      ()            => api._req('/transactions/summary'),
  getCategories:   ()            => api._req('/transactions/categories'),
  createTx:  (data)              => api._req('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTx:  (id, data)          => api._req(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTx:  (id)                => api._req(`/transactions/${id}`, { method: 'DELETE' }),
};
