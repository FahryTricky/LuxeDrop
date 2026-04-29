# LuxeDrop - Laravel + React.js

Proyek ini dibangun menggunakan **Laravel** sebagai backend dan **React.js** (dengan Inertia.js) sebagai frontend. 

Secara bawaan proyek ini sudah diatur menggunakan React (tidak lagi menggunakan Blade sebagai frontend utama), sehingga Anda dapat membuat komponen UI dengan interaktif dan modern.

## Persyaratan Sistem

Pastikan sistem Anda telah terinstal:
- [PHP](https://www.php.net/) (minimal versi 8.2)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) & NPM

---

## Tata Cara Menjalankan Proyek (Instalasi Pertama Kali)

Bagi Anda yang baru saja melakukan `pull` atau `clone` proyek ini, ikuti langkah-langkah wajib berikut untuk menyiapkan proyek di komputer lokal Anda:

1. **Clone Repository** (lewati jika sudah)
   ```bash
   git clone <url-repo-anda>
   cd LuxeDrop
   ```

2. **Install Dependensi PHP (Backend)**
   Jalankan perintah berikut untuk menginstal seluruh package Laravel yang dibutuhkan:
   ```bash
   composer install
   ```

3. **Install Dependensi Node (Frontend / React)**
   Jalankan perintah berikut untuk menginstal package React, Tailwind CSS, Vite, dll:
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**
   Salin file template `.env` untuk membuat konfigurasi lokal Anda:
   ```bash
   cp .env.example .env
   ```
   *(Catatan untuk Windows: Anda bisa menggunakan perintah `copy .env.example .env` di CMD/Powershell, atau copy-paste file secara manual melalui File Explorer).*

   > **Penting**: Setelah file `.env` dibuat, buka file tersebut dan sesuaikan konfigurasi databasenya untuk menggunakan MySQL seperti contoh di bawah ini (pastikan Anda sudah membuat database kosong bernama `luxedrop_db` di phpMyAdmin/MySQL Anda):

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=luxedrop_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Generate Application Key**
   Buat key enkripsi untuk Laravel:
   ```bash
   php artisan key:generate
   ```

6. **Migrasi Database**
   Buat struktur tabel di database Anda:
   ```bash
   php artisan migrate
   ```

---

## Menjalankan Development Server (Sehari-hari)

Untuk menjalankan aplikasi ini dengan React, Anda **wajib menjalankan dua server secara bersamaan**. Silakan buka **dua terminal terpisah**:

### Terminal 1: Menjalankan Backend (Laravel)
Di terminal pertama, jalankan:
```bash
php artisan serve
```
*Server PHP (Laravel) akan berjalan di `http://127.0.0.1:8000`.*

### Terminal 2: Menjalankan Frontend (Vite + React)
Di terminal kedua, jalankan:
```bash
npm run dev
```
*Perintah ini akan menjalankan Vite untuk mengkompilasi file React/JSX secara realtime (Hot Module Replacement).*

> 🌐 **Akses Web**: Setelah kedua perintah di atas berjalan, Anda bisa membuka browser dan mengakses `http://127.0.0.1:8000` (atau `http://localhost:8000`).

---

## Struktur File Penting (Laravel + React)

- **`routes/web.php`** : Tempat Anda mendefinisikan routing/URL aplikasi.
- **`app/Http/Controllers/`** : Tempat logika backend (Controller). Untuk me-render halaman React dari Controller, gunakan `return inertia('NamaKomponen');`.
- **`resources/js/Pages/`** : Folder tempat Anda membuat halaman-halaman **React (.jsx)**.
- **`resources/js/Components/`** : Folder untuk menyimpan komponen React yang bisa dipakai berulang (reusable).
- **`resources/views/app.blade.php`** : File entry-point HTML utama. Anda jarang perlu mengubah file ini kecuali untuk menambah tag `<head>` global.
