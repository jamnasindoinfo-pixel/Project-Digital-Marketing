# Setup Database Supabase untuk Blog System

Ikuti langkah-langkah berikut untuk mengatur database Supabase:

## Langkah 1: Buka Supabase SQL Editor

1. Login ke dashboard Supabase Anda: https://supabase.com/dashboard
2. Pilih project Anda: `pt-jaminan-solusi-bisnis-blog`
3. Klik menu **SQL Editor** di sidebar kiri
4. Klik **New query** untuk membuat query baru

## Langkah 2: Jalankan Script Setup Database (STEP-BY-STEP)

**🚨 PENTING: Jalankan script ini secara berurutan!**

### Step 2A: Buat Tabel Database
1. Copy semua isi dari file `database-setup-step1.sql`
2. Paste ke SQL Editor di Supabase
3. Klik tombol **Run** untuk mengeksekusi script
4. Tunggu hingga muncul pesan "Step 1 completed: Tables created successfully!"

### Step 2B: Setup RLS dan Policies
1. Buat query baru (klik "New query" lagi)
2. Copy semua isi dari file `database-setup-step2.sql`
3. Paste ke SQL Editor di Supabase
4. Klik tombol **Run** untuk mengeksekusi script
5. Tunggu hingga muncul pesan "Step 2 completed: RLS policies and triggers set up successfully!"

Script ini akan membuat:
- `blog_categories` - untuk kategori blog
- `blog_tags` - untuk tag blog
- `blog_posts` - untuk postingan blog
- `blog_post_tags` - hubungan antara post dan tag
- `blog_images` - untuk gambar post
- Indexes untuk performa
- RLS (Row Level Security) policies
- Triggers untuk auto-update timestamps

## Langkah 3: Verifikasi Tabel Terbuat

Setelah script selesai, verifikasi tabel telah dibuat:

1. Klik menu **Table Editor** di sidebar
2. Anda seharusnya melihat tabel-tabel berikut:
   - `blog_categories`
   - `blog_tags`
   - `blog_posts`
   - `blog_post_tags`
   - `blog_images`

## Langkah 4: Import Sample Content (Opsional)

Setelah tabel terbuat, Anda bisa menjalankan sample content:

1. Buka file `docs/setup/sample-content.sql`
2. Copy dan paste ke SQL Editor
3. Jalankan script untuk mengisi data sample

## Langkah 5: Test Aplikasi

1. Kembali ke aplikasi Anda di `http://localhost:3000`
2. Kunjungi halaman blog: `http://localhost:3000/blog`
3. Anda seharusnya melihat halaman blog tanpa error

## Troubleshooting

### Error: "relation 'blog_images' does not exist"
- Pastikan Anda menjalankan script STEP-BY-STEP
- Jalankan Step 2A terlebih dahulu, baru Step 2B
- Jangan jalankan script lama (database-setup.sql) yang ada error

### Error: "Table not found"
- Pastikan kedua step (2A dan 2B) sudah dijalankan dengan sukses
- Periksa kembali di SQL Editor apakah ada error saat eksekusi

### Error: "Permission denied"
- Pastikan RLS policies sudah diatur dengan benar
- Script setup sudah mengatur policies untuk public read access

### Error: "Connection failed"
- Periksa environment variables di `.env.local`
- Pastikan Supabase URL dan API Key benar

## Konfigurasi Environment yang Benar

Pastikan file `.env.local` Anda berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mdcauthnpxdnqkhvnnqd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY2F1dGhucHhkbnFraHZubnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDg5NTksImV4cCI6MjA3NzgyNDk1OX0.ihDj1LaFs6rRB9EV-32LOtJYx0GTBNcDixkJiA3mGHw
JWT_SECRET=Berhasil_123
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY2F1dGhucHhkbnFraHZubnFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI0ODk1OSwiZXhwIjoyMDc3ODI0OTU5fQ.PujXAdQ1bKmQPxkh505aGB3zJSMeYYHn-edPNS3Gmfg
```

## Test API Endpoint

Setelah setup selesai, test API endpoint:

```bash
curl http://localhost:3000/api/blog/posts
```

Harus mengembalikan response JSON tanpa error.