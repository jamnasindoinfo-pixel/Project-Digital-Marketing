# Blog System Design Document
**Date:** 2025-01-04
**Project:** Dynamic Blog System for SEO Optimization
**Architecture:** VPS + Supabase + Next.js 15

## Overview

This document outlines the design for implementing a dynamic blog system to enhance SEO performance for the travel marketing website. The system will use Next.js 15 with App Router, Supabase for backend, and VPS hosting for optimal performance and cost efficiency.

## Purpose & Requirements

### Primary Goals
- **SEO Enhancement:** Create dynamic, searchable content for improved search rankings
- **Content Management:** Enable easy blog post creation and management
- **Cost Efficiency:** Minimize hosting and infrastructure costs
- **Performance:** Ensure fast loading times and good user experience

### Technical Requirements
- URL structure: `/blog/[category]/[slug]` for SEO optimization
- Admin panel integration with existing authentication system
- Responsive design for mobile and desktop
- Real-time content updates
- Image optimization and CDN integration
- Structured data for SEO

## Architecture Overview

### Technology Stack
- **Frontend:** Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** VPS Niagahoster with Nginx reverse proxy
- **Deployment:** PM2 process manager with SSL certificates
- **Domain:** Custom domain with Let's Encrypt SSL

### System Architecture
```
VPS Niagahoster (Ubuntu 22.04)
├── Nginx (Port 80/443) - Web Server & Reverse Proxy
├── Next.js App (Port 3000) - Blog & Admin Panel
├── PM2 - Process Manager
├── SSL Certificate (Let's Encrypt)
├── Firewall (UFW)
└── Daily Backups

External Services:
├── Supabase (Database + Auth + Storage)
└── Domain DNS Configuration
```

## Database Schema

### Supabase Tables

#### blog_posts
```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES blog_categories(id),
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);
```

#### blog_categories
```sql
CREATE TABLE blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### blog_tags
```sql
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### blog_post_tags
```sql
CREATE TABLE blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

#### blog_images
```sql
CREATE TABLE blog_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Routes Structure

### Blog Management APIs
- `GET/POST /api/blog/posts` - List and create blog posts
- `GET/PUT/DELETE /api/blog/posts/[id]` - Manage individual posts
- `GET/POST /api/blog/categories` - Category management
- `GET/POST /api/blog/tags` - Tag management
- `GET /api/blog/search` - Search functionality
- `GET /api/blog/sitemap` - Dynamic sitemap generation

### File Upload API
- `POST /api/blog/upload` - Image upload to Supabase Storage

## Component Architecture

### Frontend Components

#### Blog Pages
```
src/app/blog/
├── page.tsx                    # Blog listing page
├── [category]/
│   ├── page.tsx               # Category-specific posts
│   └── [slug]/
│       └── page.tsx           # Individual blog post
├── category/
│   └── [slug]/
│       └── page.tsx           # Category landing page
├── tag/
│   └── [slug]/
│       └── page.tsx           # Tag page
└── search/
    └── page.tsx               # Search results
```

#### Components
```
src/components/blog/
├── BlogPostCard.tsx           # Blog post preview card
├── BlogPostContent.tsx        # Full blog post content
├── BlogPagination.tsx         # Pagination component
├── BlogSearch.tsx             # Search functionality
├── BlogCategories.tsx         # Category listing
├── BlogTags.tsx               # Tag cloud/list
└── RelatedPosts.tsx           # Related posts suggestion
```

#### Admin Components
```
src/app/admin/blog/
├── page.tsx                   # Blog management dashboard
├── posts/
│   ├── page.tsx              # Posts listing
│   ├── create/
│   │   └── page.tsx          # Create new post
│   └── [id]/
│       ├── page.tsx          # Edit post
│       └── page.tsx          # Post preview
├── categories/
│   ├── page.tsx              # Category management
│   └── create/
│       └── page.tsx          # Create category
└── tags/
    ├── page.tsx              # Tag management
    └── create/
        └── page.tsx          # Create tag
```

## SEO Implementation

