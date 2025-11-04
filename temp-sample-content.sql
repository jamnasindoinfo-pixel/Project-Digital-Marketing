-- Insert sample categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Umroh', 'umroh', 'Informasi lengkap seputar ibadah umroh, persiapan, dan panduan perjalanan', '#2563eb'),
('Haji', 'haji', 'Panduan ibadah haji, persyaratan, dan tips jamaah haji Indonesia', '#16a34a'),
('Wisata Domestik', 'wisata-domestik', 'Destinasi wisata terbaik di Indonesia, dari Sabang hingga Merauke', '#dc2626'),
('Tips Travel', 'tips-travel', 'Tips praktis, panduan perjalanan, dan informasi travel penting', '#9333ea'),
('Hotel & Akomodasi', 'hotel-akomodasi', 'Rekomendasi hotel, penginapan, dan akomodasi terbaik', '#ea580c'),
('Kuliner', 'kuliner', 'Kuliner khas daerah dan rekomendasi tempat makan di berbagai kota', '#0891b2'),
('Panduan Visa', 'panduan-visa', 'Informasi lengkap pembuatan visa untuk berbagai negara', '#f59e0b'),
('Asuransi', 'asuransi', 'Asuransi perjalanan dan perlindungan selama traveling', '#ef4444');

-- Insert sample tags
INSERT INTO blog_tags (name, slug) VALUES
('umroh', 'umroh'),
('haji', 'haji'),
('travel', 'travel'),
('tips', 'tips'),
('panduan', 'panduan'),
('visa', 'visa'),
('hotel', 'hotel'),
('maskapai', 'maskapai'),
('asuransi', 'asuransi'),
('promo', 'promo'),
('backpacker', 'backpacker'),
('wisata halal', 'wisata-halal'),
('persiapan', 'persiapan'),
('dokumen', 'dokumen'),
('kesehatan', 'kesehatan');

-- Sample blog posts
-- Post 1: Umroh Guide
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  read_time,
  meta_title,
  meta_description,
  category_id,
  published_at
) VALUES (
  'Panduan Lengkap Persiapan Umroh untuk Pertama Kali',
  'panduan-lengkap-persiapan-umroh-pertama-kali',
  'Simak panduan lengkap persiapan umroh bagi jamaah yang pertama kali berangkat. Mulai dari dokumen, persiapan fisik, hingga tips penting selama di Tanah Suci.',
  '<h2>Persiapan Dokumen</h2>
<p>Sebelum berangkat umroh, pastikan semua dokumen berikut sudah disiapkan:</p>
<ul>
<li><strong>Paspor</strong> yang masih berlaku minimal 8 bulan</li>
<li><strong>Visa umroh</strong> yang sudah terbit</li>
<li><strong>Sertifikat vaksinasi</strong> meningitis dan vaksin COVID-19</li>
<li><strong>Foto</strong> ukuran paspor terbaru (latar belakang putih)</li>
<li><strong>KTP</strong> dan Kartu Keluarga</li>
<li><strong>Buku nikah</strong> (untuk suami/istri)</li>
<li><strong>Akta kelahiran</strong> (untuk anak)</li>
</ul>

<h2>Persiapan Fisik dan Mental</h2>
<p>Ibadah umroh membutuhkan stamina yang baik. Lakukan persiapan:</p>
<ul>
<li>Olahraga rutin 3 bulan sebelum keberangkatan</li>
<li>Latihan jalan kaki 30-45 menit per hari</li>
<li>Persiapan mental dengan belajar manasik umroh</li>
<li>Konsultasi dokter untuk pemeriksaan kesehatan</li>
</ul>

<h2>Packing Essentials</h2>
<p>Bawa barang-barang penting namun ringkas:</p>
<ul>
<li>Pakaian ihram (2 set untuk cadangan)</li>
<li>Obat-obatan pribadi dan vitamin</li>
<li>Perlengkapan shalat (sajadah, mukena, sarung)</li>
<li>Peralatan mandi</li>
<li>Uang saku dalam Riyal Saudi</li>
<li>Power bank dan adapter stop kontak</li>
</ul>

<h2>Tips Selama di Tanah Suci</h2>
<ul>
<li>Jaga kesehatan dengan minum air yang cukup</li>
<li>Ikuti jadwal yang dibuat travel</li>
<li>Jangan terlalu fokus pada ibadah fisik, perhatikan spiritualnya</li>
<li>Bantu jamaah lain yang kesulitan</li>
<li>Simpan barang berharga di hotel</li>
</ul>',
  'published',
  8,
  'Panduan Lengkap Persiapan Umroh 2025',
  'Panduan lengkap persiapan umroh untuk jamaah pertama kali dengan tips praktis dan informasi penting.',
  (SELECT id FROM blog_categories WHERE slug = 'umroh' LIMIT 1),
  '2025-01-04 10:00:00+00'
);

