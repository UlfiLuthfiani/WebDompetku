# 💰 DuitKu — Pencatat Keuangan

Aplikasi pencatat keuangan pribadi full-stack dengan REST API + JWT Authentication.

## Cara Jalankan

### Backend
```bash
cd backend
npm install
npm run dev
```
Server jalan di → http://localhost:3000

### Frontend
Buka `frontend/index.html` dengan **Live Server** di VSCode.

### Thunder Client
Import file `thunder-collection.json` ke Thunder Client.

---

## API Endpoints

### Auth — `/api/v1/auth`
| Method | Endpoint    | Deskripsi             |
|--------|-------------|-----------------------|
| POST   | /register   | Daftar akun baru      |
| POST   | /login      | Login                 |
| POST   | /refresh    | Refresh access token  |
| POST   | /logout     | Logout                |
| GET    | /me         | Info user login       |

### Transaksi — `/api/v1/transactions` *(semua butuh JWT)*
| Method | Endpoint          | Deskripsi                    |
|--------|-------------------|------------------------------|
| GET    | /categories       | Daftar kategori              |
| GET    | /summary          | Ringkasan + grafik data      |
| GET    | /                 | Semua transaksi (bisa filter)|
| GET    | /:id              | Detail transaksi             |
| POST   | /                 | Tambah transaksi             |
| PUT    | /:id              | Edit transaksi               |
| DELETE | /:id              | Hapus transaksi              |

### Query params GET /transactions
- `?type=income` atau `?type=expense`
- `?category=Makanan`
- `?month=2026-03`
