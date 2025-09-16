# Warung App: Aplikasi Manajemen Stok dan Laba

![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=node.js)  
![React](https://img.shields.io/badge/React-18-blue?logo=react)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwind-css)  
![Express](https://img.shields.io/badge/Express.js-4-black?logo=express)  
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-API-green?logo=googlesheets)  


---

Aplikasi web full-stack ini dirancang untuk membantu pedagang warung kelontong mengelola inventaris, mencatat transaksi penjualan, dan memantau laba secara efisien. Dengan menggunakan **Google Sheets** sebagai basis data, aplikasi ini menawarkan solusi yang fleksibel dan mudah diakses.

---

## Fitur Utama

### Backend (API)
- Manajemen Barang: Tambah, lihat, edit, dan hapus data barang (nama, harga beli, harga jual, stok).
- Pencatatan Transaksi: Catat penjualan, otomatis mengurangi stok, dan menghitung laba.
- Laporan Laba: Endpoint untuk laporan laba harian, mingguan, dan bulanan.
- Pencetakan Dokumen: Unduh laporan laba dalam format PDF.

### Frontend (UI)
- Dasbor Interaktif: Tampilan modern dan responsif untuk mengelola semua data.
- Formulir Input: Formulir untuk tambah/edit barang dan mencatat transaksi penjualan.
- Tabel Dinamis: Daftar barang yang diperbarui secara real-time dengan fitur pencarian.
- Visualisasi Data: Grafik batang untuk menampilkan laporan laba.

---

## Tumpukan Teknologi (Tech Stack)
- Frontend: React.js, Tailwind CSS  
- Backend: Node.js, Express.js  
- Database: Google Sheets (via Google Sheets API)  

---

## Prasyarat
Sebelum memulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 16 atau lebih tinggi)  
- npm (sudah termasuk dalam Node.js)  
- Git  

---

## Instalasi dan Pengaturan

### 1. Klon Repositori dan Instal Dependensi
```bash
# Klon repositori
git clone https://github.com/RizqiJagad/warung-apps.git
cd warung-apps

# Pindah ke branch utama
git checkout develop

# Instal dependensi backend
cd backend
npm install

# Instal dependensi frontend
cd ../frontend
npm install
```

### 2. Konfigurasi Google Sheets API
- Buat Google Sheets baru (misalnya Warung App Database) dan tambahkan dua sheet:
    - stok_barang
    - rekap_transaksi
- Di Google Cloud Console, buat Service Account dan unduh file JSON kredensial.
- Berikan akses Editor ke Service Account tersebut pada Google Sheets Anda.
- Salin client_email dan private_key dari file JSON ke file .env di folder backend.

#### Contoh isi .env:
```bash
SHEET_ID=ID_GOOGLE_SHEET_ANDA
CLIENT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"
```
### 3. Menjalankan Aplikasi
```bash
# Terminal 1: Jalankan Backend
cd backend
node --openssl-legacy-provider index.js

# Terminal 2: Jalankan Frontend
cd ../frontend
npm run dev
```
###  Penggunaan API
| Metode | Endpoint           | Deskripsi                                |
| ------ | ------------------ | ---------------------------------------- |
| GET    | `/api/barang`      | Mengambil daftar semua barang.           |
| POST   | `/api/barang`      | Menambah barang baru.                    |
| PUT    | `/api/barang/:id`  | Mengedit data barang.                    |
| DELETE | `/api/barang/:id`  | Menghapus barang.                        |
| POST   | `/api/transaksi`   | Mencatat transaksi penjualan.            |
| GET    | `/api/laba/harian` | Mendapatkan laporan laba harian.         |
| GET    | `/api/laba/pdf`    | Mengunduh laporan laba dalam format PDF. |

### Kontributor
- Dikembangkan oleh Taqiy Rizqi Jagad Samudra
- Email: taqiyrizqijagad@gmail.com
- GitHub: RizqiJagad



