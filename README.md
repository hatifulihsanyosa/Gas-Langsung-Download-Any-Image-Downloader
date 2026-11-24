# 🚀 Gas Langsung Download Bro!



**Anti ribet inspect element.** Klik kanan atau gunakan shortcut **Alt + Klik Kiri** pada gambar mana pun di website (termasuk yang terhalang *overlay*, *CSS background*, hingga *canvas*) untuk langsung mengunduhnya dalam resolusi tertinggi!



## ✨ Fitur Utama



* **X-Ray Image Detector (Tembus Lapisan):** Mampu mendeteksi dan mengekstrak gambar meskipun tertutup elemen transparan (*overlay*), *zoom wrapper*, `background-image` CSS, maupun elemen `<canvas>` (seperti pada *3D viewer* atau *texture configurator*).

* **Auto High-Res Extractor:** Otomatis mencari sumber gambar dengan kualitas/resolusi paling tinggi (memeriksa atribut `data-zoom-image`, `data-large`, `data-original`, `srcset`, dll.) alih-alih mengunduh *thumbnail* buram.

* **Bypass Anti-Klik Kanan:** Membuka blokir pada website yang mematikan fungsi klik kanan (`oncontextmenu`).

* **Super Fast Shortcut (`Alt + Klik Kiri`):** Unduh gambar secepat kilat tanpa perlu membuka menu klik kanan.

* **Smart Auto-Naming:** Menamai file hasil unduhan secara otomatis dan rapi berdasarkan judul halaman/produk agar tidak tercampur.

* **Zero Dialog Box:** Langsung masuk ke folder *Downloads* default tanpa pop-up konfirmasi `Save As` yang memperlambat kerja.

* **Notifikasi Toast Minimalis:** Dilengkapi indikator visual monokrom di pojok kanan bawah untuk memberi tahu status unduhan berhasil atau gagal.



## 🛠️ Cara Instalasi (Mode Developer)



Karena ekstensi ini belum dipublikasikan di Chrome Web Store, Anda dapat memasangnya secara manual di browser berbasis Chromium (**Google Chrome, Microsoft Edge, Brave, Opera, Vivaldi**):



1. **Siapkan File Ekstensi:** Pastikan semua file berikut berada di dalam satu folder yang sama (misalnya folder `gas-langsung-download-bro`):

   * `manifest.json`

   * `background.js`

   * `content.js`



2. **Buka Halaman Ekstensi Browser:**

   * **Chrome:** Ketik `chrome://extensions/` di address bar lalu tekan **Enter**.

   * **Edge:** Ketik `edge://extensions/` di address bar lalu tekan **Enter**.

   * **Brave:** Ketik `brave://extensions/` di address bar lalu tekan **Enter**.



3. **Aktifkan Mode Pengembang (Developer Mode):**

   * Cari tombol **Developer mode** (biasanya di pojok kanan atas atau panel kiri) dan geser hingga aktif (**ON**).



4. **Muat Ekstensi (Load Unpacked):**

   * Klik tombol **Load unpacked** (Muat yang belum dibuka).

   * Pilih folder tempat Anda menyimpan file ekstensi tadi, lalu klik **Select Folder**.



5. **Selesai!** Ekstensi **Gas Langsung Download Bro!** siap digunakan. *(Catatan: Jika Anda sudah membuka tab website sebelum instalasi, silakan refresh/muat ulang halaman tersebut terlebih dahulu).*



## 📖 Cara Pakai



Terdapat dua cara praktis untuk mengunduh gambar menggunakan ekstensi ini:



### Cara 1: Shortcut Kilat (`Alt + Klik Kiri`) ⚡ *(Rekomendasi)*

1. Arahkan kursor mouse tepat ke atas gambar yang ingin diunduh.

2. Tahan tombol **`Alt`** (atau **`Option`** di Mac) pada keyboard, lalu **Klik Kiri** pada gambar tersebut.

3. Muncul notifikasi *"Gas! Lagi download gambar..."* dan file langsung tersimpan di folder Downloads Anda.



### Cara 2: Melalui Menu Klik Kanan 🖱️

1. **Klik Kanan** tepat di atas gambar yang diinginkan (walaupun website memblokir klik kanan, menu browser akan tetap dipaksa muncul).

2. Pilih opsi **"Gas Langsung Download Bro!"** pada menu konteks.

3. Gambar akan langsung terunduh secara otomatis.



## 💡 Catatan & Tips



* **Prioritas Area Terluas:** Jika di satu titik koordinat terdapat beberapa tumpukan gambar (misalnya gambar utama produk dan ikon watermark kecil), ekstensi akan otomatis memilih gambar dengan ukuran/area paling luas.

* **Halaman Terproteksi Browser:** Ekstensi tidak dapat berjalan di halaman internal browser (seperti `chrome://settings` atau Chrome Web Store) karena batasan keamanan bawaan browser.

* **Format File:** Mendukung berbagai format web modern seperti `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, hingga konversi otomatis `.png` untuk elemen `<canvas>`.



## 📁 Struktur File



```text

gas-langsung-download-bro/

├── manifest.json      # Konfigurasi utama ekstensi (Manifest V3)

├── background.js      # Service worker untuk menu klik kanan & proses download

├── content.js         # Script deteksi gambar (X-Ray), bypass klik kanan, & shortcut

└── README.md          # Dokumentasi ekstensi

```