### Meta Data Generation
```typescript
// Dynamic meta generation for blog posts
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
      url: `${SITE_URL}/blog/${post.category.slug}/${post.slug}`,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image]
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.category.slug}/${post.slug}`
    }
  }
}
```

### Structured Data
```typescript
// BlogPosting schema for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.featured_image,
  "author": {
    "@type": "Organization",
    "name": "Nama Travel"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nama Travel"
  },
  "datePublished": post.published_at,
  "dateModified": post.updated_at,
  "mainEntityOfPage": `${SITE_URL}/blog/${post.category.slug}/${post.slug}`
}
```

### Sitemap Generation
```typescript
// Dynamic sitemap for blog content
export async function GET() {
  const posts = await getAllPublishedPosts()
  const categories = await getAllCategories()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>${SITE_URL}/blog/${post.category.slug}/${post.slug}</loc>
          <lastmod>${post.updated_at}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
      ${categories.map(category => `
        <url>
          <loc>${SITE_URL}/blog/category/${category.slug}</loc>
          <lastmod>${category.updated_at}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `).join('')}
    </urlset>`

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  })
}
```

## Deployment Configuration

### Environment Variables
```bash
# .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
JWT_SECRET=your-jwt-secret
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'blog-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/your-blog-repo',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/blog-app-error.log',
    out_file: '/var/log/pm2/blog-app-out.log',
    log_file: '/var/log/pm2/blog-app-combined.log',
    time: true
  }]
}
```

## Cost Analysis

### Annual Cost Breakdown
- **VPS Niagahoster:** Rp 100-150k/bulan = Rp 1.2-1.8M/tahun
- **Domain (.com):** Rp 150k/tahun
- **Supabase:** Free tier (500MB database)
- **Total:** ~Rp 1.35-1.95M/tahun

### Benefits vs Alternatives
- ✅ **Full control** over environment and configuration
- ✅ **Better performance** with dedicated resources
- ✅ **SSL certificates** included via Let's Encrypt
- ✅ **Scalable** architecture for future growth
- ✅ **Cost-effective** compared to managed hosting

## Implementation Phases

### Phase 1: Database Setup (Week 1)
- Create Supabase project
- Set up database schema
- Configure authentication
- Test database connections

### Phase 2: Backend Development (Week 2)
- Implement API routes
- Set up Supabase client
- Create CRUD operations
- File upload functionality

### Phase 3: Frontend Development (Week 3-4)
- Blog listing and detail pages
- Admin panel integration
- Search functionality
- Responsive design

### Phase 4: SEO Optimization (Week 5)
- Meta data generation
- Structured data implementation
- Sitemap generation
- Performance optimization

### Phase 5: Deployment (Week 6)
- VPS setup and configuration
- Nginx reverse proxy setup
- SSL certificate installation
- CI/CD pipeline setup

### Phase 6: Testing & Launch (Week 7)
- Unit and integration testing
- Performance testing
- SEO validation
- Production deployment

## Success Metrics

### SEO Metrics
- Organic traffic increase (target: 50% within 3 months)
- Search engine rankings improvement
- Site crawlability and indexing
- Page load speed (< 3 seconds)

### User Engagement
- Time on page
- Bounce rate reduction
- Social shares
- Comment engagement

### Technical Performance
- Site uptime (> 99.9%)
- Page speed scores (> 90)
- Mobile responsiveness
- Core Web Vitals compliance

## Future Enhancements

### Phase 2 Features
- Multi-language support
- Advanced search with filters
- Email subscription system
- Social media integration
- Advanced analytics dashboard

### Phase 3 Features
- User-generated content
- Comment system
- Social login integration
- Content recommendation engine
- API for mobile app

## Security Considerations

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on API endpoints

### Authentication
- Admin panel access control
- JWT token management
- Session security
- Password policies

### Infrastructure Security
- Firewall configuration
- SSL/TLS encryption
- Regular security updates
- Backup and recovery procedures

---

**Next Steps:** Proceed with Phase 5 (Worktree Setup) to create isolated development environment for implementation.