-- Post 2: Travel Tips
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  read_time,
  meta_title,
  meta_description,
  category_id,
  published_at
) VALUES (
  '10 Tips Packing Efisien untuk Traveling Jarak Jauh',
  '10-tips-packing-efisien-traveling-jarak-jauh',
  'Pelajari cara packing yang efisien untuk perjalanan jarak jauh. Hemat tempat di koper dan pastikan semua barang penting terbawa.',
  '<h2>1. Buat Daftar Packing</h2>
<p>Tulis semua barang yang perlu dibawa berdasarkan cuaca, durasi, dan kegiatan selama perjalanan.</p>

<h2>2. Gunakan Teknik Rolling</h2>
<p>Menggulung pakaian menghemat 30% lebih banyak ruang dibandingkan melipat. Pakaian juga lebih tidak kusut.</p>

<h2>3. Gunakan Organizer Koper</h2>
<p>Pisahkan barang berdasarkan kategori: pakaian, toiletries, elektronik, dokumen.</p>

<h2>4. Manfaatkan Ruang Kosong</h2>
<ul>
<li>Isi sepatu dengan kaos kaki atau barang kecil</li>
<li>Gunating saku bagian dalam jaket untuk barang berharga</li>
<li>Manfaatkan ruang di antara barang bawaan</li>
</ul>

<h2>5. Bawa Versi Mini</h2>
<p>Pilih produk ukuran travel untuk toiletries dan elektronik.</p>

<h2>6. Layering System</h2>
<p>Bawa pakaian yang bisa dilapiskan untuk menghadapi perubahan cuaca.</p>

<h2>7. Barang 2-in-1</h2>
<p>Pilih barang yang memiliki fungsi ganda seperti jaket dengan banyak saku.</p>

<h2>8. Batasi Cairan</h2>
<p>Sesuaikan dengan aturan maskapai dan bawa wadah refillable.</p>

<h2>9. Dokumen Penting</h2>
<p>Simpan dokumen di tempat yang mudah diakses dan buat backup digital.</p>

<h2>10. Uji Koper</h2>
<p>Uji koper dengan berjalan sekitar rumah sebelum digunakan traveling.</p>',
  'published',
  6,
  'Tips Packing Efisien untuk Traveling 2025',
  '10 tips packing efisien untuk traveling jarak jauh. Hemat tempat dan packing yang smart.',
  (SELECT id FROM blog_categories WHERE slug = 'tips-travel' LIMIT 1),
  '2025-01-04 14:30:00+00'
);

-- Post 3: Domestic Tourism
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  read_time,
  meta_title,
  meta_description,
  category_id,
  published_at
) VALUES (
  '5 Destinasi Wisata Halal Terbaik di Indonesia',
  '5-destinasi-wisata-halal-terbaik-indonesia',
  'Temukan destinasi wisata halal terbaik di Indonesia yang menyediakan fasilitas lengkap untuk kebutuhan muslim selama liburan.',
  '<h2>1. Aceh - Serambi Mekah</h2>
<p>Aceh menawarkan pesona wisata islami dengan masjid bersejarah dan pantai yang indah. Jangan lewatkan:</p>
<ul>
<li>Masjid Raya Baiturrahman</li>
<li>Pantai Lampuuk</li>
<li>Taman Nasional Gunung Leuser</li>
</ul>

<h2>2. Yogyakarta - Kota Budaya</h2>
<p>Kota ini kaya akan peninggalan islam dan budaya Jawa. Destinasi wajib:</p>
<ul>
<li>Masjid Gedhe Kauman</li>
<li>Kraton Yogyakarta</li>
<li>Pantai Parangtritis</li>
</ul>

<h2>3. Sumatera Barat - Ranah Minang</h2>
<p>Nikmati keindahan alam dan kuliner halal Sumatera Barat:</p>
<ul>
<li>Jam Gadang</li>
<li>Danau Maninjau</li>
<li>Pulau Mandeh</li>
</ul>

<h2>4. Jakarta - Metropolitan Muslim-Friendly</h2>
<p>Ibukota dengan fasilitas muslim lengkap:</p>
<ul>
<li>Masjid Istiqlal</li>
<li>Old Town Jakarta</li>
<li>Ancol Dreamland</li>
</ul>

<h2>5. Lombok - Pulau Seribu Masjid</h2>
<p>Keindahan pantai dan islamic tourism:</p>
<ul>
<li>Pantai Senggigi</li>
<li>Gili Trawangan</li>
<li>Pura Lingsar</li>
</ul>',
  'published',
  7,
  'Destinasi Wisata Halal Terbaik Indonesia 2025',
  '5 destinasi wisata halal terbaik di Indonesia dengan fasilitas lengkap untuk muslim traveler.',
  (SELECT id FROM blog_categories WHERE slug = 'wisata-domestik' LIMIT 1),
  '2025-01-04 09:15:00+00'
);

