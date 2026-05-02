# LuxeDrop - Premium Vehicle Rental Management

LuxeDrop adalah platform penyewaan kendaraan premium (Supercar, Luxury Car, dan Exclusive Two-Wheelers) yang dirancang dengan estetika modern dan alur kerja yang efisien. Proyek ini dibangun menggunakan teknologi mutakhir untuk memberikan pengalaman pengguna yang seamless.

## 🚀 Tech Stack

- **Backend**: [Laravel 11](https://laravel.com/)
- **Frontend**: [React.js](https://reactjs.org/) dengan [Inertia.js](https://inertiajs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps & Location**: [Leaflet.js](https://leafletjs.com/)
- **Distance & Routing API**: [TomTom Routing API](https://developer.tomtom.com/routing-api/documentation/product-information/introduction)
- **Real-time Engine**: [Node.js](https://nodejs.org/) & WebSockets (Live Chat)
- **Database**: MySQL

## ✨ Fitur Utama

- **Premium UI/UX**: Desain dark-mode elegan dengan ambient effects.
- **Dynamic Fleet Management**: Manajemen unit kendaraan (Supercar, Luxury Car, Exclusive Two-Wheelers).
- **Smart Checkout**:
  - Peta interaktif menggunakan Leaflet.js.
  - Perhitungan ongkir/towing dinamis berdasarkan jarak real-time (TomTom API).
  - Validasi durasi sewa maksimal 5 hari.
- **Active Rental Limit**: Pembatasan peminjaman maksimal 2 unit aktif per user.
- **Transaction History**: Rincian riwayat lengkap dari mana ke mana (titik awal ke tujuan) dengan kalkulasi biaya (harga sewa + ongkir).
- **Admin Dashboard**: Manajemen unit, transaksi, dan update status pengiriman secara real-time.
- **Live Chat**: Dukungan komunikasi real-time terintegrasi antara pelanggan dan admin menggunakan WebSocket.

---

## 🛠️ Persyaratan Sistem

- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL

---

## 📥 Instalasi & Setup

Ikuti langkah-langkah berikut untuk menjalankan proyek di lingkungan lokal Anda:

1. **Clone Repository**
   ```bash
   git clone <url-repo-anda>
   cd LuxeDrop
   ```

2. **Install Dependensi**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment**
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan masukkan konfigurasi database serta API Key berikut (Anda bisa langsung copy-paste ke bagian bawah file `.env`):
   
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=luxedrop_db
   DB_USERNAME=root
   DB_PASSWORD=

   # TomTom API Key for Maps & Routing (ditaruh dipaling bawah)
   VITE_TOMTOM_API_KEY="YwmzZeUtIA5kaA5Vz0ky842nQVpWSjdt"
   ```

4. **Setup Aplikasi**
   ```bash
   php artisan key:generate
   php artisan migrate
   php artisan db:seed # Opsional: Untuk data awal
   ```

---

## 🚀 Menjalankan Aplikasi

Anda cukup menjalankan dua terminal secara bersamaan:

**Terminal 1 (Backend Laravel)**:
```bash
php artisan serve
```

**Terminal 2 (Frontend & Chat Service)**:
```bash
npm run dev
```
*(Catatan: Perintah `npm run dev` di atas telah dikonfigurasi untuk menjalankan server Vite dan server WebSocket secara bersamaan menggunakan library `concurrently`)*

Akses aplikasi melalui: `http://127.0.0.1:8000`

---

## 📁 Struktur Penting

- `resources/js/Pages/`: Halaman utama aplikasi (React Components).
- `resources/js/Layouts/`: Layout navigasi dan struktur global.
- `app/Http/Controllers/`: Logika bisnis dan pengolahan data.
- `database/migrations/`: Struktur tabel database.

---

## ⚖️ Aturan Bisnis (Business Rules)

1. **Durasi Sewa**: Maksimal 5 hari per transaksi.
2. **Limit Unit**: Maksimal 2 unit aktif per pengguna (Status selain 'Selesai' atau 'Dikembalikan').
3. **Biaya Towing**: Rp 15.000 / KM (Dihitung otomatis melalui rute tercepat TomTom API).
4. **Alamat Pengiriman**: Harus dipilih melalui marker pada peta interaktif.

&copy; 2026 **LuxeDrop Team**. Semua Hak Dilindungi.
