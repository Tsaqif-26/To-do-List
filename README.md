# Proyek Evaluasi Bulan ke-2

Ini adalah proyek kecil yang dibuat untuk evaluasi bulan kedua. Aplikasi ini adalah aplikasi Todo List sederhana yang juga menampilkan kutipan inspirasional secara acak.

## Fitur-fitur

*   Menambahkan tugas baru
*   Menandai tugas sebagai selesai
*   Menghapus tugas
*   Menampilkan kutipan acak dari API

## Cara Menjalankan Proyek

1.  Clone repositori ini.
2.  Buka file `index.html` di browser favoritmu.

## Teknologi yang Digunakan

*   HTML
*   CSS
*   JavaScript

## Struktur Folder

EVALUASI_BULAN_2_/
├─ index.html          # halaman utama untuk tambah todo
├─ assets/
│  ├─ css/
│  │  └─ styles.css    # styling dasar
├─ src/
│  ├─ main.js          # entry point
│  ├─ api/
│  │  └─ quoteApi.js   # modul ambil data dari Quotable API
│  ├─ components/
│  │  └─ TodoManager.js # logic todo (tambah, hapus, selesai)
│  ├─ utils/
│  │  └─ storage.js    # modul simpan & ambil data localStorage
└─ README.md

## Catatan Tantangan & Solusi

-Tantangan: Data API kadang gagal di-fetch (misalnya jaringan lemot atau error dari server).
-Solusi: Tambahin fallback quote default (misalnya dari Dalai Lama).

-Tantangan: Menyimpan data agar tidak hilang saat reload.
-Solusi: Pakai localStorage buat simpan semua tugas.

-Tantangan: Bikin kode tetap rapi walaupun sederhana.
-Solusi: Pisahkan file jadi modul kecil (api.js, storage.js, dll.) biar gampang dibaca & dirawat.


## Ide Pengembangan

-Dark mode (disimpan ke sessionStorage)

-Progress bar persentase tugas selesai

-Tambah kategori tugas (misalnya sekolah, rumah, kerja)

## Link

-Canva: https://www.canva.com/design/DAG0WbbDo-k/-pEmdcI6AQWxbaiKJ8cY2g/edit?utm_content=DAG0WbbDo-k&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

-Video: https://youtu.be/qpQx0djK894

-Vercel: https://to-do-list-iota-beryl-18.vercel.app/ 

-GitHub: https://github.com/Tsaqif-26/To-do-List 
