# WebSampahku 🌍♻️

WebSampahku adalah sebuah aplikasi **Sistem Informasi Geografis (WebGIS)** berbasis web untuk memanajemen pelaporan, pengangkutan, dan pembayaran iuran sampah di ruang lingkup masyarakat.

Aplikasi ini mengadopsi tiga tipe pengguna (*role*) untuk memfasilitasi siklus pengelolaan sampah secara menyeluruh:
1. **Warga**: Dapat mendaftarkan lokasi rumah, melaporkan sampah yang perlu diangkut (menunggu penjemputan), dan membayar iuran bulanan.
2. **Transporter (Pengangkut)**: Dapat melihat titik-titik lokasi laporan sampah dari para warga di peta dan mengubah statusnya menjadi "Selesai" jika sudah diangkut.
3. **Admin**: Mengawasi seluruh siklus, memverifikasi pembayaran iuran warga, dan mengelola manajemen seluruh pengguna (membuat, mengubah, menghapus akun).

## 🚀 Teknologi yang Digunakan

- **Frontend Framework**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Peta Digital (WebGIS)**: [Leaflet.js](https://leafletjs.com/) via `react-leaflet`
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth)
- **Styling**: Vanilla CSS (dengan dukungan *Light Mode* dan *Dark Mode*)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: React Router DOM

## 💻 Panduan Instalasi Lokal

1. **Persiapan (Clone & Install)**
   Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda. Buka terminal dan jalankan:
   ```bash
   # Masuk ke folder proyek
   cd websampahku
   
   # Instal semua dependensi
   npm install
   ```

2. **Menjalankan Server (Development)**
   Setelah semua dependensi terinstal, jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui browser pada `http://localhost:5173`.

## 🗄️ Struktur Database (Supabase)

Proyek ini sangat bergantung pada fitur *Backend-as-a-Service* dari Supabase. Terdapat beberapa skema tabel, *Trigger*, dan *Functions (RPC)* yang wajib dikonfigurasi di editor SQL Supabase:
- `warga`: Menyimpan data penduduk beserta lokasi titik jemput (PostGIS Point).
- `sampah`: Menyimpan log pelaporan dari warga (terkait status, berat, dan jenis).
- `pembayaran`: Menyimpan log pembayaran iuran bulanan warga.
- `rpc_user_management.sql`: Kumpulan *stored procedure* untuk memberikan otoritas CRUD penuh kepada *Admin* agar dapat memanipulasi entitas `auth.users` dengan aman.

*(Jika Anda menduplikasi repo ini ke proyek Supabase baru, pastikan untuk mengeksekusi ulang seluruh skrip `.sql` yang ada di dalam *root* repositori ini pada Supabase SQL Editor Anda).*

## 🌐 Panduan Deployment

Aplikasi ini sudah dikonfigurasi (*melalui berkas `vercel.json`*) agar mendukung *client-side routing* dan siap diunggah ke [Vercel](https://vercel.com).

### Opsi 1: Menggunakan Vercel Dashboard & GitHub
1. Buat repositori baru di GitHub dan lakukan `git push` semua kode ini.
2. Buka dasbor Vercel dan klik **Add New -> Project**.
3. Hubungkan repositori GitHub Anda.
4. Vercel akan otomatis mendeteksi konfigurasi **Vite**.
5. Klik **Deploy**. Selesai!

### Opsi 2: Menggunakan Vercel CLI
Jalankan perintah ini di terminal Anda secara langsung:
```bash
# Instal Vercel CLI (hanya jika belum punya)
npm i -g vercel

# Unggah aplikasi
vercel
```
Tinggal ikuti instruksi terminal, dan aplikasi akan langsung online!

---
*Didesain dan dikembangkan sebagai bagian dari solusi teknologi penanganan tata kelola kebersihan lingkungan sekitar.*
