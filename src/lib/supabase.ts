import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Blog post types
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  meta_title?: string
  meta_description?: string
  featured_image?: string
  category_id: string
  author_id: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string
  category?: BlogCategory
  tags?: BlogTag[]
  images?: BlogImage[]
  author?: {
    id: string
    email: string
    user_metadata?: {
      name?: string
      avatar_url?: string
    }
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface BlogImage {
  id: string
  post_id: string
  image_url: string
  alt_text?: string
  caption?: string
  sort_order: number
  created_at: string
}

// Blog CRUD functions
export const blogApi = {
  // Posts
  async getPosts(options?: {
    limit?: number
    offset?: number
    category?: string
    tag?: string
    search?: string
    status?: 'draft' | 'published' | 'archived'
  }) {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        tags:blog_post_tags(blog_tags(*)),
        images:blog_images(*)
      `)

    // Apply filters
    if (options?.category) {
      query = query.eq('category.slug', options.category)
    }

    if (options?.tag) {
      query = query.contains('tags', [{ slug: options.tag }])
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%,content.ilike.%${options.search}%`)
    }

    if (options?.status) {
      query = query.eq('status', options.status)
    } else {
      query = query.eq('status', 'published')
    }

    // Apply ordering and pagination
    query = query
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }

    return data as BlogPost[]
  },

  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        tags:blog_post_tags(blog_tags(*)),
        images:blog_images(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      throw error
    }

    return data as BlogPost
  },

  async createPost(post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    return data as BlogPost
  },

  async updatePost(id: string, updates: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      throw error
    }

    return data as BlogPost
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    return data as BlogCategory[]
  },

  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      throw error
    }

    return data as BlogCategory
  },

  async createCategory(category: Partial<BlogCategory>) {
    const { data, error } = await supabase
      .from('blog_categories')
      .insert(category)
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      throw error
    }

    return data as BlogCategory
  },

  // Tags
  async getTags() {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching tags:', error)
      throw error
    }

    return data as BlogTag[]
  },

  async createTag(tag: Partial<BlogTag>) {
    const { data, error } = await supabase
      .from('blog_tags')
      .insert(tag)
      .select()
      .single()

    if (error) {
      console.error('Error creating tag:', error)
      throw error
    }

    return data as BlogTag
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(path, file)

    if (error) {
      console.error('Error uploading image:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(path)

    return publicUrl
  },

  // Search posts
  async searchPosts(query: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        category:blog_categories(name, slug)
      `)
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error searching posts:', error)
      throw error
    }

    return data
  }
}