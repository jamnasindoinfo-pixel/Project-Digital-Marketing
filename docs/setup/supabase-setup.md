# Supabase Setup Guide

This guide will help you set up Supabase for the blog system.

## Prerequisites
- Supabase account (free tier is sufficient for development)
- Basic understanding of SQL databases

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with your GitHub account
4. Click "New Project"
5. Select your organization
6. Fill in project details:
   - **Project Name**: `pt-jaminan-solusi-bisnis-blog`
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users (Southeast Asia)
7. Click "Create new project"
8. Wait for the project to be created (2-3 minutes)

## Step 2: Get Project Credentials

1. Go to Project Settings > API
2. Copy the following values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role** (optional): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Copy the contents from `.env.local.example`
3. Replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
JWT_SECRET=your_secure_jwt_secret_for_admin_auth
```

## Step 4: Set Up Database Tables

Go to the SQL Editor in Supabase and run the following queries:

### 4.1 Create Categories Table

```sql
CREATE TABLE blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- hex color code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 Create Tags Table

```sql
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.3 Create Blog Posts Table

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  read_time INTEGER DEFAULT 5,
  meta_title VARCHAR(255),
  meta_description TEXT,
  author_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES blog_categories(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.4 Create Join Tables

```sql
-- Posts and Tags relationship
CREATE TABLE blog_post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Blog images (for multiple images per post)
CREATE TABLE blog_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.5 Create Indexes

```sql
-- Improve query performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);
```

### 4.6 Set Up RLS (Row Level Security)

```sql
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Categories are viewable by everyone" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Tags are viewable by everyone" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Post tags are viewable by everyone" ON blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Blog images are viewable by everyone" ON blog_images
  FOR SELECT USING (true);
```

## Step 5: Insert Sample Data

```sql
-- Insert sample categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Umroh', 'umroh', 'Informasi seputar ibadah umroh', '#2563eb'),
('Wisata Domestik', 'wisata-domestik', 'Destinasi wisata dalam negeri', '#16a34a'),
('Tips Travel', 'tips-travel', 'Tips dan panduan perjalanan', '#dc2626'),
('Hotel & Akomodasi', 'hotel-akomodasi', 'Rekomendasi penginapan', '#9333ea'),
('Kuliner', 'kuliner', 'Kuliner khas daerah', '#ea580c'),
('Panduan Visa', 'panduan-visa', 'Informasi pembuatan visa', '#0891b2');

-- Insert sample tags
INSERT INTO blog_tags (name, slug) VALUES
('umroh', 'umroh'),
('travel', 'travel'),
('tips', 'tips'),
('haji', 'haji'),
('visa', 'visa'),
('hotel', 'hotel'),
('maskapai', 'maskapai'),
('asuransi', 'asuransi'),
('panduan', 'panduan'),
('promo', 'promo');
```

## Step 6: Test the Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/blog`
3. You should see the blog page with "Belum Ada Artikel" message

## Step 7: Create First Blog Post

You can create blog posts through:
1. **Direct SQL**: Insert via Supabase SQL Editor
2. **Admin Panel**: Use the built-in admin system at `/admin`
3. **API**: Use the REST API endpoints

### Sample Blog Post (SQL)

```sql
-- First, get the category ID
SELECT id FROM blog_categories WHERE slug = 'tips-travel';

-- Insert a sample post (replace category_id with actual ID)
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
  'Simak panduan lengkap persiapan umroh bagi jamaah yang pertama kali berangkat, mulai dari dokumen hingga persiapan fisik dan mental.',
  '<h2>Persiapan Dokumen</h2><p>Sebelum berangkat umroh, pastikan semua dokumen berikut sudah disiapkan:</p><ul><li>Paspor yang masih berlaku minimal 8 bulan</li><li>Visa umroh</li><li>Sertifikat vaksinasi</li><li>Foto ukuran paspor</li></ul><h2>Persiapan Fisik</h2><p>Ibadah umroh membutuhkan stamina yang baik...</p>',
  'published',
  8,
  'Panduan Lengkap Persiapan Umroh 2025',
  'Panduan lengkap persiapan umroh untuk jamaah pertama kali dengan tips praktis dan informasi penting.',
  'uuid-of-tips-travel-category',
  NOW()
);
```

## Step 8: Verify Everything Works

1. Check the blog page displays posts
2. Test search functionality
3. Test category filtering
4. Test individual post pages
5. Test admin login (username: admin, password: admin123)

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your domain is added to Supabase CORS settings
2. **Connection Timeout**: Check your environment variables are correct
3. **Permission Errors**: Ensure RLS policies are set up correctly
4. **Build Errors**: Make sure all environment variables are set in production

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the SQL query history in Supabase
- Check browser console for specific error messages
- Ensure all tables and policies are created correctly