-- Post 4: Hotel Guide
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  read_time,
  meta_title,
  meta_description,
  category_id,
  published_at
) VALUES (
  'Tips Memilih Hotel yang Sesuai Budget dan Nyaman',
  'tips-memilih-hotel-sesuai-budget-nyaman',
  'Panduan lengkap memilih hotel yang nyaman dengan budget terbatas. Dapatkan tips dan trik untuk hotel berkualitas dengan harga terbaik.',
  '<h2>1. Tentukan Budget</h2>
<p>Tetapkan budget maksimal per malam dan patuhi. Ingat untuk menghitung total biaya menginap.</p>

<h2>2. Lokasi Strategis</h2>
<p>Pertimbangkan:</p>
<ul>
<li>Jarak ke tempat tujuan utama</li>
<li>Akses transportasi umum</li>
<li>Keamanan lingkungan</li>
</ul>

<h2>3. Baca Review dengan Cermat</h2>
<p>Perhatikan review tentang:</p>
<ul>
<li>Kebersihan</li>
<li>Pelayanan staff</li>
<li>Fasilitas yang sesuai iklan</li>
</ul>

<h2>4. Bandingkan Harga</h2>
<p>Gunakan multiple booking platform dan bandingkan harga dengan fasilitas yang sama.</p>

<h2>5. Perhatikan Fasilitas</h2>
<p>Pastikan fasilitas penting tersedia:</p>
<ul>
<li>WiFi gratis</li>
<li>AC</li>
<li>Air panas</li>
<li>Sarapan</li>
</ul>

<h2>6. Cek Kebijakan Pembatalan</h2>
<p>Pilih hotel dengan kebijakan pembatalan yang fleksibel.</p>

<h2>7. Manfaatkan Program Loyalty</h2>
<p>Daftar membership hotel untuk dapatkan diskon dan upgrade.</p>

<h2>8. Hindari Seasonal Peak</h2>
<p>Harga hotel bisa 2-3x lipat lebih mahal saat musim liburan.</p>',
  'published',
  5,
  'Tips Memilih Hotel Sesuai Budget 2025',
  'Tips memilih hotel yang nyaman dengan budget terbatas. Panduan lengkap untuk hotel berkualitas.',
  (SELECT id FROM blog_categories WHERE slug = 'hotel-akomodasi' LIMIT 1),
  '2025-01-03 16:45:00+00'
);

-- Post 5: Visa Guide
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  read_time,
  meta_title,
  meta_description,
  category_id,
  published_at
) VALUES (
  'Panduan Lengkap Pembuatan Visa Schengen untuk WNI',
  'panduan-lengkap-visa-schengen-wni',
  'Simak panduan lengkap pembuatan visa Schengen untuk Warga Negara Indonesia. Persyaratan, prosedur, dan tips agar disetujui.',
  '<h2>Apa itu Visa Schengen?</h2>
<p>Visa Schengen memungkinkan Anda berkunjung ke 26 negara Eropa dengan satu visa.</p>

<h2>Persyaratan Utama</h2>
<ul>
<li><strong>Paspor</strong> dengan masa berlaku minimal 3 bulan</li>
<li><strong>Foto</strong> terbaru dengan spesifikasi EU</li>
<li><strong>Asuransi perjalanan</strong> minimal coverage €30.000</li>
<li><strong>Bukti keuangan</strong> 3 bulan terakhir</li>
<li><strong>Booking tiket pesawat</strong> dan akomodasi</li>
</ul>

<h2>Prosedur Aplikasi</h2>
<ol>
<li>Isi formulir aplikasi online</li>
<li>Siapkan semua dokumen</li>
<li>Buat appointment di VFS Global</li>
<li>Bayar biaya visa</li>
<li>Hadir untuk wawancara dan biometrik</li>
<li>Tunggu proses (15-30 hari)</li>
</ol>

<h2>Tips Agar Disetujui</h2>
<ul>
<li>Siapkan itinerary detail</li>
<li>Bawa bukti ikatan di Indonesia</li>
<li>Kenali tujuan negara yang dituju</li>
<li>Berikan jawaban jujur dan konsisten</li>
<li>Dress dengan rapi saat wawancara</li>
</ul>

<h2>Biaya yang Perlu Disiapkan</h2>
<ul>
<li>Biaya visa: €80-€100</li>
<li>Biaya layanan VFS: Rp 600.000</li>
<li>Asuransi: Rp 500.000-1.000.000</li>
<li>Total: Rp 1.500.000-2.500.000</li>
</ul>',
  'published',
  8,
  'Panduan Visa Schengen WNI 2025',
  'Panduan lengkap pembuatan visa Schengen untuk WNI dengan persyaratan dan tips agar disetujui.',
  (SELECT id FROM blog_categories WHERE slug = 'panduan-visa' LIMIT 1),
  '2025-01-03 11:20:00+00'
);